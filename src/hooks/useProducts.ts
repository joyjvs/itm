// src/hooks/useProducts.ts
import { useProductStore } from "../store/productStore";

export const useProducts = () => {
  const {
    products,
    selectedProduct,
    isLoading,
    error,
    pagination,
    filters,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    clearFilters,
    setPage,
    setLimit,
    clearError,
  } = useProductStore();

  return {
    // Estado
    products,
    selectedProduct,
    isLoading,
    error,
    pagination,
    filters,
    // Acciones
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setFilters,
    clearFilters,
    setPage,
    setLimit,
    clearError,
  };
};
