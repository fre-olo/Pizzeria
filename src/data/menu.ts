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
    price: 120,
  },
  {
    id: 2,
    name: "Vesuvio",
    ingredients: "Tomatsås, ost, skinka",
    price: 120,
  },
  {
    id: 3,
    name: "Capricciosa",
    ingredients: "Tomatsås, ost, skinka, champinjoner",
    price: 120,
  },

  {
    id: 4,
    name: "Bussola",
    ingredients: "Tomatsås, ost, skinka, räkor",
    price: 130,
  },
  {
    id: 5,
    name: "Bianca con Pero",
    ingredients:
      "Créme fraiche, ost, päron, ädelost, valnötter, ringlad honung",
    price: 145,
  },
];
