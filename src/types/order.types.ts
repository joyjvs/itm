export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderProduct {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  price: string;
  stock: number;
  images: string[];
  category: string | null;
  categoryId: string;
}

export interface OrderItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  unitPrice: string;
  orderId: string;
  productId: string;
  product: OrderProduct;
}

export interface OrderUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  deliveryMethod: "delivery" | "pickup";
  deliveryAddress: string;
  totalPrice: string;
  user: OrderUser;
  userId: string;
  items: OrderItem[];
}

export interface OrderStore {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  selectedOrder: Order | null;
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  lastUserId: string | null;
  lastIsAdmin: boolean;
  fetchOrders: (
    userId: string,
    isAdmin?: boolean,
    page?: number,
    limit?: number,
  ) => Promise<void>;
  fetchOrderById: (
    orderId: string,
    userId?: string,
    isAdmin?: boolean,
  ) => Promise<Order | null>;
  createOrder: (payload: CreateOrderPayload, userId: string) => Promise<Order>;
  cancelOrder: (orderId: string, userId?: string) => Promise<Order>;
  setPage: (page: number) => void;
  setItemsPerPage: (limit: number) => void;
  clearError: () => void;
}

export interface Item {
  productId: string;
  quantity: number;
}

export enum DeliveryMethod {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}

export interface CreateOrderPayload {
  items: Item[];
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string;
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
