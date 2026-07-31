import { useEffect, type JSX } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import type { Order, OrderItem } from "@/types/order.types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
} from "lucide-react";

const OrdersPage = () => {
  const { user } = useAuth();
  const { orders, isLoading, error, fetchOrders } = useOrders();
  const isAdmin = Boolean(
    user?.role?.toLowerCase().includes("admin") ||
    user?.roles?.some((role: { name?: string }) =>
      role.name?.toLowerCase().includes("admin"),
    ),
  );

  useEffect(() => {
    if (user?.id) {
      void fetchOrders(user.id, isAdmin);
    }
  }, [user?.id, isAdmin]);

  const getStatusInfo = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "pending";
    const map: Record<
      string,
      { label: string; className: string; icon: JSX.Element }
    > = {
      pending: {
        label: "Pendiente",
        className: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="w-4 h-4" />,
      },
      confirmed: {
        label: "Confirmado",
        className: "bg-blue-100 text-blue-800",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
      },
      preparing: {
        label: "Preparando",
        className: "bg-sky-100 text-sky-800",
        icon: <ShoppingBag className="w-4 h-4" />,
      },
      ready_for_pickup: {
        label: "Listo para recoger",
        className: "bg-indigo-100 text-indigo-800",
        icon: <Package className="w-4 h-4" />,
      },
      shipped: {
        label: "Enviado",
        className: "bg-indigo-100 text-indigo-800",
        icon: <Truck className="w-4 h-4" />,
      },
      delivered: {
        label: "Entregado",
        className: "bg-green-100 text-green-800",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      cancelled: {
        label: "Cancelado",
        className: "bg-red-100 text-red-800",
        icon: <XCircle className="w-4 h-4" />,
      },
    };
    return map[normalizedStatus] || map.pending;
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <h1 className="text-3xl font-bold text-blue-950 mb-6 flex items-center gap-2">
          <Package className="w-8 h-8" />
          {isAdmin ? "Órdenes del sistema" : "Mis órdenes"}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando órdenes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => user?.id && fetchOrders(user.id, isAdmin)}
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">
                {isAdmin
                  ? "No hay órdenes registradas en el sistema."
                  : "No has realizado ninguna orden aún."}
              </p>
              {!isAdmin && (
                <Link to="/products">
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                    Explorar productos
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {(orders as Order[]).map((order: Order) => {
              const statusInfo = getStatusInfo(order.status);
              const customerName =
                order.user?.fullName ||
                `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim() ||
                order.user?.email ||
                "Cliente";
              const totalAmount = Number(order.totalPrice ?? 0);

              return (
                <Card
                  key={order.id}
                  className="overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        Orden #{order.id}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {order.items?.length ?? 0} productos
                        </span>
                        {isAdmin && (
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            {customerName}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge
                      className={`flex items-center gap-1 px-3 py-1 text-sm ${statusInfo.className}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </Badge>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      {(order.items ?? []).map((item: OrderItem) => {
                        const unitPrice = Number(
                          item.unitPrice ?? item.product?.price ?? 0,
                        );
                        const imageUrl = item.product?.images?.[0];
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between border-b border-gray-100 py-2 last:border-0"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={imageUrl}
                                alt={item.product?.name ?? "Producto"}
                                className="w-12 h-12 object-cover rounded-md"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://picsum.photos/seed/fallback/50/50";
                                }}
                              />
                              <div>
                                <p className="font-medium text-gray-800">
                                  {item.product?.name ?? "Producto"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-medium">
                              ${(unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2 bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">
                          Método de entrega:{" "}
                          {order.deliveryMethod === "delivery"
                            ? "Domicilio"
                            : "Recogida"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Dirección:{" "}
                          {order.deliveryAddress || "Sin dirección registrada"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-2xl font-bold text-blue-600">
                          ${totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/order/${order.id}`}>Ver detalle</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
