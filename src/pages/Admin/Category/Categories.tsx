import { useState, useEffect } from "react";
import { CategoryModal } from "@/components/forms/Admin/Categorias/CategoryModal";
import { CategoryList } from "@/components/forms/Admin/Categorias/CategoryList";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import MainLayout from "@/components/layout/MainLayout";
import { Category } from "@/types/category.types";
import { flattenCategoryTree } from "@/lib/category-utils";

const CategoriesPage = () => {
  const { categories, tree, fetchTree, deleteCategory, isLoading } =
    useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category| null>(null);

  useEffect(() => {
    fetchTree();
  }, []);

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Eliminar categoría?")) {
      await deleteCategory(id);
    }
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
          onDelete={handleDelete}
        />
        <CategoryModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          category={selectedCategory}
          onSuccess={() => {
            setModalOpen(false);
            fetchTree();
          }}
        />
      </div>
    </MainLayout>
  );
};

export default CategoriesPage;
