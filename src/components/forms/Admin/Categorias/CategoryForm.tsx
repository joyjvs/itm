import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CategoryTreeSelect } from "@/components/category/CategoryTreeSelect";
import { Category } from "@/types/category.types";
import { useCategories } from "@/hooks/useCategories";
import InputComponent from "@/components/common/InputComponent";
import { useEffect } from "react";

const categorySchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  parentId: z.string().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category | null;
  onSuccess?: () => void;
}

export const CategoryForm = ({ category, onSuccess }: CategoryFormProps) => {
  const { createCategory, updateCategory, isLoading } = useCategories();
  const isEditing = !!category;

  const { register, handleSubmit, reset, control } =
    useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
      defaultValues: {
        name: category?.name || "",
        description: category?.description || "",
        parentId: category?.parentId || null,
      },
    });

  useEffect(() => {
    if (category) {
      reset({
        ...category,
      });
    }
  }, [reset, category]);

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEditing) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando categoría:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputComponent
        htmlForm="name-category"
        label="Nombre"
        placeholder="Ej: Alimentos"
        type="text"
        {...register("name")}
      />

      <InputComponent
        htmlForm="description-category"
        label="Descripción (opcional)"
        placeholder="Breve descripción"
        type="text"
        {...register("description")}
      />

      <Controller
        control={control}
        name="parentId"
        render={({ field }) => (
          <div className="space-y-2">
            <CategoryTreeSelect
              value={field.value ?? null}
              onChange={(value) => field.onChange(value ?? null)}
              placeholder="Sin categoría padre"
            />
          </div>
        )}
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};
