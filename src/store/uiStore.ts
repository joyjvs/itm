import { Project } from "@/types/project.types";
import { Task } from "@/types/task.types";
import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  dialogOpen: {
    newProject: boolean;
    newTask: boolean;
    editProject: boolean;
    editTask: boolean;
    projectMembers: boolean;
  };

  editingProject: Project | null;
  editingTask: Task | null;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openDialog: (dialog: keyof UIState["dialogOpen"]) => void;
  closeDialog: (dialog: keyof UIState["dialogOpen"]) => void;
  closeAllDialogs: () => void;
  setEditingProject: (project: Project | null) => void;
  setEditingTask: (task: Task | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  editingProject: null,
  editingTask: null,
  sidebarOpen: true,
  dialogOpen: {
    newProject: false,
    newTask: false,
    editProject: false,
    editTask: false,
    projectMembers: false,
  },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openDialog: (dialog) =>
    set((state) => ({
      dialogOpen: { ...state.dialogOpen, [dialog]: true },
    })),

  closeDialog: (dialog) =>
    set((state) => ({
      dialogOpen: { ...state.dialogOpen, [dialog]: false },
    })),

  closeAllDialogs: () =>
    set({
      dialogOpen: {
        newProject: false,
        newTask: false,
        editProject: false,
        editTask: false,
        projectMembers: false,
      },
    }),

  setEditingProject: (project: Project | null) =>
    set({ editingProject: project }),

  setEditingTask: (task: Task | null) => set({ editingTask: task }),
}));
