export default function Hero() {
  return (
    <section
      className="min-h-[65vh] bg-cover bg-center flex items-center px-6 py-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('/IMG_8129.jpeg')",
      }}
    >
      <div className="max-w-6xl mx-auto w-full text-white">
        {/* Nästa pizzabak */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C4A66A]/60 bg-[#292016]/70 px-4 py-2 text-sm font-medium text-[#F5EBDD]">
            <span className="h-2 w-2 rounded-full bg-[#C4A66A]" />
            Nästa pizzabak: 30–31 oktober
          </span>
        </div>

        <h1 className="font-serif text-5xl md:text-7xl max-w-2xl">
          Äkta vedugnspizza på landet
        </h1>

        <p className="mt-6 text-lg max-w-lg">
          En liten pizzeria i ett garage i Berg, utanför Leksand.
        </p>

        {/* Knappar */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#meny"
            className="inline-flex items-center justify-center bg-[#77734A] px-7 py-3 rounded-md hover:bg-[#5C5939] transition font-medium"
          >
            Se vår meny
          </a>

          <a
            href="#bestall"
            className="inline-flex items-center justify-center border-2 border-white px-7 py-3 rounded-md hover:bg-white hover:text-[#292016] transition font-medium"
          >
            Beställ pizza
          </a>
        </div>
      </div>
    </section>
  );
}
