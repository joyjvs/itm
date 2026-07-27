import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedOrder,
    isLoading,
    error,
    fetchOrderById,
    cancelOrder,
    clearError,
  } = useOrders();
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);

  const handleCancel = async () => {
    if (!selectedOrder) return;
    if (!confirm("¿Estás seguro de que deseas cancelar este pedido?")) return;
    setIsCancelling(true);
    try {
      await cancelOrder(selectedOrder.id);
      // Refrescar detalle
      await fetchOrderById(selectedOrder.id);
    } catch (error) {
      // error manejado en el store
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
          <Button onClick={() => navigate("/orders")} className="mt-4">
            Volver a mis pedidos
          </Button>
        </div>
      </MainLayout>
    );
  }

  const order = selectedOrder;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/orders")}
          className="flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a mis pedidos
        </Button>

        <Card>
          <CardHeader className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-2xl">Pedido #{order.id}</CardTitle>
            <Badge className={statusColors[order.status]}>
              {statusLabels[order.status]}
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
                <p className="text-gray-500">Método de pago</p>
                <p className="font-medium">{order.paymentMethod}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-gray-500">Dirección de envío</p>
                <p className="font-medium">{order.shippingAddress}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2">Productos</h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-4">
                <p className="text-xl font-bold text-blue-600">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Botón cancelar solo si está pendiente o procesando */}
            {(order.status === "pending" || order.status === "processing") && (
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleCancel}
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
      </div>
    </MainLayout>
  );
};

export default OrderDetailPage;
