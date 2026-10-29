import express from "express";
import cors from "cors";
import { db } from "./database.js";
import { menu } from "./menu.js";
import "dotenv/config";
import session from "express-session";
import { timingSafeEqual } from "node:crypto";

const app = express();
const PORT = 3001;

const OPEN = 17 * 60;
const CLOSE = 21 * 60;
const MINUTES_PER_PIZZA = 5;
const MAX_PIZZAS = 12;
const STEP = 5;

app.use(
  cors({
    origin: /^http:\/\/(localhost|127\.0\.0\.1):517\d$/,
    credentials: true,
  }),
);
app.use(express.json({ limit: "20kb" }));
if (
  !process.env.ADMIN_PASSWORD ||
  !process.env.SESSION_SECRET ||
  process.env.SESSION_SECRET.length < 32
) {
  throw new Error("ADMIN_PASSWORD eller SESSION_SECRET saknas i .env");
}

app.use(
  session({
    name: "la_sacra_admin",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Endast lokal utveckling
      maxAge: 8 * 60 * 60 * 1000,
    },
  }),
);

function passwordMatches(input) {
  const expected = Buffer.from(process.env.ADMIN_PASSWORD);
  const received = Buffer.from(input);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

function requireAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({
      error: "Du måste logga in.",
    });
  }

  next();
}

function toMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function isValidDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  const parsed = new Date(`${date}T12:00:00Z`);

  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
}

function stockholmNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    minutes: Number(values.hour) * 60 + Number(values.minute),
  };
}

function getBookings(date) {
  return db
    .prepare(
      `
    SELECT start_time, pickup_time
    FROM bookings
    WHERE booking_date = ?
      AND status IN ('confirmed', 'ready')
  `,
    )
    .all(date);
}

function isAvailable(date, start, end) {
  const now = stockholmNow();

  if (date < now.date) return false;
  if (start < OPEN || end > CLOSE) return false;

  if (date === now.date && start <= now.minutes) {
    return false;
  }

  const bookings = getBookings(date);

  return bookings.every((booking) => {
    const bookedStart = toMinutes(booking.start_time);
    const bookedEnd = toMinutes(booking.pickup_time);

    return end <= bookedStart || start >= bookedEnd;
  });
}

function getAvailableTimes(date, count) {
  const duration = count * MINUTES_PER_PIZZA;
  const available = [];

  for (let pickup = OPEN + duration; pickup <= CLOSE; pickup += STEP) {
    const start = pickup - duration;

    if (isAvailable(date, start, pickup)) {
      available.push(toTime(pickup));
    }
  }

  return available;
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const ids = new Set();
  const result = [];
  let count = 0;
  let total = 0;

  for (const item of items) {
    if (
      !item ||
      typeof item.id !== "string" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      ids.has(item.id)
    ) {
      return null;
    }

    const pizza = menu.find((p) => p.id === item.id);

    if (!pizza) return null;

    ids.add(item.id);
    count += item.quantity;
    total += pizza.price * item.quantity;

    result.push({
      id: pizza.id,
      name: pizza.name,
      quantity: item.quantity,
      price: pizza.price,
    });
  }

  if (count < 1 || count > MAX_PIZZAS) {
    return null;
  }

  return { items: result, count, total };
}

// Hämta pizzamenyn
app.get("/api/menu", (req, res) => {
  res.json(menu);
});

// Hämta lediga upphämtningstider
app.get("/api/availability", (req, res) => {
  const { date } = req.query;
  const count = Number(req.query.count);

  if (
    !isValidDate(date) ||
    !Number.isInteger(count) ||
    count < 1 ||
    count > MAX_PIZZAS
  ) {
    return res.status(400).json({
      error: "Ogiltigt datum eller antal pizzor.",
    });
  }

  res.json({
    date,
    pizzaCount: count,
    duration: count * MINUTES_PER_PIZZA,
    times: getAvailableTimes(date, count),
  });
});

