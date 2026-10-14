import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  {
    src: "/IMG_7771.jpeg",
    alt: "Pizzerian i garaget",
  },
  {
    src: "/IMG_7786.jpeg",
    alt: "Vår vedugn",
  },
  {
    src: "/IMG_7804.jpeg",
    alt: "Nygräddad vedugnspizza",
  },
  {
    src: "/IMG_8120.jpeg",
    alt: "Nygräddad vedugnspizza",
  },
  {
    src: "/IMG_8121.jpeg",
    alt: "Nygräddad vedugnspizza",
  },
];

export default function About() {
  const [currentIndex, setCurrentIndex] = useState(0);

  function nextImage() {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }

  function previousImage() {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  return (
    <section id="om-oss" className="bg-[#292016] text-white py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Bildgalleri */}
        <div>
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="w-full h-80 md:h-96 object-cover"
            />

            <button
              onClick={previousImage}
              aria-label="Föregående bild"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextImage}
              aria-label="Nästa bild"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Prickar under bilderna */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((image, index) => (
              <button
                key={image.src}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Visa bild ${index + 1}`}
                aria-current={currentIndex === index ? "true" : undefined}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  currentIndex === index
                    ? "bg-[#C4A66A]"
                    : "bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Text om pizzerian */}
        <div>
          <h2 className="font-serif text-4xl mb-6">Om oss</h2>

          <p className="text-stone-200 leading-8">
            Från ett garage till en liten pizzeria i Leksand. En familjär och
            härlig atmosfär där du kan ta med maten eller sitta kvar och koppla
            av. En filosofisk mötespunkt där man kan samla kraft och även hämta
            inspiration. Möjlighet finns för större grupper att hyra lokalen.
          </p>

          <p className="mt-6 font-serif italic text-2xl text-[#C4A66A]">
            Vi ses i garaget!
          </p>
        </div>
      </div>
    </section>
  );
}
