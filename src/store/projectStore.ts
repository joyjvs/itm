import { create } from "zustand";
import type {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  AddMemberPayload,
} from "../types/project.types";
import { projectsService } from "../api/services/projects.service";
import type { PaginationMeta } from "../types/pagination.types";
import { useAuthStore } from "./authStore";

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;

  pagination: PaginationMeta;

  // Actions
  fetchProjects: (
    userId: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project>;
  createProject: (payload: CreateProjectPayload) => Promise<Project>;
  updateProject: (id: string, payload: UpdateProjectPayload) => Promise<void>;
  deleteProject: (userId: string, id: string) => Promise<void>;
  addMember: (
    userId: string,
    projectId: string,
    payload: AddMemberPayload,
  ) => Promise<Project>;
  removeMember: (
    userId: string,
    projectId: string,
    memberId: string,
  ) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  clearError: () => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
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

  fetchProjects: async (userId: string, page = 1, limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const projects = await projectsService.getAll(userId, page, limit);
      set({
        projects: projects.data,
        isLoading: false,
        pagination: projects.meta,
      });
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al cargar proyectos",
        isLoading: false,
      });
    }
  },

  fetchProjectById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const project = await projectsService.getById(id);
      set({ selectedProject: project, isLoading: false });
      return project;
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al cargar proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  createProject: async (payload: CreateProjectPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newProject = await projectsService.create(payload);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      return newProject;
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al crear proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id: string, payload: UpdateProjectPayload) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await projectsService.update(id, payload);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updated : p)),
        selectedProject:
          state.selectedProject?.id === id ? updated : state.selectedProject,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al actualizar proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (userId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await projectsService.delete(userId, id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al eliminar proyecto",
        isLoading: false,
      });
      throw error;
    }
  },

  addMember: async (
    userId: string,
    projectId: string,
    payload: AddMemberPayload,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await projectsService.addMember(userId, projectId, payload);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updated : p)),
        selectedProject:
          state.selectedProject?.id === projectId ? updated : state.selectedProject,
        isLoading: false,
      }));
      return updated;
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al agregar miembro",
        isLoading: false,
      });
      throw error;
    }
  },

  removeMember: async (
    userId: string,
    projectId: string,
    memberId: string,
  ) => {
    set({ isLoading: true, error: null });
    try {
      await projectsService.removeMember(userId, projectId, memberId);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                members: p.members.filter((m) => m.id !== memberId),
              }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                members: state.selectedProject.members.filter(
                  (m) => m.id !== memberId
                ),
              }
            : state.selectedProject,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al eliminar miembro",
        isLoading: false,
      });
      throw error;
    }
  },

  setSelectedProject: (project) => set({ selectedProject: project }),

  clearError: () => set({ error: null }),

  setPage: (page: number) => {
    const { pagination, fetchProjects } = get();
    if (page >= 1 && page <= pagination.totalPages) {
      // Necesitas tener el userId disponible. Podrías guardarlo en el store o pasarlo.
      // Recomendación: guardar userId en el store cuando el usuario se loguea.
      // Asumiendo que tienes userId en el store (ej. userStore)
      //const userId = get().userId; // Asegúrate de tener userId en el store
      const userId = useAuthStore.getState().user?.id;
      if (userId) {
        fetchProjects(userId, page, pagination.itemsPerPage);
      }
    }
  },

  setLimit: (limit: number) => {
    const { fetchProjects } = get();
    const userId = useAuthStore.getState().user?.id;
    if (userId) {
      // Al cambiar límite, reiniciamos a página 1
      fetchProjects(userId, 1, limit);
    }
  },
}));
