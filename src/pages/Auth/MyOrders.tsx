import { useEffect, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import { PaginationControls } from "@/components/common/PaginationControls";
import { OrderFilters } from "@/components/forms/Admin/Orders/OrderFilters";
import type {
  Order,
  OrderFilters as OrderFiltersType,
} from "@/types/order.types";
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
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";

const statusMap: Record<
  string,
  { label: string; className: string; icon: ReactNode }
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
  processing: {
    label: "Procesando",
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
    icon: <Package className="w-4 h-4" />,
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

const getStatusInfo = (status: string) => {
  const normalized = status?.toLowerCase() || "pending";
  return statusMap[normalized] || statusMap.pending;
};

const MyOrdersPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
    filters,
    setFilters,
    clearFilters,
  } = useOrders();

  useEffect(() => {
    if (!user?.id) return;

    if (!id || id !== user.id) {
      navigate(`/me/orders/${user.id}`, { replace: true });
      return;
    }

    void fetchOrders(user.id, false, 1, itemsPerPage);
  }, [id, user?.id, fetchOrders, navigate, itemsPerPage]);

  const handleFilterSubmit = (appliedFilters: OrderFiltersType) => {
    if (!user?.id) return;
    setFilters(appliedFilters);
    void fetchOrders(user.id, false, 1, itemsPerPage, appliedFilters);
  };

  const handleFilterClear = () => {
    if (!user?.id) return;
    clearFilters();
    void fetchOrders(user.id, false, 1, itemsPerPage);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-2">
              <Package className="w-8 h-8" />
              Mis órdenes
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Aquí verás todas las órdenes asociadas a tu cuenta autenticada.
            </p>
          </div>
          <Button onClick={() => navigate("/profile")}>
            Volver a mi perfil
          </Button>
        </div>

        <div className="mb-8">
          <OrderFilters
            defaultValues={filters}
            onSubmit={handleFilterSubmit}
            onClear={handleFilterClear}
          />
        </div>

        {isLoading ? (
          <div className="py-6">
            <DataStateSkeleton variant="list" count={4} className="max-w-5xl" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => user?.id && fetchOrders(user.id)}
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 text-lg">
                No has realizado ninguna orden aún.
              </p>
              <Link to="/products">
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                  Explorar productos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="space-y-6">
              {orders.map((order: Order) => {
                const statusInfo = getStatusInfo(order.status);
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
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">
                            Método de entrega
                          </p>
                          <p>
                            {order.deliveryMethod === "delivery"
                              ? "Domicilio"
                              : "Recogida"}
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-900">Total</p>
                          <p>${totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-end gap-3">
                      <Link to={`/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          Ver detalle
                        </Button>
                      </Link>
                    </CardFooter>
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

export default MyOrdersPage;
