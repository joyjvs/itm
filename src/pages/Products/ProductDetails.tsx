import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    selectedProduct: product,
    isLoading,
    error,
    fetchProductById,
    clearError,
  } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  const increment = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && product && val <= product.stock) {
      setQuantity(val);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const item = {
        ...product,
        image: product.image ?? product.images?.[0] ?? "",
      };
      addItem(item, quantity);
    }
  };

  const handleRetry = () => {
    clearError();
    if (id) fetchProductById(id);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-48" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Skeleton className="aspect-square rounded-lg" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={handleRetry} variant="outline">
            Reintentar
          </Button>
          <Button
            onClick={() => navigate("/products")}
            variant="link"
            className="ml-2"
          >
            Volver a productos
          </Button>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500 text-lg">Producto no encontrado</p>
          <Button onClick={() => navigate("/products")} className="mt-4">
            Ver todos los productos
          </Button>
        </div>
      </MainLayout>
    );
  }

  const productImage =
    product.image ??
    product.images?.[0] ??
    "https://picsum.photos/seed/fallback/600/600";
  const categoryLabel =
    typeof product.category === "string"
      ? product.category
      : (product.category?.name ?? "Sin categoría");

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/products")}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Volver
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={productImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://picsum.photos/seed/fallback/600/600";
                }}
              />
              {product.year && (
                <div className="absolute top-4 right-4 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-md border-2 border-amber-600 text-center">
                  <span className="text-[8px] font-bold text-amber-700 uppercase leading-tight">
                    Since
                  </span>
                  <span className="text-sm font-extrabold text-amber-800 leading-tight">
                    {product.year}
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-blue-950 uppercase mb-2">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700"
                  >
                    {categoryLabel}
                  </Badge>
                  <Badge
                    variant={product.stock > 0 ? "default" : "destructive"}
                    className={
                      product.stock > 0 ? "bg-green-100 text-green-700" : ""
                    }
                  >
                    {product.stock > 0 ? "En stock" : "Agotado"}
                  </Badge>
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <dl className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-500 font-medium">Código</dt>
                      <dd className="text-gray-900">#{product.id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 font-medium">Categoría</dt>
                      <dd className="text-gray-900 capitalize">
                        {categoryLabel}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-500 font-medium">
                        Stock disponible
                      </dt>
                      <dd className="text-gray-900">
                        {product.stock} unidades
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Cantidad:</span>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={decrement}
                        disabled={quantity <= 1 || product.stock === 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={product.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-20 text-center"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-full"
                        onClick={increment}
                        disabled={product.stock === 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
