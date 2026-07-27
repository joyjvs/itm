import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthResponse } from "../types/auth.types";
import { authService } from "../api/services/auth.service";
import { setAuthToken, removeAuthToken } from "../api/client";

const mockUser: User = {
  id: "1",
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+1 234 567 890",
  address: "Av. Principal 123, Ciudad",
  createdAt: "2024-01-15",
};

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setUser: (user: User | null) => void;
  changePassword: (currentPassword: string, newPassword: string) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authService.login({
            email,
            password,
          });
          setAuthToken(response.access_token);
          set({
            user: response.user,
            token: response.access_token,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({
            error: "Error al iniciar sesión",
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (email, password, name, lastName) => {
        set({ isLoading: true, error: null });
        try {
          const response: AuthResponse = await authService.register({
            email,
            password,
            name,
            lastName,
          });
          setAuthToken(response.access_token);
          set({
            user: response.user,
            token: response.access_token,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({
            error: "Error al registrarse",
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        removeAuthToken();
        set({ user: null, token: null, error: null });
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(currentPassword, newPassword);
          set({ isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },
      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          // Llamada al servicio
          const updatedUser = await authService.updateProfile(data);
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
