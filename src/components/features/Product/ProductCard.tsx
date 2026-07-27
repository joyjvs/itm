import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image: string;
  year?: number;
  stock?: number; // stock disponible, para limitar cantidad máxima
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
  // Estado local de cantidad
  const [quantity, setQuantity] = useState(initialQuantity);
  const { addItem } = useCart();

  // Manejadores
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
      setQuantity(1); // si se vacía, restablecer a 1
    }
  };

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const product = {
      id: String(id),
      name,
      description: description ?? "",
      price,
      category: "general",
      image,
      stock: stock ?? 10,
      year,
      createdAt: "",
      updatedAt: "",
    };

    addItem(product, quantity);

    if (onAddToCart) {
      onAddToCart(id, quantity);
    }
    // Opcional: resetear cantidad a 1
    // setQuantity(1);
  };

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col max-w-xs ${className}`}
    >
      {/* Imagen + sello */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Link to={`/product/${5}`} className="block">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain"
          />
        </Link>
        {year && (
          <div className="absolute top-3 right-3 flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-md border-2 border-amber-600 text-center">
            <span className="text-[8px] font-bold text-amber-700 uppercase leading-tight">
              Since
            </span>
            <span className="text-sm font-extrabold text-amber-800 leading-tight">
              {year}
            </span>
          </div>
        )}
      </div>

      <CardHeader className="pb-1 pt-1 px-2">
        <CardTitle className="text-sm font-bold text-gray-800 uppercase tracking-wide">
          {name}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
        )}
      </CardHeader>

      <CardContent className="pb-1 px-2 space-y-1 flex-grow">
        {/* Precio y stock */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-950">
            ${price.toFixed(2)}
          </span>
          <Badge variant="secondary" className="bg-blue-100 text-blue-950">
            {stock > 0 ? `Disponible` : "Agotado"}
          </Badge>
        </div>

        {/* Controles de cantidad (solo si hay stock) */}
        {stock > 0 && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm text-gray-500">Cantidad:</span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(event) => {
                  event.preventDefault();
                  decrement();
                }}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min={1}
                max={stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Cantidad"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={(event) => {
                  event.stopPropagation();
                  increment();
                }}
                disabled={quantity >= stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-1 px-2 mt-auto">
        <Button
          onClick={(event) => handleAddToCart(event)}
          className="w-full bg-blue-950 hover:bg-blue-700 text-white text-sm py-1"
          disabled={stock === 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {stock > 0 ? "Agregar al carrito" : "Agotado"}
        </Button>
      </CardFooter>
    </Card>
  );
};
