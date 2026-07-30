import { useState, useEffect } from "react";
import { CategoryModal } from "@/components/forms/Admin/Categorias/CategoryModal";
import { CategoryList } from "@/components/forms/Admin/Categorias/CategoryList";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import MainLayout from "@/components/layout/MainLayout";
import { Category } from "@/types/category.types";
import { flattenCategoryTree } from "@/lib/category-utils";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

const CategoriesPage = () => {
  const { tree, fetchTree, deleteCategory, isLoading } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState<string | null>(
    null,
  );

  useEffect(() => {
    void fetchTree();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setCategoryIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryIdToDelete) return;

    await deleteCategory(categoryIdToDelete);
    setDeleteDialogOpen(false);
    setCategoryIdToDelete(null);
    await fetchTree();
  };

  const flatCategories = flattenCategoryTree(tree);

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Categorías</h1>
          <Button
            onClick={() => {
              setSelectedCategory(null);
              setModalOpen(true);
            }}
          >
            + Nueva
          </Button>
        </div>
        <CategoryList
          categories={flatCategories}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
        <CategoryModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          category={selectedCategory}
          onSuccess={() => {
            setModalOpen(false);
            void fetchTree();
          }}
        />
        <ConfirmAlertDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Eliminar categoría"
          description="Esta acción eliminará la categoría seleccionada. ¿Deseas continuar?"
          confirmText="Eliminar categoría"
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
