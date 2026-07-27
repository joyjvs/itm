// src/hooks/useOrders.ts
import { useOrderStore } from "../store/orderStore";

export const useOrders = () => {
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    selectedOrder,
    clearError,
  } = useOrderStore();

  return {
    orders,
    isLoading,
    error,
    selectedOrder,
    fetchOrders,
    fetchOrderById,
    createOrder,
    cancelOrder,
    clearError,
  };
};
