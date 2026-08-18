import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import { usePayment } from "@/hooks/usePayment";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { CreateOrderPayload, DeliveryMethod } from "@/types/order.types";
import { showError } from "@/utils/toast";
import { CreatePaymentPayload } from "@/types/payment.types";

const CartPage = () => {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    DeliveryMethod.PICKUP,
  );

  const normalizeCartPrice = (price: number | string) => {
    const value = typeof price === "number" ? price : Number(price);
    return Number.isFinite(value) ? value : 0;
  };

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { createPayment } = usePayment();
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-500 mb-6">
            Parece que aún no has agregado productos.
          </p>
          <Link to="/products">
            <Button className="bg-blue-950 hover:bg-blue-700">
              Ver productos
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const create = async () => {
    if (!user) return navigate("/auth/login");
    if (!user.address || user.address.length < 10) {
      // pedir al usuario que complete su dirección
      return navigate("/auth/profile");
    }
    if (items.length === 0) {
      showError("Carrito vacío", "Agrega al menos un producto para continuar.");
      return;
    }

    setIsCreating(true);
    try {
      const payload: CreateOrderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        deliveryMethod: deliveryMethod,
        deliveryAddress: user.address || "",
      };

      const order = await createOrder(payload, user.id);
      const orderUrl = `https://iberoshop.com/order/${order.id}`;
      const paymentPayload: CreatePaymentPayload = {
        amount: Number(totalPrice.toFixed(2)),
        currency: "EUR",
        identifier: order.id,
        customerEmail: user.email,
        customerName:
          [user.firstName, user.lastName].filter(Boolean).join(" ") ||
          user.email,
        customerPhone: user.phone || "",
        lang: "PT",
        successUrl: orderUrl,
        failUrl: orderUrl,
        backUrl: orderUrl,
        notify: false,
        failOver: false,
        userId: user.id,
      };

      const payment = await createPayment(paymentPayload);

      clearCart();

      const redirectUrl = payment.redirectUrl || payment.paymentUrl;
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      navigate(`/order/${order.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo procesar el pago";
      showError("No se pudo procesar el pago", message);
      console.error("Error procesando pago", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/products">
            <Button
              variant="ghost"
              size="lg"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Seguir comprando
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-blue-950">Mi Carrito</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://picsum.photos/seed/fallback/100/100";
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-blue-950 font-bold">
                      ${normalizeCartPrice(item.price).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-gray-800">
                      $
                      {(normalizeCartPrice(item.price) * item.quantity).toFixed(
                        2,
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 h-auto p-0"
                      onClick={() => removeItem(item.productId)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-blue-950">
                  Resumen del pedido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">
                    Productos ({totalItems})
                  </span>
                  <span className="font-medium">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-blue-950">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">
                    Método de entrega
                  </label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={deliveryMethod}
                    onChange={(e) =>
                      setDeliveryMethod(e.target.value as DeliveryMethod)
                    }
                  >
                    <option value={DeliveryMethod.PICKUP}>
                      Recogida en tienda
                    </option>
                    <option value={DeliveryMethod.DELIVERY}>
                      Entrega a domicilio
                    </option>
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button
                  className="w-full bg-blue-950 hover:bg-blue-700"
                  onClick={() => create()}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isCreating ? "Procesando pago..." : "Pagar ahora"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full text-red-500 hover:text-red-700"
                  onClick={clearCart}
                >
                  Vaciar carrito
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;
