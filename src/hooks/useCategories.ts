import { useCategoryStore } from "../store/categoryStore";

export const useCategories = () => {
  const {
    categories,
    tree,
    selectedCategory,
    isLoading,
    error,
    fetchAll,
    fetchTree,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  } = useCategoryStore();

  return {
    categories,
    tree,
    selectedCategory,
    isLoading,
    error,
    fetchAll,
    fetchTree,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  };
};
