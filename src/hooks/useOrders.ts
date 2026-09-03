// src/hooks/useOrders.ts
import { useOrderStore } from "../store/orderStore";

export const useOrders = () => {
  const {
    orders,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    fetchOrders,
    setFilters,
    clearFilters,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    setPage,
    setItemsPerPage,
    selectedOrder,
    clearError,
  } = useOrderStore();

  return {
    orders,
    isLoading,
    error,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    filters,
    fetchOrders,
    setFilters,
    clearFilters,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    setPage,
    setItemsPerPage,
    selectedOrder,
    clearError,
  };
};
