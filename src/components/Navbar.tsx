export default function Navbar() {
  return (
    <header className="bg-[#292016] text-white px-4 py-5">
      <nav className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <img className="h-12" src="/plogga.png" alt="logga" />
          <a href="#" className="text-2xl font-serif">
            La Sacra Pizzeria
          </a>
        </div>

        <div className="flex gap-5 text-sm">
          <a href="#meny">Meny</a>
          <a href="#om-oss">Om oss</a>
          <a href="#kontakt">Kontakt</a>
        </div>
      </nav>
    </header>
  );
}
