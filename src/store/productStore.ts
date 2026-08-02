import { create } from "zustand";
import { productsService } from "@/api/services/product.service";
import type {
  Product,
  ProductFilters,
  ProductsResponse,
} from "../types/product.types";
import type { PaginationMeta } from "../types/pagination.types";
import { showError, showSuccess } from "../utils/toast";

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  filters: ProductFilters;

  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product>;
  createProduct: (payload: FormData) => Promise<void>;
  updateProduct: (id: string, payload: FormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
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

  fetchProducts: async (page?: number, limit?: number) => {
    const { pagination } = get();
    const targetPage = page ?? pagination.currentPage;
    const targetLimit = limit ?? pagination.itemsPerPage;

    set({ isLoading: true, error: null });

    try {
      const response: ProductsResponse = await productsService.getAll(
        //filters,
        targetPage,
        targetLimit,
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

  createProduct: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.create(payload);
      await get().fetchProducts(1, get().pagination.itemsPerPage);
      showSuccess("Producto creado", "El producto se registró correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear producto";
      set({
        error: message,
        isLoading: false,
      });
      showError("No se pudo crear el producto", message);
      throw error;
    }
  },

  updateProduct: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.update(id, payload);
      await get().fetchProducts(
        get().pagination.currentPage,
        get().pagination.itemsPerPage,
      );
      showSuccess(
        "Producto actualizado",
        "Los cambios se guardaron correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar producto";
      set({
        error: message,
        isLoading: false,
      });
      showError("No se pudo actualizar el producto", message);
      throw error;
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await productsService.delete(id);
      await get().fetchProducts(
        get().pagination.currentPage,
        get().pagination.itemsPerPage,
      );
      showSuccess(
        "Producto eliminado",
        "El producto se eliminó correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar producto";
      set({
        error: message,
        isLoading: false,
      });
      showError("No se pudo eliminar el producto", message);
      throw error;
    }
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, currentPage: 1 },
    }));
    const { pagination } = get();
    get().fetchProducts(pagination.currentPage, pagination.itemsPerPage);
  },

  clearFilters: () => {
    set({ filters: { ...defaultFilters } });
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
