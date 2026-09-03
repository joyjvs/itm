import { useCategoryStore } from "../store/categoryStore";

export const useCategories = () => {
  const {
    categories,
    tree,
    selectedCategory,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    fetchAll,
    fetchTree,
    createCategory,
    updateCategory,
    deleteCategory,
    setPage,
    setItemsPerPage,
    clearError,
    setFilters,
    clearFilters,
  } = useCategoryStore();

  return {
    categories,
    tree,
    selectedCategory,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    fetchAll,
    fetchTree,
    createCategory,
    updateCategory,
    deleteCategory,
    setPage,
    setItemsPerPage,
    clearError,
    setFilters,
    clearFilters
  };
};
