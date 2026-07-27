// src/store/orderStore.ts
import { create } from "zustand";
import { OrderStore, Order } from "../types/order.types";
import { orderService } from "../api/services/order.service";

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  selectedOrder: null,

  fetchOrders: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrdersByUserId(userId);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar las órdenes",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrderById(orderId);
      set({ isLoading: false });
      return order;
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar la orden",
        isLoading: false,
      });
      return null;
    }
  },

  createOrder: async (payload: Order) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(payload);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
      return newOrder;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await orderService.cancelOrder(orderId);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
        selectedOrder:
          state.selectedOrder?.id === orderId ? updated : state.selectedOrder,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
