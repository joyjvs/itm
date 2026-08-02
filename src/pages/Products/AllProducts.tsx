import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { ProductCard } from "@/components/features/Product/ProductCard";
import { ProductFilters } from "@/components/forms/Admin/Productos/ProductFilters";
import { useProducts } from "@/hooks/useProducts";
import { PaginationControls } from "@/components/common/PaginationControls";

const AllProducts = () => {
  const { products, fetchProducts, isLoading, pagination, setPage, setLimit } =
    useProducts();

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center mb-8">
          <ProductFilters />
        </div>

        {isLoading ? (
          <div className="text-center py-20">Cargando productos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image={product.images?.[0] ?? "/banners-home/8pm.jpg"}
                  stock={product.stock}
                />
              ))}
            </div>

            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages || 1}
              itemsPerPage={pagination.itemsPerPage}
              totalItems={pagination.totalItems}
              onPageChange={(page) => setPage(page)}
              onItemsPerPageChange={(limit) => setLimit(limit)}
              className="mt-8"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default AllProducts;
