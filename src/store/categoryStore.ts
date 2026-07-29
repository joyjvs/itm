import { create } from "zustand";
import { categoriesService } from "../api/services/categories.service";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "../types/category.types";

interface CategoryState {
  categories: Category[];
  tree: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchTree: () => Promise<void>;
  createCategory: (payload: CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: string, payload: UpdateCategoryPayload) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  tree: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await categoriesService.getAll();
      set({ categories: data, isLoading: false });
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
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateCategory: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.update(id, payload);
      await get().fetchTree();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await categoriesService.delete(id);
      await get().fetchTree();
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
