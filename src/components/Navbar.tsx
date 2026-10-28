import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Meny", href: "#meny" },
    { name: "Beställ", href: "#bestall" },
    { name: "Om oss", href: "#om-oss" },
    { name: "Kontakt", href: "#kontakt" },
  ];

  return (
    <header className="bg-[#292016] text-white">
      <nav className="max-w-6xl mx-auto px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logga och namn */}
          <a href="#" className="flex items-center gap-3 min-w-0">
            <img
              src="/plogga.png"
              alt="La Sacra Pizzeria"
              className="h-12 w-12 object-contain shrink-0"
            />

            <span className="font-serif text-xl md:text-2xl">
              La Sacra Pizzeria
            </span>
          </a>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-[#C4A66A] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobilknapp */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 shrink-0"
            aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobilnavigation */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden flex flex-col gap-5 pt-6 pb-3 border-t border-white/10 mt-4"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-lg hover:text-[#C4A66A] transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
