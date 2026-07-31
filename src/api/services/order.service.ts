import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { Order, CreateOrderPayload } from "../../types/order.types";

const normalizeOrdersResponse = (payload: unknown): Order[] => {
  if (Array.isArray(payload)) return payload as Order[];

  if (payload && typeof payload === "object") {
    if ("data" in payload) {
      const data = (payload as { data?: unknown }).data;
      return Array.isArray(data) ? (data as Order[]) : [];
    }

    if ("orders" in payload) {
      const orders = (payload as { orders?: unknown }).orders;
      return Array.isArray(orders) ? (orders as Order[]) : [];
    }
  }

  return [];
};

const normalizeSingleOrderResponse = (payload: unknown): Order | null => {
  if (!payload || typeof payload !== "object") return null;

  if ("data" in payload) {
    const data = (payload as { data?: unknown }).data;
    return data && typeof data === "object" ? (data as Order) : null;
  }

  return payload as Order;
};

export const orderService = {
  getOrders: async (userId: string, isAdmin = false): Promise<Order[]> => {
    const response = await axiosClient.get(
      isAdmin ? ENDPOINTS.ORDERS.LIST : ENDPOINTS.ORDERS.MY_ORDERS(userId),
      {
        params: { page: 1, limit: 100 },
      },
    );
    return normalizeOrdersResponse(response.data);
  },

  getOrderById: async (
    orderId: string,
    userId?: string,
    isAdmin = false,
  ): Promise<Order | null> => {
    const url =
      isAdmin || !userId
        ? ENDPOINTS.ORDERS.DETAIL(orderId)
        : ENDPOINTS.ORDERS.MY_ORDER(orderId, userId);

    const response = await axiosClient.get(url);
    return normalizeSingleOrderResponse(response.data);
  },

  createOrder: async (
    orderData: CreateOrderPayload,
    userId: string,
  ): Promise<Order> => {
    const response = await axiosClient.post(ENDPOINTS.ORDERS.CREATE(userId), {
      ...orderData,
    });
    return response.data as Order;
  },

  cancelOrder: async (orderId: string, userId?: string): Promise<Order> => {
    const response = await axiosClient.patch(
      ENDPOINTS.ORDERS.CANCEL(orderId, userId),
    );
    return response.data as Order;
  },
};
