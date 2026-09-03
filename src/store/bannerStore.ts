import { create } from "zustand";
import { bannersService } from "@/api/services/banner.service";
import type { Banner } from "@/types/banner.types";
import type { PaginationMeta } from "@/types/pagination.types";
import { showError, showSuccess } from "@/utils/toast";

interface BannerState {
  banners: Banner[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;
  fetchBanners: (page?: number, limit?: number) => Promise<void>;
  createBanner: (payload: FormData) => Promise<void>;
  updateBanner: (id: string, payload: FormData) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const initialPagination: PaginationMeta = {
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export const useBannerStore = create<BannerState>((set, get) => ({
  banners: [],
  isLoading: false,
  error: null,
  pagination: initialPagination,

  fetchBanners: async (page, limit) => {
    const { pagination } = get();
    const targetPage = page ?? pagination.currentPage;
    const targetLimit = limit ?? pagination.itemsPerPage;
    set({ isLoading: true, error: null });

    try {
      const response = await bannersService.getAll(targetPage, targetLimit);
      set({
        banners: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar banners";
      set({ error: message, isLoading: false });
      showError("No se pudieron cargar los banners", message);
    }
  },

  createBanner: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await bannersService.create(payload);
      await get().fetchBanners(1, get().pagination.itemsPerPage);
      showSuccess("Banner creado", "El banner se registró correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al crear banner";
      set({ error: message, isLoading: false });
      showError("No se pudo crear el banner", message);
      throw error;
    }
  },

  updateBanner: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await bannersService.update(id, payload);
      const { currentPage, itemsPerPage } = get().pagination;
      await get().fetchBanners(currentPage, itemsPerPage);
      showSuccess(
        "Banner actualizado",
        "Los cambios se guardaron correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar banner";
      set({ error: message, isLoading: false });
      showError("No se pudo actualizar el banner", message);
      throw error;
    }
  },

  deleteBanner: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await bannersService.delete(id);
      const { currentPage, itemsPerPage } = get().pagination;
      await get().fetchBanners(currentPage, itemsPerPage);
      showSuccess("Banner eliminado", "El banner se eliminó correctamente.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar banner";
      set({ error: message, isLoading: false });
      showError("No se pudo eliminar el banner", message);
      throw error;
    }
  },

  setPage: (page) => {
    const { pagination } = get();
    if (page === pagination.currentPage) return;
    set({ pagination: { ...pagination, currentPage: page } });
    void get().fetchBanners(page, pagination.itemsPerPage);
  },

  setLimit: (limit) => {
    set((state) => ({
      pagination: { ...state.pagination, currentPage: 1, itemsPerPage: limit },
    }));
    void get().fetchBanners(1, limit);
  },
}));
