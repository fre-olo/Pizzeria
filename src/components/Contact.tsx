import { MapPin, MessageCircle, Navigation } from "lucide-react";

export default function Contact() {
  const phone = "0705367917";

  const message = `Hej! Jag vill beställa pizza från La Sacra.

Namn:
Önskad hämtningstid:
Pizzor:`;

  const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;

  const mapsLink =
    "https://www.google.com/maps/search/?api=1&query=Romma+R%C3%B6nn%C3%A4sv%C3%A4gen+36%2C+793+91+Leksand";

  return (
    <section id="kontakt" className="bg-[#F5EFE3] px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-4 font-serif text-4xl text-[#292016]">
          Hitta till oss
        </h2>

        <p className="mb-10 text-[#695548]">
          Välkommen till vår lilla vedugnspizzeria i ett garage i Berg, utanför
          Leksand.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Adress */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
            <MapPin size={32} className="mb-4 text-[#77734A]" />

            <h3 className="mb-3 text-xl font-semibold">Besök oss</h3>

            <p className="text-[#695548]">
              Berg Rönnäsvägen 36
              <br />
              793 91 Leksand
            </p>

            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#77734A] px-6 py-3 text-white transition hover:bg-[#5C5939]"
            >
              <Navigation size={18} />
              Vägbeskrivning
            </a>
          </div>

          {/* Kontakt */}
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm">
            <MessageCircle size={32} className="mb-4 text-[#77734A]" />

            <h3 className="mb-3 text-xl font-semibold">Kontakta oss</h3>

            <p className="mb-2 text-[#695548]">
              Beställ gärna din pizza via SMS.
            </p>

            <p className="font-semibold text-[#292016]">070-536 79 17</p>

            <a
              href={smsLink}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#77734A] px-6 py-3 text-white transition hover:bg-[#5C5939]"
            >
              <MessageCircle size={18} />
              Skicka SMS
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
