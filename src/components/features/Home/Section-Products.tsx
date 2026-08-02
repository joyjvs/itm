import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";
import { ProductCard } from "../Product/ProductCard";
import { categoriesService } from "@/api/services/categories.service";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";

const getItemsPerSlide = (width: number) => {
  if (width >= 1280) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
};

const chunkItems = <T,>(items: T[], chunkSize: number): T[][] => {
  if (chunkSize <= 0) return [items];

  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
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

type ProductsCarouselProps = {
  products: Product[];
};

const ProductsCarousel = ({ products }: ProductsCarouselProps) => {
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

  const slides = useMemo(
    () => chunkItems(products, itemsPerSlide),
    [products, itemsPerSlide],
  );

  const gridColsClass = useMemo(
    () => getGridColsClass(itemsPerSlide),
    [itemsPerSlide],
  );

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-700">
        No hay productos disponibles para esta categoría.
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slideProducts, slideIndex) => (
            <CarouselItem key={`slide-${slideIndex}`} className="basis-full">
              <div className={`grid gap-6 ${gridColsClass}`}>
                {slideProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    price={product.price}
                    image={product.image ?? product.images?.[0] ?? ""}
                    stock={product.stock}
                  />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

const SectionProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allProducts = useMemo(() => {
    return categories.flatMap((category) => category.products ?? []);
  }, [categories]);

  const fetchCategoriesAndProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const categoryResponse = await categoriesService.getAll(1, 100);
      const nextCategories = categoryResponse.data ?? [];

      setCategories(nextCategories);
    } catch {
      setCategories([]);
      setErrorMessage("No se pudieron cargar las categorías en este momento.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadData = async () => {
      await fetchCategoriesAndProducts();
    };

    void loadData().finally(() => {
      if (!isActive) {
        return;
      }
    });

    return () => {
      isActive = false;
    };
  }, [fetchCategoriesAndProducts]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
          Algunas de nuestras categorías
        </h2>
      </div>

      {isLoading && (
        <div className="py-8">
          <DataStateSkeleton
            variant="cards"
            count={4}
            className="mx-auto max-w-6xl"
          />
        </div>
      )}

      {!isLoading && errorMessage && (
        <div className="text-center text-sm text-red-600">{errorMessage}</div>
      )}

      {!isLoading && categories.length === 0 && !errorMessage && (
        <div className="text-center text-gray-600">
          No hay categorías disponibles por el momento.
        </div>
      )}

      {!isLoading && categories.length > 0 && (
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="flex justify-center flex-wrap gap-2 bg-transparent mb-6">
            <TabsTrigger
              value="todos"
              className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
            >
              Todos
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[active]:bg-blue-950 data-[active]:text-white text-2xl font-serif px-4 py-2 rounded-full w-2xl h-10"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="todos" className="mt-0">
            <ProductsCarousel products={allProducts} />
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <ProductsCarousel products={category.products ?? []} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default SectionProducts;
