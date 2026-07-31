import axiosClient from "../client";
import { ENDPOINTS } from "../endpoints";
import { Order, CreateOrderPayload } from "../../types/order.types";

export const orderService = {
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ORDERS.LIST, {
        params: { userId },
      });
      return response.data as Order[];
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    try {
      const response = await axiosClient.get(ENDPOINTS.ORDERS.DETAIL(orderId));
      return response.data as Order;
    } catch (error) {
      // si 404 -> return null
      throw error;
    }
  },

  createOrder: async (
    orderData: CreateOrderPayload,
    userId: string,
  ): Promise<Order> => {
    try {
      const response = await axiosClient.post(ENDPOINTS.ORDERS.CREATE(userId), {
        ...orderData
      });
      return response.data as Order;
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    try {
      const response = await axiosClient.patch(
        ENDPOINTS.ORDERS.CANCEL(orderId),
      );
      return response.data as Order;
    } catch (error) {
      throw error;
    }
  },
};
