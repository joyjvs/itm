// src/api/services/products.service.ts
import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
} from "../../types/product.types";

// --- Datos Mock (temporales) ---
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Caramelo Step Caramelo",
    description: "Delicioso caramelo artesanal con sabor a vainilla.",
    price: 15.99,
    category: "bebidas",
    image: "/images/caramelo1.jpg",
    stock: 8,
    year: 1886,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... Agrega más productos mock aquí
];

// --- Servicio ---
export const productsService = {
  /**
   * Obtiene una lista de productos con filtros y paginación.
   * @param filters - Objeto con los filtros a aplicar.
   * @param page - Número de página.
   * @param limit - Cantidad de items por página.
   * @returns Promesa con la respuesta paginada.
   */
  getAll: async (
    filters: ProductFilters = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<ProductsResponse> => {
    // TODO: Reemplazar con llamada real a la API cuando el backend esté listo
    // const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
    //   params: { ...filters, page, limit }
    // });
    // return response.data;

    // --- Simulación de filtrado y paginación (mock) ---
    let filtered = [...mockProducts];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.description.toLowerCase().includes(search),
      );
    }
    if (filters.category) {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy!];
        const bVal = b[filters.sortBy!];
        if (typeof aVal === "string") {
          return filters.sortOrder === "desc"
            ? bVal.localeCompare(aVal)
            : aVal.localeCompare(bVal);
        }
        return filters.sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      });
    }

    // Paginación mock
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedData = filtered.slice(start, end);

    return {
      data: paginatedData,
      meta: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        hasNextPage: end < filtered.length,
        hasPrevPage: start > 0,
      },
    };
  },

  // Puedes agregar otros métodos como getById, create, update, delete
  getById: async (id: string): Promise<Product> => {
    // TODO: Llamada real a la API
    // const response = await apiClient.get(ENDPOINTS.PRODUCTS.DETAIL(id));
    // return response.data;
    const product = mockProducts.find((p) => p.id === id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  },
};
