import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "../Product/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { productsService } from "@/api/services/product.service";
import type { Product } from "@/types/product.types";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";

const MAX_PRODUCTS = 10;

type ExtendedProduct = Product & {
  createdAt?: string;
  oldPrice?: number | string;
  image?: string;
  stock?: number;
  description?: string;
};

const getItemsPerSlide = (width: number) => {
  if (width >= 1280) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
};

const chunkItems = <T,>(items: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) return [items];

  const chunks: T[][] = [];

  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  return chunks;
};

const getGridColsClass = (itemsPerSlide: number) => {
  switch (itemsPerSlide) {
    case 4:
      return "grid-cols-4";
    case 3:
      return "grid-cols-3";
    case 2:
      return "grid-cols-2";
    default:
      return "grid-cols-1";
  }
};

const getOfferBadge = (product: ExtendedProduct) => {
  if (product.createdAt) {
    const createdAt = new Date(product.createdAt);

    if (!Number.isNaN(createdAt.getTime())) {
      const days = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

      if (days <= 30) {
        return "Nuevo";
      }
    }
  }

  return "Oferta especial";
};

export default function NewOffers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      setItemsPerSlide(getItemsPerSlide(window.innerWidth));
    };

    updateItemsPerSlide();

    window.addEventListener("resize", updateItemsPerSlide);

    return () => {
      window.removeEventListener("resize", updateItemsPerSlide);
    };
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await productsService.getAll(1, MAX_PRODUCTS);
        setProducts(response.data.slice(0, MAX_PRODUCTS));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las nuevas ofertas.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadProducts();
  }, []);

  const slides = useMemo(
    () => chunkItems(products, itemsPerSlide),
    [products, itemsPerSlide],
  );

  const gridColsClass = useMemo(
    () => getGridColsClass(itemsPerSlide),
    [itemsPerSlide],
  );

  return (
    <section
      className="relative overflow-hidden bg-slate-950 py-16 text-white"
      aria-labelledby="new-offers-heading"
    >
      {/* Decoración de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-40 top-16 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              Oportunidades destacadas
            </span>

            <h2
              id="new-offers-heading"
              className="mt-5 font-serif text-3xl font-bold text-white md:text-5xl"
            >
              Nuevas ofertas de temporada
            </h2>

            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Descubre una selección exclusiva de productos con disponibilidad
              inmediata y condiciones especiales para tu compra.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
          >
            Ver todas las ofertas
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Contenido */}
        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <DataStateSkeleton
              variant="cards"
              count={4}
              className="mx-auto max-w-6xl"
            />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-300/20 bg-red-500/10 p-8 text-center text-sm text-red-100">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-200">
            No hay nuevas ofertas disponibles en este momento.
          </div>
        ) : (
          <div className="relative">
            <Carousel className="w-full">
              <CarouselContent>
                {slides.map((slideProducts, slideIndex) => (
                  <CarouselItem
                    key={`offer-slide-${slideIndex}`}
                    className="basis-full"
                  >
                    <div
                      className={`mx-auto grid w-full max-w-[360px] items-stretch gap-6 py-4 sm:max-w-none ${gridColsClass}`}
                    >
                      {slideProducts.map((product) => {
                        const extendedProduct = product as ExtendedProduct;

                        const imageSrc =
                          extendedProduct.images?.[0] ||
                          extendedProduct.image ||
                          "/banners-home/8pm.jpg";

                        const isLowStock =
                          extendedProduct.stock !== undefined &&
                          extendedProduct.stock > 0 &&
                          extendedProduct.stock <= 5;

                        const badge = isLowStock
                          ? undefined
                          : getOfferBadge(extendedProduct);

                        return (
                          <ProductCard
                            key={extendedProduct.id}
                            id={extendedProduct.id}
                            name={extendedProduct.name}
                            description={extendedProduct.description}
                            price={extendedProduct.price}
                            image={imageSrc}
                            stock={extendedProduct.stock}
                            oldPrice={extendedProduct.oldPrice}
                            badge={badge}
                            className="h-full w-full"
                          />
                        );
                      })}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-2 z-30 border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:-left-5" />
              <CarouselNext className="right-2 z-30 border-white/20 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 md:-right-5" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
