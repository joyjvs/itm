export interface Product{
  id: number;
  name: string;
  price: number;
  image: string;
}

export interface ProductsByCategory {
  todos: Product[];
  bebidas: Product[];
  carnes: Product[];
  confituras: Product[];
}