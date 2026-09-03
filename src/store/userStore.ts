import { usersService } from "@/api/services/users.service";
import { User } from "@/types/auth.types";
import { create } from "zustand";

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  // Paginación
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  // Filtros (opcional)
  searchTerm: string;
  // Acciones
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  setSearchTerm: (term: string) => void;
  fetchUsers: () => Promise<void>;
  // ... otras acciones
}

export const userStore = create<UserState>((set, get) => ({
  // Estado inicial
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  searchTerm: "",

  // Acciones
  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchUsers();
  },
  setItemsPerPage: (limit: number) => {
    set({ itemsPerPage: limit, currentPage: 1 });
    get().fetchUsers();
  },
  setSearchTerm: (term: string) => {
    set({ searchTerm: term, currentPage: 1 });
    get().fetchUsers();
  },

  fetchUsers: async () => {
    const { currentPage, itemsPerPage } = get();
    set({ isLoading: true, error: null });
    try {
      const response = (await usersService.getAll({
        page: currentPage,
        limit: itemsPerPage,
      }));
      console.log(response)

      set({
        users: response.data,
        totalItems: response.pagination.total,
        totalPages: response.pagination.totalPages,
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  // ... resto de acciones
}));
