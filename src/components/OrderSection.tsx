import { CalendarDays, MessageCircle, Info, Wallet } from "lucide-react";

export default function OrderSection() {
  const phone = "0705367917";

  const message = `Hej! Jag vill beställa pizza från La Sacra.

Namn:
Önskad hämtningstid:
Pizzor:`;

  const smsLink = `sms:${phone}?body=${encodeURIComponent(message)}`;

  return (
    <section
      id="bestall"
      className="bg-[#EAE0D0] px-5 py-16 text-[#34251B] md:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.2em] text-[#9B623C]">
            Vedugnsbakat med kärlek
          </p>
          <h2 className="mb-3 font-serif text-4xl md:text-5xl">
            Beställ din pizza
          </h2>
          <p className="text-[#705B49]">
            Välkommen till La Sacra Pizzeria i Berg!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Öppettider */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-3 text-xl font-semibold">
              <CalendarDays className="text-[#8D5333]" />
              Våra öppettider
            </h3>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Fredag 30 oktober</p>
                <p className="text-sm text-[#806C5A]">Kväll</p>
              </div>
              <p className="font-semibold">17:00–21:00</p>
            </div>

            <hr className="my-5 border-[#E8DED3]" />

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Lördag 31 oktober</p>
                <p className="text-sm text-[#806C5A]">Lunch</p>
              </div>
              <p className="font-semibold">11:00–14:00</p>
            </div>
          </div>

          {/* Beställning */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-3 text-xl font-semibold">
              <MessageCircle className="text-[#8D5333]" />
              Så här beställer du
            </h3>

            <p className="mb-5 text-[#695548]">
              Skicka ett SMS med ditt namn, önskad hämtningstid och vilka pizzor
              du vill beställa.
            </p>

            <div className="rounded-xl bg-[#EADBC9] p-4">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <Info size={19} className="text-[#8D5333]" />
                Begränsat antal pizzor
              </div>
              <p className="text-sm leading-relaxed text-[#695548]">
                Vi bakar max 3 pizzor per 15 minuter för att alla ska få rykande
                färsk pizza. Först till kvarn gäller för hämtningstiderna!
              </p>
            </div>
          </div>
        </div>

        {/* SMS-knapp */}
        <div className="mt-8 text-center">
          <a
            href={smsLink}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#75452D] px-8 py-4 font-semibold text-white transition hover:bg-[#5D3522]"
          >
            <MessageCircle size={21} />
            Beställ via SMS
          </a>

          <p className="mt-3 text-sm text-[#705B49]">SMS: 070-536 79 17</p>
        </div>

        {/* Betalning */}
        <div className="mt-10 flex flex-col items-center gap-3 text-center">
          <Wallet size={28} className="text-[#8D5333]" />
          <h3 className="text-xl font-semibold">Betalning vid avhämtning</h3>
          <p className="text-[#695548]">
            Betala med Swish eller kontanter när du hämtar dina pizzor.
          </p>
        </div>

        <p className="mt-10 text-center font-serif text-2xl italic text-[#75452D]">
          Varmt välkomna med era beställningar!
        </p>
      </div>
    </section>
  );
}
