import { useEffect, useState } from "react";
import { ProductModal } from "@/components/forms/Admin/Productos/ProductModal";
import { ProductList } from "@/components/forms/Admin/Productos/ProductList";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import MainLayout from "@/components/layout/MainLayout";
import { Product } from "@/types/product.types";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";
import { PaginationControls } from "@/components/common/PaginationControls";

export const ProductsPage = () => {
  const {
    products,
    fetchProducts,
    deleteProduct,
    isLoading,
    pagination,
    setPage,
    setLimit,
  } = useProducts();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setProductIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productIdToDelete) return;

    await deleteProduct(productIdToDelete);
    setDeleteDialogOpen(false);
    setProductIdToDelete(null);
    await fetchProducts();
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
          onDelete={handleDeleteRequest}
        />

        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages || 1}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={pagination.totalItems}
          onPageChange={(page) => setPage(page)}
          onItemsPerPageChange={(limit) => setLimit(limit)}
        />

        <ProductModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          product={selectedProduct}
          onSuccess={() => {
            setModalOpen(false);
            void fetchProducts();
          }}
        />

        <ConfirmAlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Eliminar producto"
          description="Esta acción eliminará el producto seleccionado. ¿Deseas continuar?"
          confirmText="Eliminar producto"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
