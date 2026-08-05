// src/store/orderStore.ts
import { create } from "zustand";
import {
  OrderFilters,
  OrderStore,
  CreateOrderPayload,
  OrderStatus,
} from "../types/order.types";
import { orderService } from "../api/services/order.service";
import { showError, showSuccess } from "../utils/toast";

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
  filters: undefined,

  fetchOrders: async (
    userId: string,
    isAdmin = false,
    page = 1,
    limit = 10,
    filters,
  ) => {
    const nextFilters = isAdmin ? (filters ?? get().filters) : undefined;
    set({
      isLoading: true,
      error: null,
      lastUserId: userId,
      lastIsAdmin: isAdmin,
      filters: nextFilters,
    });
    try {
      const response = await orderService.getOrders(
        userId,
        isAdmin,
        page,
        limit,
        nextFilters,
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
    const { lastUserId, lastIsAdmin, itemsPerPage, filters } = get();
    if (!lastUserId) return;
    set({ currentPage: page });
    void get().fetchOrders(
      lastUserId,
      lastIsAdmin,
      page,
      itemsPerPage,
      filters,
    );
  },

  setItemsPerPage: (limit: number) => {
    const { lastUserId, lastIsAdmin, filters } = get();
    if (!lastUserId) return;
    set({ itemsPerPage: limit, currentPage: 1 });
    void get().fetchOrders(lastUserId, lastIsAdmin, 1, limit, filters);
  },

  setFilters: (filters: OrderFilters) => {
    const { lastUserId, lastIsAdmin, itemsPerPage } = get();
    set({ filters, currentPage: 1 });
    if (!lastUserId) return;
    void get().fetchOrders(lastUserId, lastIsAdmin, 1, itemsPerPage, filters);
  },

  clearFilters: () => {
    const { lastUserId, lastIsAdmin, itemsPerPage } = get();
    set({ filters: undefined, currentPage: 1 });
    if (!lastUserId) return;
    void get().fetchOrders(lastUserId, lastIsAdmin, 1, itemsPerPage);
  },

  createOrder: async (payload: CreateOrderPayload, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await orderService.createOrder(payload, userId);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
      showSuccess("Pedido creado", "Tu orden se generó correctamente.");
      return newOrder;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear la orden";
      set({ error: message, isLoading: false });
      showError("No se pudo crear la orden", message);
      throw error;
    }
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await orderService.updateOrderStatus(orderId, status);
      set((state) => ({
        orders: state.orders.map((o) => (o.id === orderId ? updated : o)),
        selectedOrder:
          state.selectedOrder?.id === orderId ? updated : state.selectedOrder,
        isLoading: false,
      }));
      showSuccess(
        "Estado actualizado",
        "El estado de la orden cambió correctamente.",
      );
      return updated;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado";
      set({ error: message, isLoading: false });
      showError("No se pudo actualizar el estado", message);
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
      showSuccess("Pedido cancelado", "La orden se canceló correctamente.");
      return updated;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo cancelar la orden";
      set({ error: message, isLoading: false });
      showError("No se pudo cancelar la orden", message);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
