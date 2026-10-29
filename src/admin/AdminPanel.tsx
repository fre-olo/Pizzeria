import { useCallback, useEffect, useState } from "react";
import "./admin.css";

const API = "http://localhost:3001";

type BookingStatus = "confirmed" | "ready" | "cancelled";

type Booking = {
  id: number;
  customerName: string;
  phone: string;
  date: string;
  startTime: string;
  pickupTime: string;
  pizzaCount: number;
  totalPrice: number;
  notes: string;
  status: BookingStatus;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

function today() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export default function AdminPanel() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState("");
  const [date, setDate] = useState(today());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadBookings = useCallback(async () => {
    const response = await fetch(
      `${API}/api/admin/bookings?date=${encodeURIComponent(date)}`,
      { credentials: "include" },
    );

    if (!response.ok) {
      throw new Error("Kunde inte hämta bokningarna.");
    }

    const data: Booking[] = await response.json();
    setBookings(data);
  }, [date]);

  useEffect(() => {
    fetch(`${API}/api/admin/session`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setAuthenticated(data.authenticated === true);
      })
      .catch(() => setError("Kunde inte kontakta servern."))
      .finally(() => setCheckingSession(false));
  }, []);

  useEffect(() => {
    if (!authenticated) return;

    loadBookings().catch((err) => {
      setError(err.message);
    });
  }, [authenticated, loadBookings]);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Felaktigt lösenord.");
      }

      setPassword("");
      setAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Inloggningen misslyckades.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      const response = await fetch(`${API}/api/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error();

      setAuthenticated(false);
      setBookings([]);
      setError("");
    } catch {
      setError("Kunde inte logga ut.");
    }
  }

  async function updateStatus(booking: Booking, status: BookingStatus) {
    if (
      status === "cancelled" &&
      !window.confirm(
        `Vill du avboka beställning #${booking.id}? Tiden frigörs.`,
      )
    ) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/admin/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Kunde inte ändra status.");
      }

      await loadBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  const active = bookings.filter((booking) => booking.status !== "cancelled");

  const totalPizzas = active.reduce(
    (sum, booking) => sum + booking.pizzaCount,
    0,
  );

  const revenue = active.reduce((sum, booking) => sum + booking.totalPrice, 0);

  if (checkingSession) {
    return <main className="admin-page">Kontrollerar inloggning...</main>;
  }

  if (!authenticated) {
    return (
      <main className="admin-page">
        <div className="admin-login">
          <h1>La Sacra Admin</h1>
          <p>Logga in för att hantera bokningar.</p>

          <form onSubmit={login}>
            <label htmlFor="admin-password">Lösenord</label>

            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            {error && <p className="admin-error">{error}</p>}

            <button disabled={loading} type="submit">
              {loading ? "Loggar in..." : "Logga in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-container">
        <header className="admin-header">
          <div>
            <p>LA SACRA PIZZERIA</p>
            <h1>Adminpanel</h1>
          </div>

          <button className="admin-logout" onClick={logout}>
            Logga ut
          </button>
        </header>

        <div className="admin-toolbar">
          <label htmlFor="admin-date">Visa bokningar för</label>

          <input
            id="admin-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />

          <button
            onClick={() =>
              loadBookings().catch(() =>
                setError("Kunde inte uppdatera bokningarna."),
              )
            }
          >
            Uppdatera
          </button>
        </div>

        {error && <p className="admin-error">{error}</p>}

        <div className="admin-stats">
          <div>
            <span>Bokningar</span>
            <strong>{active.length}</strong>
          </div>

          <div>
            <span>Pizzor</span>
            <strong>{totalPizzas}</strong>
          </div>

          <div>
            <span>Ordervärde</span>
            <strong>{revenue} kr</strong>
          </div>
        </div>

        <h2>Beställningar</h2>

        {bookings.length === 0 ? (
          <div className="admin-empty">Inga bokningar för detta datum.</div>
        ) : (
          <div className="admin-bookings">
            {bookings.map((booking) => (
              <article className="admin-booking" key={booking.id}>
                <div className="admin-booking-top">
                  <div>
                    <span className="admin-time">{booking.pickupTime}</span>

                    <h3>{booking.customerName}</h3>
                    <p>Bokning #{booking.id}</p>
                  </div>

                  <span className={`admin-status ${booking.status}`}>
                    {booking.status === "confirmed"
                      ? "Bekräftad"
                      : booking.status === "ready"
                        ? "Färdig"
                        : "Avbokad"}
                  </span>
                </div>

                <div className="admin-details">
                  <p>
                    <strong>Telefon:</strong>{" "}
                    <a href={`tel:${booking.phone}`}>{booking.phone}</a>
                  </p>

                  <p>
                    <strong>Tillagning:</strong> {booking.startTime}–
                    {booking.pickupTime}
                  </p>

                  <p>
                    <strong>Antal:</strong> {booking.pizzaCount}
                  </p>

                  <p>
                    <strong>Totalt:</strong> {booking.totalPrice} kr
                  </p>
                </div>

                <div className="admin-order-items">
                  <h4>Pizzor</h4>

                  {booking.items.map((item) => (
                    <p key={item.id}>
                      {item.quantity} × {item.name}
                    </p>
                  ))}
                </div>

                {booking.notes && (
                  <p className="admin-notes">
                    <strong>Övrigt:</strong> {booking.notes}
                  </p>
                )}

                {booking.status !== "cancelled" && (
                  <div className="admin-actions">
                    {booking.status === "confirmed" && (
                      <button
                        disabled={loading}
                        className="admin-ready"
                        onClick={() => updateStatus(booking, "ready")}
                      >
                        Markera färdig
                      </button>
                    )}

                    {booking.status === "ready" && (
                      <button
                        disabled={loading}
                        onClick={() => updateStatus(booking, "confirmed")}
                      >
                        Återställ status
                      </button>
                    )}

                    <button
                      disabled={loading}
                      className="admin-cancel"
                      onClick={() => updateStatus(booking, "cancelled")}
                    >
                      Avboka
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
