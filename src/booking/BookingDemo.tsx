import { useEffect, useState } from "react";
import "./booking.css";

type Pizza = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type BookingResult = {
  bookingId: string;
  customerName: string;
  date: string;
  startTime: string;
  pickupTime: string;
  pizzaCount: number;
  totalPrice: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
};

const API = "http://localhost:3001";

function localDate() {
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

export default function BookingDemo() {
  const [menu, setMenu] = useState<Pizza[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const [date, setDate] = useState(localDate());
  const [times, setTimes] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [consent, setConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [confirmation, setConfirmation] = useState<BookingResult | null>(null);

  const pizzaCount = Object.values(quantities).reduce(
    (sum, quantity) => sum + quantity,
    0,
  );

  const totalPrice = menu.reduce(
    (sum, pizza) => sum + pizza.price * (quantities[pizza.id] || 0),
    0,
  );

  useEffect(() => {
    fetch(`${API}/api/menu`)
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data: Pizza[]) => setMenu(data))
      .catch(() => {
        setError("Kunde inte hämta menyn. Kontrollera att servern körs.");
      });
  }, []);

  useEffect(() => {
    setPickupTime("");
    setTimes([]);

    if (pizzaCount === 0 || pizzaCount > 12) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setChecking(true);

      try {
        const params = new URLSearchParams({
          date,
          count: String(pizzaCount),
        });

        const response = await fetch(`${API}/api/availability?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Kunde inte hämta tider.");
        }

        const data: { times: string[] } = await response.json();

        setTimes(data.times);
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(err instanceof Error ? err.message : "Något gick fel.");
      } finally {
        if (!controller.signal.aborted) {
          setChecking(false);
        }
      }
    }

    loadAvailability();

    return () => controller.abort();
  }, [date, pizzaCount]);

  function changeQuantity(id: string, amount: number) {
    setError("");

    setQuantities((previous) => ({
      ...previous,
      [id]: Math.max(0, (previous[id] || 0) + amount),
    }));
  }

  async function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!consent) {
      setError("Du måste godkänna personuppgiftshanteringen.");
      return;
    }

    if (!pickupTime || pizzaCount < 1 || pizzaCount > 12) {
      setError("Kontrollera antal pizzor och upphämtningstid.");
      return;
    }

    const items = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({ id, quantity }));

    setLoading(true);

    try {
      const response = await fetch(`${API}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          phone,
          date,
          pickupTime,
          items,
          notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Bokningen kunde inte genomföras.");
      }

      setConfirmation(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Något gick fel.");
    } finally {
      setLoading(false);
    }
  }

  if (confirmation) {
    return (
      <main className="booking-page">
        <div className="booking-container">
          <div className="booking-card booking-success">
            <div className="booking-check">✓</div>

            <h1>Bokning bekräftad!</h1>

            <p>Tack för din beställning.</p>

            <h2>Bokningsnummer #{confirmation.bookingId}</h2>

            <div className="booking-summary">
              <p>
                <strong>Namn:</strong> {confirmation.customerName}
              </p>

              <p>
                <strong>Datum:</strong> {confirmation.date}
              </p>

              <p>
                <strong>Upphämtning:</strong> {confirmation.pickupTime}
              </p>

              <p>
                <strong>Antal pizzor:</strong> {confirmation.pizzaCount}
              </p>

              <p>
                <strong>Att betala:</strong> {confirmation.totalPrice} kr
              </p>
            </div>

            <h3>Din beställning</h3>

            {confirmation.items.map((item) => (
              <p key={item.id}>
                {item.quantity} × {item.name}
              </p>
            ))}

            <p className="booking-muted">Betalning sker vid upphämtning.</p>

            <button
              className="booking-button"
              onClick={() => window.location.reload()}
            >
              Gör en ny bokning
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="booking-page">
      <div className="booking-container">
        <header className="booking-header">
          <p>LA SACRA PIZZERIA</p>
          <h1>Beställ pizza</h1>
          <span>Välj dina pizzor och när du vill hämta dem.</span>
        </header>

        <div className="booking-notice">
          TESTVERSION – inga riktiga beställningar skickas till pizzerian.
        </div>

        <section className="booking-card">
          <h2>1. Välj dina pizzor</h2>

          <p className="booking-muted">
            Varje pizza tar 5 minuter att tillaga. Du kan beställa upp till 12
            pizzor i testversionen.
          </p>

          {menu.map((pizza) => (
            <div className="booking-pizza" key={pizza.id}>
              <div className="booking-pizza-info">
                <h3>{pizza.name}</h3>
                <p>{pizza.description}</p>
                <strong>{pizza.price} kr</strong>
              </div>

              <div className="booking-quantity">
                <button
                  type="button"
                  aria-label={`Ta bort en ${pizza.name}`}
                  onClick={() => changeQuantity(pizza.id, -1)}
                  disabled={!quantities[pizza.id]}
                >
                  −
                </button>

                <span>{quantities[pizza.id] || 0}</span>

                <button
                  type="button"
                  aria-label={`Lägg till en ${pizza.name}`}
                  onClick={() => changeQuantity(pizza.id, 1)}
                  disabled={pizzaCount >= 12}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          <div className="booking-summary">
            <p>
              <strong>Antal pizzor:</strong> {pizzaCount}
            </p>

            <p>
              <strong>Tillagningstid:</strong> {pizzaCount * 5} minuter
            </p>

            <p>
              <strong>Totalt:</strong> {totalPrice} kr
            </p>
          </div>
        </section>

        <section className="booking-card">
          <h2>2. Välj upphämtningstid</h2>

          <label htmlFor="booking-date">Datum</label>

          <input
            id="booking-date"
            type="date"
            min={localDate()}
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />

          {pizzaCount === 0 ? (
            <p className="booking-muted">
              Välj minst en pizza för att se lediga tider.
            </p>
          ) : checking ? (
            <p>Hämtar lediga tider...</p>
          ) : times.length === 0 ? (
            <p className="booking-muted">
              Inga lediga tider för denna beställning.
            </p>
          ) : (
            <>
              <p className="booking-muted">Tillgängliga upphämtningstider:</p>

              <div className="booking-times">
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={
                      pickupTime === time
                        ? "booking-time selected"
                        : "booking-time"
                    }
                    onClick={() => setPickupTime(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="booking-card">
          <h2>3. Dina uppgifter</h2>

          <form onSubmit={submitBooking}>
            <label htmlFor="booking-name">Namn *</label>
            <input
              id="booking-name"
              type="text"
              value={customerName}
              maxLength={100}
              required
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="För- och efternamn"
            />

            <label htmlFor="booking-phone">Telefonnummer *</label>
            <input
              id="booking-phone"
              type="tel"
              value={phone}
              required
              onChange={(event) => setPhone(event.target.value)}
              placeholder="070 123 45 67"
            />

            <label htmlFor="booking-notes">Övrig information</label>
            <textarea
              id="booking-notes"
              value={notes}
              maxLength={500}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Eventuella önskemål"
              rows={3}
            />

            <label className="booking-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>
                Jag godkänner att mina uppgifter används för att hantera
                bokningen.
              </span>
            </label>

            {error && (
              <p className="booking-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="booking-button"
              disabled={
                loading ||
                checking ||
                !pickupTime ||
                pizzaCount === 0 ||
                !consent
              }
            >
              {loading ? "Bokar..." : "Bekräfta bokning"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
