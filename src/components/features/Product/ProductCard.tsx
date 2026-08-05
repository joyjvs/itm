import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/types/product.types";

interface ProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number | string;
  image: string;
  year?: number;
  stock?: number;
  initialQuantity?: number;
  onAddToCart?: (id: string | number, quantity: number) => void;
  className?: string;
}

export const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  year,
  stock = 10,
  initialQuantity = 1,
  onAddToCart,
  className = "",
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addItem } = useCart();

  const priceValue = typeof price === "number" ? price : Number(price);
  const normalizedPrice = Number.isFinite(priceValue) ? priceValue : 0;
  const formattedPrice = normalizedPrice.toFixed(2);

  const increment = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= stock) {
      setQuantity(val);
    } else if (e.target.value === "") {
      setQuantity(1);
    }
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const product: Product = {
      id: String(id),
      name,
      description: description ?? "",
      price: normalizedPrice,
      categoryId: "00000000-0000-0000-0000-000000000000",
      images: image ? [image] : [],
      stock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addItem(product, quantity);
    if (onAddToCart) {
      onAddToCart(id, quantity);
    }
  };

  return (
    <Card
      className={`group relative z-10 w-full max-w-[260px] overflow-hidden rounded-2xl ... ${className}`}
    >
      {/* ===== Imagen ===== */}
      <Link
        to={`/product/${id}`}
        className="relative block aspect-square w-full overflow-hidden bg-gradient-to-b from-slate-50 to-white"
      >
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />

        {year && (
          <span className="absolute right-2 top-2 rounded-full border border-amber-200/70 bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-amber-700 shadow-sm backdrop-blur">
            {year}
          </span>
        )}

        {stock === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <span className="rounded-full bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
              Agotado
            </span>
          </div>
        )}
      </Link>

      {/* ===== Información ===== */}
      <div className="flex flex-col gap-1.5 p-3">
        <Link to={`/product/${id}`} className="block min-w-0">
          <h3 className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-blue-950">
            {name}
          </h3>
          {description && (
            <p className="truncate text-xs text-slate-400">{description}</p>
          )}
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-base font-bold tracking-tight text-blue-950">
            ${formattedPrice}
          </span>
          <span
            className={`flex items-center gap-1 text-[10px] font-medium ${
              stock > 0 ? "text-emerald-600" : "text-red-500"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stock > 0 ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {stock > 0 ? "Disponible" : "Agotado"}
          </span>
        </div>

        {/* ===== Cantidad + CTA ===== */}
        {stock > 0 && (
          <div className="mt-1 flex items-center gap-2">
            <div className="flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50">
              <button
                type="button"
                aria-label="Disminuir cantidad"
                onClick={decrement}
                disabled={quantity <= 1}
                className="px-1.5 py-1.5 text-slate-500 transition-colors hover:text-blue-950 disabled:opacity-30"
              >
                <Minus className="h-3 w-3" />
              </button>
              <input
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={handleQuantityChange}
                aria-label="Cantidad"
                className="w-7 bg-transparent text-center text-xs font-semibold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                aria-label="Aumentar cantidad"
                onClick={increment}
                disabled={quantity >= stock}
                className="px-1.5 py-1.5 text-slate-500 transition-colors hover:text-blue-950 disabled:opacity-30"
              >
                <Plus className="h-3 w-3" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="h-8 flex-1 rounded-full bg-blue-950 text-xs font-semibold text-white hover:bg-blue-800"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Agregar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
