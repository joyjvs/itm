import { create } from "zustand";
import { informationService } from "@/api/services/information.service";
import type {
  Information,
  InformationPayload,
} from "@/types/information.types";
import { showError, showSuccess } from "@/utils/toast";

interface InformationState {
  information: Information | null;
  isLoading: boolean;
  error: string | null;
  fetchInformation: () => Promise<void>;
  saveInformation: (payload: InformationPayload) => Promise<void>;
}

export const useInformationStore = create<InformationState>((set, get) => ({
  information: null,
  isLoading: false,
  error: null,

  fetchInformation: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await informationService.getAll();
      set({ information: records[0] ?? null, isLoading: false });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al cargar la información";
      set({ error: message, isLoading: false });
      showError("No se pudo cargar la información", message);
    }
  },

  saveInformation: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const current = get().information;
      const saved = current
        ? await informationService.update(current.id, payload)
        : await informationService.create(payload);
      set({ information: saved, isLoading: false });
      showSuccess(
        "Información guardada",
        "Los cambios se guardaron correctamente.",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al guardar la información";
      set({ error: message, isLoading: false });
      showError("No se pudo guardar la información", message);
      throw error;
    }
  },
}));
