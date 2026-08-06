import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Layers } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const MAX_CATEGORIES = 100;

type ExtendedProduct = Product & {
  image?: string;
  stock?: number;
  description?: string;
  oldPrice?: number | string;
  createdAt?: string;
};

type ProductsCarouselProps = {
  products: Product[];
  badge?: string;
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

const tabTriggerClass = [
  "group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-transparent px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all duration-300",
  "hover:bg-white/10 hover:text-white",
  "data-[active]:border-blue-400/30 data-[active]:bg-gradient-to-r data-[active]:from-blue-700 data-[active]:to-indigo-600 data-[active]:text-white data-[active]:shadow-lg data-[active]:shadow-blue-900/30",
  "data-[state=active]:border-blue-400/30 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-900/30",
].join(" ");

const CountBadge = ({ count }: { count: number }) => {
  return (
    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-200 transition-colors group-data-[active]:bg-white/20 group-data-[active]:text-white group-data-[state=active]:bg-white/20 group-data-[state=active]:text-white">
      {count}
    </span>
  );
};

const ProductsCarousel = ({ products, badge }: ProductsCarouselProps) => {
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
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur">
        <p className="text-sm font-medium text-slate-200">
          No hay productos disponibles para esta categoría.
        </p>
        <p className="mt-2 text-xs text-slate-400">
          Vuelve pronto o visita otras categorías del catálogo.
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slideProducts, slideIndex) => (
            <CarouselItem
              key={`category-slide-${slideIndex}`}
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
  );
};

const SectionProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allProducts = useMemo(() => {
    return categories.flatMap((category) => category.products ?? []);
  }, [categories]);

  useEffect(() => {
    const loadCategoriesAndProducts = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const categoryResponse = await categoriesService.getAll(
          1,
          MAX_CATEGORIES,
        );

        const nextCategories = categoryResponse.data ?? [];

        setCategories(nextCategories);
      } catch {
        setCategories([]);
        setErrorMessage(
          "No se pudieron cargar las categorías en este momento.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadCategoriesAndProducts();
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-slate-950 py-16 text-white"
      aria-labelledby="section-products-heading"
    >
      {/* Decoración de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-16 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-40 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Encabezado */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
              <Layers className="h-3.5 w-3.5" />
              Catálogo por categorías
            </span>

            <h2
              id="section-products-heading"
              className="mt-5 font-serif text-3xl font-bold text-white md:text-5xl"
            >
              Explora nuestras categorías
            </h2>

            <p className="mt-4 text-sm text-slate-300 md:text-base">
              Encuentra rápidamente los productos ideales para tu negocio o para
              tu hogar, filtrando por categorías y disponibilidad.
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
          >
            Ver catálogo completo
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Estados */}
        {isLoading && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <DataStateSkeleton
              variant="cards"
              count={4}
              className="mx-auto max-w-6xl"
            />
          </div>
        )}

        {!isLoading && errorMessage && (
          <div className="rounded-3xl border border-red-300/20 bg-red-500/10 p-8 text-center text-sm text-red-100">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && categories.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-200">
            No hay categorías disponibles por el momento.
          </div>
        )}

        {/* Tabs + Carruseles */}
        {!isLoading && !errorMessage && categories.length > 0 && (
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="mb-8 flex w-full max-w-full items-center justify-start gap-2 overflow-x-auto rounded-full border border-white/10 bg-white/5 p-1.5 backdrop-blur [scrollbar-width:thin] md:flex-wrap md:justify-center">
              <TabsTrigger value="todos" className={tabTriggerClass}>
                Todos
                <CountBadge count={allProducts.length} />
              </TabsTrigger>

              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className={tabTriggerClass}
                >
                  {category.name}
                  <CountBadge count={category.products?.length ?? 0} />
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="todos" className="mt-0">
              <ProductsCarousel products={allProducts} />
            </TabsContent>

            {categories.map((category) => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0"
              >
                <ProductsCarousel
                  products={category.products ?? []}
                  badge={category.name}
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default SectionProducts;
