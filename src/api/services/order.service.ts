import { Order } from "../../types/order.types";

// Datos mock de órdenes
const mockOrders: Order[] = [
  {
    id: "ord_001",
    userId: "1",
    items: [
      {
        productId: "1",
        name: "Caramelo Step Caramelo",
        price: 15.99,
        quantity: 2,
        image: "/images/caramelo1.jpg",
      },
      {
        productId: "2",
        name: "Chocolate Amargo",
        price: 12.5,
        quantity: 1,
        image: "/images/chocolate.jpg",
      },
    ],
    totalAmount: 44.48,
    status: "delivered",
    createdAt: new Date("2025-01-10T10:30:00").toISOString(),
    updatedAt: new Date("2025-01-12T14:20:00").toISOString(),
    shippingAddress: "Av. Principal 123, Ciudad",
    paymentMethod: "Tarjeta de crédito",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ord_002",
    userId: "1",
    items: [
      {
        productId: "3",
        name: "Miel de Abella",
        price: 8.99,
        quantity: 3,
        image: "/images/miel.jpg",
      },
    ],
    totalAmount: 26.97,
    status: "shipped",
    createdAt: new Date("2025-02-20T09:15:00").toISOString(),
    updatedAt: new Date("2025-02-21T16:45:00").toISOString(),
    shippingAddress: "Av. Principal 123, Ciudad",
    paymentMethod: "PayPal",
    trackingNumber: "TRK987654321",
  },
  {
    id: "ord_003",
    userId: "1",
    items: [
      {
        productId: "4",
        name: "Galletas Integrales",
        price: 5.49,
        quantity: 5,
        image: "/images/galletas.jpg",
      },
    ],
    totalAmount: 27.45,
    status: "pending",
    createdAt: new Date("2025-03-05T11:00:00").toISOString(),
    updatedAt: new Date("2025-03-05T11:00:00").toISOString(),
    shippingAddress: "Av. Principal 123, Ciudad",
    paymentMethod: "Transferencia bancaria",
    trackingNumber: undefined,
  },
];

export const orderService = {
  getOrdersByUserId: async (userId: string): Promise<Order[]> => {
    // TODO: Reemplazar con llamada real a la API
    // const response = await apiClient.get(ENDPOINTS.ORDERS.LIST, { params: { userId } });
    // return response.data;
    return mockOrders.filter((order) => order.userId === userId);
  },

  getOrderById: async (orderId: string): Promise<Order | null> => {
    // TODO: Reemplazar con llamada real
    const order = mockOrders.find((o) => o.id === orderId);
    return order || null;
  },

  // Para simular creación de orden (no se usa aquí, pero puede ser útil)
  createOrder: async (
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">,
  ): Promise<Order> => {
    // Simulación
    const newOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockOrders.push(newOrder);
    return newOrder;
  },

  cancelOrder: async (orderId: string): Promise<Order> => {
    // TODO: Llamada real
    // const response = await apiClient.patch(ENDPOINTS.ORDERS.CANCEL(orderId));
    // return response.data;
    const order = mockOrders.find((o) => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada");
    if (order.status !== "pending" && order.status !== "processing") {
      throw new Error(
        "Solo se pueden cancelar órdenes en estado pendiente o procesando",
      );
    }
    order.status = "cancelled";
    order.updatedAt = new Date().toISOString();
    return order;
  },
};
