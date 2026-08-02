// src/store/orderStore.ts
import { create } from "zustand";
import { OrderStore, CreateOrderPayload } from "../types/order.types";
import { orderService } from "../api/services/order.service";

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  selectedOrder: null,
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  totalPages: 0,
  lastUserId: null,
  lastIsAdmin: false,

  fetchOrders: async (
    userId: string,
    isAdmin = false,
    page = 1,
    limit = 10,
  ) => {
    set({
      isLoading: true,
      error: null,
      lastUserId: userId,
      lastIsAdmin: isAdmin,
    });
    try {
      const response = await orderService.getOrders(
        userId,
        isAdmin,
        page,
        limit,
      );
      set({
        orders: response.data,
        isLoading: false,
        currentPage: response.meta.currentPage,
        itemsPerPage: response.meta.itemsPerPage,
        totalItems: response.meta.totalItems,
        totalPages: response.meta.totalPages,
      });
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

  setPage: (page: number) => {
    const { lastUserId, lastIsAdmin, itemsPerPage } = get();
    if (!lastUserId) return;
    set({ currentPage: page });
    void get().fetchOrders(lastUserId, lastIsAdmin, page, itemsPerPage);
  },

  setItemsPerPage: (limit: number) => {
    const { lastUserId, lastIsAdmin } = get();
    if (!lastUserId) return;
    set({ itemsPerPage: limit, currentPage: 1 });
    void get().fetchOrders(lastUserId, lastIsAdmin, 1, limit);
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
