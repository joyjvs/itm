import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    changePassword,
    updateProfile,
  } = useAuthStore();

  const isAuthenticated = !!token;

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    changePassword,
    updateProfile,
  };
};
