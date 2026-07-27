// src/store/productStore.ts
import { create } from "zustand";
import { productsService } from "@/api/services/product.service";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
} from "../types/product.types";
import type { PaginationMeta } from "../types/pagination.types";

interface ProductState {
  // Estado
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: ProductFilters;

  // Acciones
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

const defaultFilters: ProductFilters = {
  search: "",
  category: "",
  minPrice: undefined,
  maxPrice: undefined,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export const useProductStore = create<ProductState>((set, get) => ({
  // Estado inicial
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: { ...defaultFilters },

  // --- Acciones ---
  fetchProducts: async (page = 1, limit = 10) => {
    const { filters } = get();
    set({ isLoading: true, error: null });

    try {
      const response: ProductsResponse = await productsService.getAll(
        filters,
        page,
        limit,
      );
      set({
        products: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: (error as Error)?.message || "Error al cargar productos",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productsService.getById(id);
      set({ selectedProduct: product, isLoading: false });
      return product;
    } catch (error) {
      set({
        error: (error as Error)?.message || "Error al cargar el producto",
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      // Reiniciamos a la primera página al cambiar filtros
      pagination: { ...state.pagination, currentPage: 1 },
    }));
    // Disparamos una nueva búsqueda con los filtros actualizados
    const { filters, pagination } = get();
    get().fetchProducts(pagination.currentPage, pagination.itemsPerPage);
  },

  clearFilters: () => {
    set({ filters: { ...defaultFilters } });
    // Refrescamos la lista con los filtros por defecto
    const { pagination } = get();
    get().fetchProducts(pagination.currentPage, pagination.itemsPerPage);
  },

  setPage: (page: number) => {
    const { pagination } = get();
    if (page !== pagination.currentPage) {
      set((state) => ({
        pagination: { ...state.pagination, currentPage: page },
      }));
      get().fetchProducts(page, pagination.itemsPerPage);
    }
  },

  setLimit: (limit: number) => {
    set((state) => ({
      pagination: { ...state.pagination, itemsPerPage: limit, currentPage: 1 },
    }));
    get().fetchProducts(1, limit);
  },

  clearError: () => set({ error: null }),
}));
