import { FaInstagram, FaTiktok } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#211A13] text-white py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
        <h2 className="font-serif text-2xl">Pizzerian i Berg</h2>

        <p className="text-stone-400 text-sm">Vedugnspizza i Berg, Leksand</p>

        {/* Sociala medier */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/lasacraleksand/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Besök vår Instagram"
            className="hover:text-[#C4A66A] transition-colors"
          >
            <FaInstagram size={28} />
          </a>

          <a
            href="https://www.tiktok.com/@lasacraleksand"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Besök vår TikTok"
            className="hover:text-[#C4A66A] transition-colors"
          >
            <FaTiktok size={26} />
          </a>
        </div>

        <p className="text-stone-500 text-xs mt-4">
          © {new Date().getFullYear()} La Sacra Pizzeria
        </p>
      </div>
    </footer>
  );
}
