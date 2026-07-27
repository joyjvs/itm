import { create } from "zustand";
import type {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  TaskStatus,
  TaskPriority,
} from "../types/task.types";
import { tasksService } from "../api/services/tasks.service";
import { PaginationMeta } from "@/types/pagination.types";

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  statusFilter: TaskStatus | null;
  priorityFilter: TaskPriority | null;
  isLoading: boolean;
  error: string | null;
  pagination: PaginationMeta;

  // Actions
  fetchTasks: (
    userId: string,
    projectId: string,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  createTask: (userId: string, payload: CreateTaskPayload) => Promise<Task>;
  updateTask: (
    userId: string,
    id: string,
    payload: UpdateTaskPayload,
  ) => Promise<void>;
  deleteTask: (userId: string, id: string) => Promise<void>;
  updateTaskStatus: (
    userId: string,
    id: string,
    status: TaskStatus,
  ) => Promise<void>;
  updateTaskPriority: (
    userId: string,
    id: string,
    priority: TaskPriority,
  ) => Promise<void>;
  setStatusFilter: (status: TaskStatus | null) => void;
  setPriorityFilter: (priority: TaskPriority | null) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filteredTasks: [],
  statusFilter: null,
  priorityFilter: null,
  isLoading: false,
  error: null,

  fetchTasks: async (
    userId: string,
    projectId: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await tasksService.getAll(
        userId,
        projectId,
        page,
        limit,
      );
      const tasks = response.data;
      const pagination = {
        currentPage: Number(response.page),
        itemsPerPage: Number(response.limit),
        totalItems: Number(response.total),
        totalPages: Number(response.totalPages),
        hasNextPage: Number(response.page) < Number(response.totalPages),
        hasPrevPage: Number(response.page) > 1,
      };
      set({ tasks, pagination, isLoading: false });
      get().setStatusFilter(get().statusFilter); // Reaplicar filtros
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al cargar tareas",
        isLoading: false,
      });
    }
  },

  createTask: async (userId: string, payload: CreateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      const newTask = await tasksService.create(userId, payload);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
      return newTask;
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al crear tarea",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (
    userId: string,
    id: string,
    payload: UpdateTaskPayload,
  ) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await tasksService.update(userId, id, payload);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? updated : t)),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al actualizar tarea",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (userId: string, id: string) => {
    set({ isLoading: true, error: null });
    try {
      await tasksService.delete(userId, id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al eliminar tarea",
        isLoading: false,
      });
      throw error;
    }
  },

  updateTaskStatus: async (userId: string, id: string, status: TaskStatus) => {
    try {
      await tasksService.updateStatus(userId, id, { status });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al actualizar estado",
      });
      throw error;
    }
  },

  updateTaskPriority: async (
    userId: string,
    id: string,
    priority: TaskPriority,
  ) => {
    try {
      await tasksService.updatePriority(userId, id, { priority });
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, priority } : t)),
      }));
    } catch (error: unknown) {
      set({
        error: (error as Error)?.message || "Error al actualizar prioridad",
      });
      throw error;
    }
  },

  setStatusFilter: (status) => {
    const { tasks } = get();
    const filtered = status ? tasks.filter((t) => t.status === status) : tasks;
    set({ statusFilter: status, filteredTasks: filtered });
  },

  setPriorityFilter: (priority) => {
    const { tasks } = get();
    const filtered = priority
      ? tasks.filter((t) => t.priority === priority)
      : tasks;
    set({ priorityFilter: priority, filteredTasks: filtered });
  },

  clearError: () => set({ error: null }),

  setPage: (page: number) => {
    set({ pagination: { ...get().pagination, currentPage: page } });
  },
  setLimit: (limit: number) => {
    set({
      pagination: { ...get().pagination, itemsPerPage: limit, currentPage: 1 },
    });
    // ... trigger de refetch
  },
}));
