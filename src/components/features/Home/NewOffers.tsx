import { useEffect, useMemo, useState } from "react";
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
      className="container mx-auto py-8 px-4"
      aria-labelledby="new-offers-heading"
    >
      <div className="flex justify-center mb-8">
        <h2
          id="new-offers-heading"
          className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif"
        >
          Nuevas Ofertas
        </h2>
      </div>

      {isLoading ? (
        <div className="py-8">
          <DataStateSkeleton
            variant="cards"
            count={4}
            className="mx-auto max-w-6xl"
          />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-700">
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
                  <div className={`grid gap-6 ${gridColsClass}`}>
                    {slideProducts.map((product) => {
                      const imageSrc =
                        product.images?.[0] ||
                        product.image ||
                        "/banners-home/8pm.jpg";

                      return (
                        <ProductCard
                          key={product.id}
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          image={imageSrc}
                          className="h-full"
                        />
                      );
                    })}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      )}
    </section>
  );
}
