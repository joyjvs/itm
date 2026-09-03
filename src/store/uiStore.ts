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


  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openDialog: (dialog: keyof UIState["dialogOpen"]) => void;
  closeDialog: (dialog: keyof UIState["dialogOpen"]) => void;
  closeAllDialogs: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  editingProject: null,
  editingTask: null,
  sidebarOpen: false,
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
}));
