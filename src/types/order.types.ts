export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
}

export interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  fetchOrders: (userId: string) => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  createOrder: (payload: Order) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<Order>;
  clearError: () => void;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  paymentMethod: string;
  shippingAddress: string;
}

export interface OrdersResponse {
  data: Order[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
