export default function Hero() {
  return (
    <section
      className="min-h-[65vh] bg-cover bg-center flex items-center px-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('/IMG_8129.jpeg')",
      }}
    >
      <div className="max-w-6xl mx-auto w-full text-white">
        <h1 className="font-serif text-5xl md:text-7xl max-w-2xl">
          Äkta vedugnspizza på landet
        </h1>

        <p className="mt-6 text-lg max-w-lg">
          En liten pizzeria i ett garage i Berg, utanför Leksand.
        </p>

        <a
          href="#meny"
          className="inline-block mt-8 bg-[#77734A] px-7 py-3 rounded-md hover:bg-[#5C5939] transition"
        >
          Se vår meny
        </a>
      </div>
    </section>
  );
}
