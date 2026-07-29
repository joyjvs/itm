import { useEffect, useState } from "react";
import { ProductModal } from "@/components/forms/Admin/Productos/ProductModal";
import { ProductList } from "@/components/forms/Admin/Productos/ProductList";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import MainLayout from "@/components/layout/MainLayout";
import { Product } from "@/types/product.types";

export const ProductsPage = () => {
  const { products, fetchProducts, deleteProduct, isLoading } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar producto?")) {
      await deleteProduct(id);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Productos</h1>
          <Button
            onClick={() => {
              setSelectedProduct(null);
              setModalOpen(true);
            }}
          >
            + Nuevo
          </Button>
        </div>

        <ProductList
          products={products}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ProductModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          product={selectedProduct}
          onSuccess={() => {
            setModalOpen(false);
            fetchProducts();
          }}
        />
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
