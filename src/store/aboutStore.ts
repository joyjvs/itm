import { create } from "zustand";
import { aboutService } from "@/api/services/about.service";
import type { About, AboutPayload } from "@/types/about.types";
import { showError, showSuccess } from "@/utils/toast";

interface AboutState {
  about: About | null;
  isLoading: boolean;
  error: string | null;
  fetchAbout: () => Promise<void>;
  saveAbout: (payload: AboutPayload) => Promise<void>;
}

export const useAboutStore = create<AboutState>((set, get) => ({
  about: null,
  isLoading: false,
  error: null,
  fetchAbout: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await aboutService.getAll();
      set({ about: records[0] ?? null, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar About";
      set({ error: message, isLoading: false });
      showError("No se pudo cargar la información", message);
    }
  },
  saveAbout: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const current = get().about;
      const saved = current
        ? await aboutService.update(current.id, payload)
        : await aboutService.create(payload);
      set({ about: saved, isLoading: false });
      showSuccess(
        "Información guardada",
        "Los cambios se guardaron correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al guardar About";
      set({ error: message, isLoading: false });
      showError("No se pudo guardar la información", message);
      throw error;
    }
  },
}));
