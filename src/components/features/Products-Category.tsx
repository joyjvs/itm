import { Product, ProductsByCategory } from "@/types/show-product-by-category";

const todos: Product[] = [
  { id: 1, name: "Producto 1", price: 10, image: "/banners-home/8pm.jpg" },
  {
    id: 2,
    name: "Producto 2",
    price: 20,
    image: "/banners-home/08000258.ALIMERKA PERRO MANT C-P-C 10K.JPG",
  },
  {
    id: 3,
    name: "Producto 3",
    price: 30,
    image: "/banners-home/10003758.ALIMERKA GATOS PESC VERD 4K.jpg",
  },
  { id: 4, name: "Producto 4", price: 40, image: "/banners-home/ali-1.jpg" },
];

const bebidas: Product[] = [
  { id: 5, name: "Producto 5", price: 40, image: "/banners-home/ali-2.jpg" },
  { id: 6, name: "Producto 6", price: 40, image: "/banners-home/ali-4.jpg" },
  {
    id: 7,
    name: "Producto 7",
    price: 40,
    image: "/banners-home/ali-16.jpg",
  },
  {
    id: 8,
    name: "Producto 8",
    price: 40,
    image: "/banners-home/alimer-4.jpg",
  },
];

const carnes: Product[] = [
  {
    id: 9,
    name: "Producto 9",
    price: 40,
    image: "/banners-home/pescado-2.jpg",
  },
  {
    id: 9,
    name: "Producto 9",
    price: 40,
    image: "/banners-home/pescado-3.jpg",
  },
  {
    id: 9,
    name: "Producto 9",
    price: 40,
    image: "/banners-home/pescado-6.jpg",
  },
  {
    id: 9,
    name: "Producto 9",
    price: 40,
    image: "/banners-home/pescado-7.jpg",
  },
];

export const products: ProductsByCategory = {
  todos: todos,
  bebidas: bebidas,
  carnes: carnes,
  confituras: todos,
};
