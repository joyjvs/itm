import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useOrders } from "@/hooks/useOrders";
import type { OrderItem } from "@/types/order.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { showError } from "@/utils/toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-sky-100 text-sky-800",
  ready_for_pickup: "bg-indigo-100 text-indigo-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  preparing: "Preparando",
  ready_for_pickup: "Listo para recoger",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const deliveryMethodLabels: Record<string, string> = {
  delivery: "Domicilio",
  pickup: "Recogida",
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedOrder, isLoading, error, fetchOrderById, cancelOrder } =
    useOrders();
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const isAdmin = Boolean(
    user?.role?.toLowerCase().includes("admin") ||
    user?.roles?.some((role: { name?: string }) =>
      role.name?.toLowerCase().includes("admin"),
    ),
  );

  useEffect(() => {
    if (id) {
      void fetchOrderById(id, user?.id, isAdmin);
    }
  }, [id, user?.id, isAdmin, fetchOrderById]);

  const handleCancelRequest = () => {
    setCancelDialogOpen(true);
  };

  const handleCancel = async () => {
    if (!selectedOrder) return;

    setIsCancelling(true);
    try {
      await cancelOrder(selectedOrder.id, user?.id);
      await fetchOrderById(selectedOrder.id, user?.id, isAdmin);
      setCancelDialogOpen(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo cancelar el pedido";
      showError("No se pudo cancelar el pedido", message);
      console.log(error);
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading && !selectedOrder) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </MainLayout>
    );
  }

  if (error || !selectedOrder) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-600">{error || "Orden no encontrada"}</p>
          <Button
            onClick={() => navigate(isAdmin ? "/orders-admin" : "/orders")}
            className="mt-4"
          >
            {isAdmin ? "Volver a órdenes" : "Volver a mis pedidos"}
          </Button>
        </div>
      </MainLayout>
    );
  }

  const order = selectedOrder;
  const totalPrice = Number(order.totalPrice ?? 0);
  const customerName =
    order.user?.fullName ||
    `${order.user?.firstName ?? ""} ${order.user?.lastName ?? ""}`.trim() ||
    order.user?.email ||
    "Cliente";
  const normalizedStatus = (order.status || "pending").toLowerCase();
  const canCancel =
    !isAdmin &&
    ["pending", "confirmed", "processing"].includes(normalizedStatus);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(isAdmin ? "/orders-admin" : "/orders")}
          className="flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {isAdmin ? "Volver a órdenes" : "Volver a mis pedidos"}
        </Button>

        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-2xl">Pedido #{order.id}</CardTitle>
            <Badge
              className={statusColors[order.status] || statusColors.pending}
            >
              {statusLabels[order.status] || statusLabels.pending}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Fecha</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Método de entrega</p>
                <p className="font-medium">
                  {deliveryMethodLabels[order.deliveryMethod] ||
                    order.deliveryMethod}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Cliente</p>
                <p className="font-medium">{customerName}</p>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
                <p className="text-sm text-gray-500">{order.user?.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Dirección de entrega</p>
                <p className="font-medium">
                  {order.deliveryAddress || "Sin dirección registrada"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Productos</h3>
              <div className="space-y-2">
                {(order.items ?? []).map((item: OrderItem) => {
                  const unitPrice = Number(
                    item.unitPrice ?? item.product?.price ?? 0,
                  );
                  const subtotal = unitPrice * item.quantity;
                  const imageUrl = item.product?.images?.[0];

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between border-b pb-2"
                    >
                      <div className="flex items-center gap-3">
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt={item.product?.name ?? "Producto"}
                            className="w-12 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">
                            {item.product?.name ?? "Producto"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Cantidad: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            Precio unidad: ${unitPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold">${subtotal.toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-4">
                <p className="text-xl font-bold text-blue-600">
                  Total: ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            {canCancel && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleCancelRequest}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Cancelar pedido
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmAlertDialog
          open={cancelDialogOpen}
          onOpenChange={setCancelDialogOpen}
          title="Cancelar pedido"
          description="Esta acción cancelará el pedido actual. ¿Deseas continuar?"
          confirmText="Cancelar pedido"
          onConfirm={handleCancel}
        />
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;
