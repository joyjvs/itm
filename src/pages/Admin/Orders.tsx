import { useEffect } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { PaginationControls } from "@/components/common/PaginationControls";
import { OrderFilters } from "@/components/forms/Admin/Orders/OrderFilters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Package, ShoppingBag, Truck } from "lucide-react";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import type {
  OrderFilters as OrderFiltersType,
  OrderStatus,
} from "@/types/order.types";

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
    filters,
    fetchOrders,
    setFilters,
    clearFilters,
    updateOrderStatus,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    setPage,
    setItemsPerPage,
  } = useOrders();

  const handleFilterSubmit = (appliedFilters: OrderFiltersType) => {
    if (!user?.id) return;
    setFilters(appliedFilters);
    void fetchOrders(user.id, true, 1, itemsPerPage, appliedFilters);
  };

  const handleFilterClear = () => {
    if (!user?.id) return;
    clearFilters();
    void fetchOrders(user.id, true, 1, itemsPerPage);
  };

  useEffect(() => {
    if (user?.id) {
      void fetchOrders(user.id, true);
    }
  }, [user?.id, fetchOrders]);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (error) {
      console.error("Error al cambiar el estado de la orden", error);
    }
  };

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

        <div className="mb-6">
          <OrderFilters
            defaultValues={filters}
            onSubmit={handleFilterSubmit}
            onClear={handleFilterClear}
          />
        </div>

        {isLoading ? (
          <div className="py-6">
            <DataStateSkeleton variant="list" count={5} className="max-w-6xl" />
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
                        <div className="mt-2 flex flex-col items-end gap-2">
                          <label className="text-xs text-gray-500">
                            Estado
                          </label>
                          <select
                            className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm"
                            value={order.status}
                            onChange={(event) =>
                              void handleStatusChange(
                                order.id,
                                event.target.value as OrderStatus,
                              )
                            }
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="preparing">Preparando</option>
                            <option value="ready_for_pickup">
                              Listo para recoger
                            </option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                          <Link
                            to={`/order/${order.id}`}
                            className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-background px-2.5 py-1 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            Ver detalle
                          </Link>
                        </div>
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
