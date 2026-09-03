import { userStore } from "@/store/userStore";

export const useUsers = () => {
  const {
    currentPage,
    error,
    fetchUsers,
    isLoading,
    itemsPerPage,
    selectedUser,
    totalItems,
    totalPages,
    users,
    setPage,
    setItemsPerPage,
  } = userStore();

  return {
    users,
    isLoading,
    error,
    currentPage,
    fetchUsers,
    itemsPerPage,
    selectedUser,
    totalItems,
    totalPages,
    setPage,
    setItemsPerPage,
  };
};
