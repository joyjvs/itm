import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type {
  Order,
  CreateOrderPayload,
  BackendOrderStatus,
  OrderFilters,
  OrderStatus,
} from "../../types/order.types";
import type { PaginatedResponse } from "@/types/pagination.types";

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
    return data && typeof data === "object"
      ? normalizeOrder(data as Order)
      : null;
  }

  return normalizeOrder(payload as Order);
};

const normalizeOrder = (order: Order): Order => ({
  ...order,
  status: normalizeOrderStatus(order.status),
});

const normalizeOrderStatus = (
  status: string | undefined | null,
): BackendOrderStatus => {
  const normalized = status?.toLowerCase();

  switch (normalized) {
    case "confirmed":
    case "processing":
      return "confirmed";
    case "preparing":
      return "preparing";
    case "ready_for_pickup":
      return "ready_for_pickup";
    case "shipped":
      return "shipped";
    case "delivered":
      return "delivered";
    case "cancelled":
      return "cancelled";
    case "pending":
    default:
      return "pending";
  }
};

export const orderService = {
  getOrders: async (
    userId: string,
    isAdmin = false,
    page = 1,
    limit = 10,
    filters?: OrderFilters,
  ): Promise<PaginatedResponse<Order>> => {
    const params = {
      page,
      limit,
      ...(filters ?? {}),
    };

    const queryParams = Object.fromEntries(
      Object.entries(params).filter(
        ([, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const response = await axiosClient.get(
      isAdmin ? ENDPOINTS.ORDERS.LIST : ENDPOINTS.ORDERS.MY_ORDERS(userId),
      {
        params: queryParams,
      },
    );

    const rawData = normalizeOrdersResponse(response.data);
    const pagination = response.data?.pagination || response.data?.meta || {};

    return {
      data: rawData.map((order) => normalizeOrder(order)),
      meta: {
        currentPage: pagination.page ?? page,
        itemsPerPage: pagination.limit ?? limit,
        totalItems: pagination.total ?? rawData.length,
        totalPages: pagination.totalPages ?? 1,
        hasNextPage: pagination.hasNext ?? false,
        hasPrevPage: pagination.hasPrev ?? false,
      },
    };
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
    return normalizeOrder(response.data as Order);
  },

  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> => {
    const normalizedStatus = normalizeOrderStatus(status);
    const response = await axiosClient.patch(
      ENDPOINTS.ORDERS.UPDATE_STATUS(orderId),
      {
        status: normalizedStatus,
      },
    );
    return normalizeOrder(response.data as Order);
  },

  cancelOrder: async (orderId: string, userId?: string): Promise<Order> => {
    const response = await axiosClient.patch(
      ENDPOINTS.ORDERS.CANCEL(orderId, userId),
    );
    return normalizeOrder(response.data as Order);
  },
};
