import { pizzas } from "../data/menu";

export default function Menu() {
  return (
    <section id="meny" className="py-20 px-6 bg-[#F5EFE3]">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-4xl text-center mb-4">Vår meny</h2>

        <p className="text-center text-gray-600 mb-12">
          Våra pizzor bakas med kärlek i vedugn. Pizzorna toppas med färsk
          ruccola och/eller prosciutto.
        </p>

        <div className="space-y-6">
          {pizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="flex justify-between gap-5 border-b border-stone-300 pb-5"
            >
              <div>
                <h3 className="text-xl font-semibold">{pizza.name}</h3>
                <p className="text-gray-600 mt-1">{pizza.ingredients}</p>
              </div>

              <span className="font-semibold whitespace-nowrap">
                {pizza.price} kr
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
