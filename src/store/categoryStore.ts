import { create } from "zustand";
import { categoriesService } from "../api/services/categories.service";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category.types";
import { showError, showSuccess } from "../utils/toast";

interface CategoryState {
  categories: Category[];
  tree: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  fetchAll: (page?: number, limit?: number) => Promise<void>;
  fetchTree: () => Promise<void>;
  createCategory: (payload: CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: string, payload: UpdateCategoryPayload) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  tree: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,

  fetchAll: async (page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const response = await categoriesService.getAll(page, limit);
      set({
        categories: response.data,
        isLoading: false,
        currentPage: response.meta.currentPage,
        itemsPerPage: response.meta.itemsPerPage,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchTree: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoriesService.getTree();
      set({ tree: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createCategory: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.create(payload);
      await get().fetchTree();
      await get().fetchAll(get().currentPage, get().itemsPerPage);
      showSuccess(
        "Categoría creada",
        "La categoría se registró correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo crear la categoría";
      set({ error: message, isLoading: false });
      showError("No se pudo crear la categoría", message);
      throw error;
    }
  },

  updateCategory: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.update(id, payload);
      await get().fetchTree();
      await get().fetchAll(get().currentPage, get().itemsPerPage);
      showSuccess(
        "Categoría actualizada",
        "Los cambios se guardaron correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la categoría";
      set({ error: message, isLoading: false });
      showError("No se pudo actualizar la categoría", message);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.delete(id);
      await get().fetchTree();
      await get().fetchAll(get().currentPage, get().itemsPerPage);
      showSuccess(
        "Categoría eliminada",
        "La categoría se eliminó correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la categoría";
      set({ error: message, isLoading: false });
      showError("No se pudo eliminar la categoría", message);
      throw error;
    }
  },

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchAll(page, get().itemsPerPage);
  },

  setItemsPerPage: (limit: number) => {
    set({ itemsPerPage: limit, currentPage: 1 });
    get().fetchAll(1, limit);
  },

  clearError: () => set({ error: null }),
}));
