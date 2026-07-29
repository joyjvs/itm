import { PaginationMeta } from "./pagination.types";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId: string; // obligatorio, referencia a Category
  images: string[]; // URLs de imágenes subidas
  stock: number;
  sku?: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

// Interfaz para la creación de un Producto (si aplica)
export type CreateProductPayload = Omit<
  Product,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProductPayload = Partial<CreateProductPayload>;

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
