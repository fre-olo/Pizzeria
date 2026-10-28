export type Pizza = {
  id: number;
  name: string;
  ingredients: string;
  price: number;
};

export const pizzas: Pizza[] = [
  {
    id: 1,
    name: "Margherita",
    ingredients: "Tomatsås, ost",
    price: 140,
  },
  {
    id: 2,
    name: "Vesuvio",
    ingredients: "Tomatsås, ost, skinka",
    price: 140,
  },
  {
    id: 3,
    name: "Capricciosa",
    ingredients: "Tomatsås, ost, skinka, champinjoner",
    price: 140,
  },

  {
    id: 4,
    name: "Rosso Diavolo",
    ingredients: "Tomatsås, ost, salami",
    price: 165,
  },
  {
    id: 5,
    name: "Rosso Manza",
    ingredients: "Tomatsås, ost, rostbiff, hemmaslungad bearnnaisesås",
    price: 165,
  },
  {
    id: 6,
    name: "Bianca Manza",
    ingredients: "Créme fraÎche, ost, rostbiff, hemmaslungad bearnnaisesås",
    price: 165,
  },
  {
    id: 7,
    name: "Bianca con Pero",
    ingredients:
      "Créme fraÎche, ost, päron, ädelost, valnötter, ringlad honung",
    price: 165,
  },
];
