import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { Category } from "@/types/category.types";
import type { Product } from "@/types/product.types";
import { ProductCard } from "../Product/ProductCard";
import { categoriesService } from "@/api/services/categories.service";
import { productsService } from "@/api/services/product.service";

const PAGE_SIZE = 10;

const SectionProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categoryPages, setCategoryPages] = useState<Record<string, number>>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};

    categories.forEach((category) => {
      grouped[category.id] = allProducts.filter((product) =>
        matchesCategory(product, category),
      );
    });

    return grouped;
  }, [allProducts, categories]);

  const fetchCategoriesAndProducts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [categoryResponse, productResponse] = await Promise.all([
        categoriesService.getAll(1, 100),
        productsService.getAll(1, 100),
      ]);

      const nextCategories = categoryResponse.data ?? [];
      const nextProducts = productResponse.data ?? [];

      setCategories(nextCategories);
      setAllProducts(nextProducts);
      setCategoryPages(
        Object.fromEntries(nextCategories.map((category) => [category.id, 1])),
      );
    } catch {
      setCategories([]);
      setAllProducts([]);
      setCategoryPages({});
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

  const handlePageChange = (category: Category, newPage: number) => {
    const categoryProducts = productsByCategory[category.id] ?? [];
    const totalPages = Math.max(
      1,
      Math.ceil(categoryProducts.length / PAGE_SIZE),
    );
    const nextPage = Math.min(Math.max(1, newPage), totalPages);

    setCategoryPages((prev) => ({ ...prev, [category.id]: nextPage }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
          Algunas de nuestras categorías
        </h2>
      </div>

      {isLoading && (
        <div className="text-center text-gray-600">Cargando categorías...</div>
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
            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.map((product) => (
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
            ) : (
              <div className="text-center text-gray-600">
                No hay productos disponibles para mostrar.
              </div>
            )}
          </TabsContent>

          {categories.map((category) => {
            const items = productsByCategory[category.id] ?? [];
            const page = categoryPages[category.id] ?? 1;
            const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
            const startIndex = (page - 1) * PAGE_SIZE;
            const visibleItems = items.slice(
              startIndex,
              startIndex + PAGE_SIZE,
            );

            return (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-0"
              >
                {visibleItems.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {visibleItems.map((product) => (
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

                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                          aria-label={`Anterior ${category.name}`}
                          onClick={() => handlePageChange(category, page - 1)}
                          disabled={page <= 1}
                          className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
                        >
                          Anterior
                        </button>

                        <div className="text-sm text-gray-700">
                          Página {page} / {totalPages}
                        </div>

                        <button
                          aria-label={`Siguiente ${category.name}`}
                          onClick={() => handlePageChange(category, page + 1)}
                          disabled={page >= totalPages}
                          className="px-3 py-1 rounded border bg-white text-sm disabled:opacity-50"
                        >
                          Siguiente
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    No hay productos disponibles para esta categoría.
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </div>
  );
};

const matchesCategory = (product: Product, category: Category) => {
  const categoryId = category.id?.toLowerCase();
  const categoryName = category.name?.toLowerCase();

  const productCategoryId =
    typeof product.category === "object" && product.category !== null
      ? product.category.id?.toLowerCase()
      : undefined;

  const productCategoryName =
    typeof product.category === "string"
      ? product.category.toLowerCase()
      : typeof product.category === "object" && product.category !== null
        ? product.category.name?.toLowerCase()
        : undefined;

  return (
    product.categoryId?.toLowerCase() === categoryId ||
    productCategoryId === categoryId ||
    productCategoryName === categoryName ||
    productCategoryName === categoryId
  );
};

export default SectionProducts;
