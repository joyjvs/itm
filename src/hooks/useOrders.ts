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
    fetchOrders,
    fetchOrderById,
    createOrder,
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
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    setPage,
    setItemsPerPage,
    selectedOrder,
    clearError,
  };
};
