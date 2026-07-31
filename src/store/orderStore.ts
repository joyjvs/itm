// src/store/orderStore.ts
import { create } from "zustand";
import { OrderStore, CreateOrderPayload } from "../types/order.types";
import { orderService } from "../api/services/order.service";

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  selectedOrder: null,

  fetchOrders: async (userId: string, isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrders(userId, isAdmin);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar las órdenes",
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (orderId: string, userId?: string, isAdmin = false) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrderById(orderId, userId, isAdmin);
      set({ selectedOrder: order, isLoading: false });
      return order;
    } catch (error) {
      set({
        error: (error as Error).message || "Error al cargar la orden",
        isLoading: false,
      });
      return null;
    }
  },

  createOrder: async (payload: CreateOrderPayload, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(payload, userId);
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

  cancelOrder: async (orderId: string, userId?: string) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await orderService.cancelOrder(orderId, userId);
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
