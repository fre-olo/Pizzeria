import { Phone } from "lucide-react";
export default function Contact() {
  return (
    <section id="kontakt" className="py-20 px-6 bg-[#F5EFE3]">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-4xl mb-8">Kontakt & öppettider</h2>

        <p className="mb-4">Vi finns i Berg utanför Leksand.</p>

        <a
          href="tel:+46705367917"
          className="flex items-center justify-center gap-2 mb-4 hover:text-[#C4A66A] transition-colors"
        >
          <Phone size={20} />
          <span>070-536 79 17</span>
        </a>

        <p className="mb-4">Betalning sker via Swish eller kontant.</p>

        <a
          href="https://www.google.com/maps/place/Romma+R%C3%B6nn%C3%A4sv%C3%A4gen+36,+793+91+Leksand/@60.7089151,15.0935333,19.48z/data=!4m6!3m5!1s0x46679a806fcc123f:0x2a271f31d290bde5!8m2!3d60.7091256!4d15.0938713!16s%2Fg%2F11cppq7rxw?entry=ttu&g_ep=EgoyMDI2MTAxMS4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 bg-[#77734A] text-white px-6 py-3 rounded-md hover:bg-[#5C5939] transition"
        >
          Hitta till Berg
        </a>
      </div>
    </section>
  );
}
