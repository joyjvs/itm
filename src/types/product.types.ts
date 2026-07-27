// src/types/product.types.ts
import { PaginationMeta } from "./pagination.types";

// Interfaz de un Producto
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  year?: number; // Dato adicional del ejemplo anterior
  createdAt: string;
  updatedAt: string;
}

// Interfaz para la creación de un Producto (si aplica)
export type CreateProductPayload = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;

// Interfaz para los parámetros de filtrado
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "name" | "price" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Interfaz para la respuesta de la API (con paginación)
export interface ProductsResponse {
  data: Product[];
  meta: PaginationMeta;
}
