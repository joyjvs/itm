import { useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { PaginationControls } from "@/components/common/PaginationControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Loader2, Package, ShoppingBag, Truck } from "lucide-react";

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-sky-100 text-sky-800",
  ready_for_pickup: "bg-indigo-100 text-indigo-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready_for_pickup: "Listo para recoger",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const OrdersPageAdmin = () => {
  const { user } = useAuth();
  const {
    orders,
    isLoading,
    error,
    fetchOrders,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    setPage,
    setItemsPerPage,
  } = useOrders();

  useEffect(() => {
    if (user?.id) {
      void fetchOrders(user.id, true);
    }
  }, [user?.id, fetchOrders]);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-2">
              <ShoppingBag className="w-8 h-8" />
              Órdenes del sistema
            </h1>
            <p className="text-gray-600 mt-2">
              Consulta todas las órdenes registradas para seguimiento y
              administración.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando órdenes...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => user?.id && fetchOrders(user.id, true)}
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">
                No hay órdenes registradas aún.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order) => {
                const customerName =
                  order.user?.fullName ||
                  `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim() ||
                  order.user?.email ||
                  "Cliente";
                return (
                  <Card key={order.id} className="shadow-sm">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          Orden #{order.id}
                        </CardTitle>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString(
                              "es-ES",
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items?.length ?? 0} productos
                          </span>
                          <span className="flex items-center gap-1">
                            <Truck className="w-4 h-4" />
                            {customerName}
                          </span>
                        </div>
                      </div>
                      <Badge
                        className={
                          statusStyles[order.status] || statusStyles.pending
                        }
                      >
                        {statusLabels[order.status] || statusLabels.pending}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Cliente: {customerName}
                        </p>
                        <p className="text-sm text-gray-600">
                          Método de entrega:{" "}
                          {order.deliveryMethod === "delivery"
                            ? "Domicilio"
                            : "Recogida"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Dirección:{" "}
                          {order.deliveryAddress || "Sin dirección registrada"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="text-xl font-semibold text-blue-600">
                          ${Number(order.totalPrice ?? 0).toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="mt-2"
                        >
                          <Link to={`/order/${order.id}`}>Ver detalle</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {totalItems > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages || 1}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={(page) => setPage(page)}
                onItemsPerPageChange={(limit) => setItemsPerPage(limit)}
              />
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