// Skapa bokning
app.post("/api/bookings", (req, res) => {
  const {
    customerName,
    phone,
    date,
    pickupTime,
    items,
    notes = "",
  } = req.body ?? {};

  const order = validateItems(items);

  if (
    typeof customerName !== "string" ||
    customerName.trim().length < 2 ||
    customerName.length > 100 ||
    typeof phone !== "string" ||
    !/^\+?[\d\s()-]{7,20}$/.test(phone) ||
    !isValidDate(date) ||
    typeof pickupTime !== "string" ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime) ||
    typeof notes !== "string" ||
    notes.length > 500 ||
    !order
  ) {
    return res.status(400).json({
      error: "Kontrollera dina bokningsuppgifter.",
    });
  }

  const end = toMinutes(pickupTime);
  const start = end - order.count * MINUTES_PER_PIZZA;

  if (end % STEP !== 0) {
    return res.status(400).json({
      error: "Ogiltig upphämtningstid.",
    });
  }

  const saveBooking = db.transaction(() => {
    if (!isAvailable(date, start, end)) {
      return null;
    }

    const result = db
      .prepare(
        `
      INSERT INTO bookings (
        customer_name, phone, booking_date,
        start_time, pickup_time, pizza_count,
        total_price, items_json, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        customerName.trim(),
        phone.trim(),
        date,
        toTime(start),
        pickupTime,
        order.count,
        order.total,
        JSON.stringify(order.items),
        notes.trim(),
      );

    return {
      bookingId: result.lastInsertRowid.toString(),
      customerName: customerName.trim(),
      date,
      startTime: toTime(start),
      pickupTime,
      pizzaCount: order.count,
      totalPrice: order.total,
      items: order.items,
    };
  });

  try {
    // IMMEDIATE transaction serialiserar samtidiga skrivningar.
    const booking = saveBooking.immediate();

    if (!booking) {
      return res.status(409).json({
        error: "Tiden är inte längre ledig. Välj en annan.",
      });
    }

    return res.status(201).json(booking);
  } catch (error) {
    console.error("Booking error:", error);

    return res.status(500).json({
      error: "Kunde inte spara bokningen.",
    });
  }
});
// Logga in
app.post("/api/admin/login", (req, res) => {
  const password = req.body?.password;

  if (typeof password !== "string" || !passwordMatches(password)) {
    return res.status(401).json({
      error: "Felaktigt lösenord.",
    });
  }

  req.session.regenerate((error) => {
    if (error) {
      return res.status(500).json({
        error: "Inloggningen misslyckades.",
      });
    }

    req.session.isAdmin = true;

    req.session.save((saveError) => {
      if (saveError) {
        return res.status(500).json({
          error: "Kunde inte skapa session.",
        });
      }

      res.json({ success: true });
    });
  });
});

// Kontrollera inloggning
app.get("/api/admin/session", (req, res) => {
  res.json({
    authenticated: req.session.isAdmin === true,
  });
});

// Logga ut
app.post("/api/admin/logout", requireAdmin, (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: "Kunde inte logga ut.",
      });
    }

    res.clearCookie("la_sacra_admin");
    res.json({ success: true });
  });
});

// Hämta bokningar
app.get("/api/admin/bookings", requireAdmin, (req, res) => {
  const date = req.query.date;

  if (!isValidDate(date)) {
    return res.status(400).json({
      error: "Ogiltigt datum.",
    });
  }

  const bookings = db
    .prepare(
      `
    SELECT
      id,
      customer_name AS customerName,
      phone,
      booking_date AS date,
      start_time AS startTime,
      pickup_time AS pickupTime,
      pizza_count AS pizzaCount,
      total_price AS totalPrice,
      items_json AS itemsJson,
      notes,
      status
    FROM bookings
    WHERE booking_date = ?
    ORDER BY pickup_time ASC
  `,
    )
    .all(date);

  res.json(
    bookings.map(({ itemsJson, ...booking }) => ({
      ...booking,
      items: JSON.parse(itemsJson),
    })),
  );
});

// Ändra bokningsstatus
app.patch("/api/admin/bookings/:id", requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const status = req.body?.status;

  if (
    !Number.isSafeInteger(id) ||
    id < 1 ||
    !["confirmed", "ready", "cancelled"].includes(status)
  ) {
    return res.status(400).json({
      error: "Ogiltig bokning eller status.",
    });
  }

  const existing = db
    .prepare(
      `
      SELECT id, status
      FROM bookings
      WHERE id = ?
    `,
    )
    .get(id);

  if (!existing) {
    return res.status(404).json({
      error: "Bokningen finns inte.",
    });
  }

  // En avbokning kan inte återaktiveras i denna version.
  if (existing.status === "cancelled" && status !== "cancelled") {
    return res.status(409).json({
      error: "Avbokade bokningar kan inte återaktiveras.",
    });
  }

  db.prepare(
    `
      UPDATE bookings
      SET status = ?
      WHERE id = ?
    `,
  ).run(status, id);

  res.json({ success: true, id, status });
});

app.listen(PORT, () => {
  console.log(`La Sacra booking API: http://localhost:${PORT}`);
});
