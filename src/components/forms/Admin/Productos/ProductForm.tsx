import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/features/ImagesUpload";
import { CategoryTreeSelect } from "@/components/category/CategoryTreeSelect";
import InputComponent from "@/components/common/InputComponent";
import { Product } from "@/types/product.types";
import { useProducts } from "@/hooks/useProducts";
import { productsService } from "@/api/services/product.service";
import { useState } from "react";
import { X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  slug: z
    .string()
    .min(1, "El slug es requerido")
    .regex(/^[a-z0-9-]+$/, "Slug inválido"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Precio debe ser mayor o igual a 0"),
  stock: z.coerce.number().int().min(0, "Stock debe ser entero no negativo"),
  sku: z.string().optional(),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
}

export const ProductForm = ({ product, onSuccess }: ProductFormProps) => {
  const { createProduct, updateProduct, isLoading } = useProducts();
  const [imageUrls, setImageUrls] = useState<string[]>(product?.images || []);
  const isEditing = !!product;

  const { register, handleSubmit, control } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      slug: product?.slug || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      sku: product?.sku || "",
      categoryId: product?.categoryId || "",
      status: product?.status || "active",
    },
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const url = await productsService.uploadImage(file);
    setImageUrls((prev) => [...prev, url]);
    return url;
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = { ...data, images: imageUrls };
      if (isEditing) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSuccess?.();
    } catch (error) {
      console.error("Error guardando producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputComponent
        htmlForm="name-product"
        label="Nombre"
        placeholder="Ej: Café Premium"
        type="text"
        {...register("name")}
      />
      <InputComponent
        htmlForm="slug-product"
        label="Slug"
        placeholder="Ej: cafe-premium"
        type="text"
        {...register("slug")}
      />
      <InputComponent
        htmlForm="description-product"
        label="Descripción"
        placeholder="Breve descripción del producto"
        type="text"
        {...register("description")}
      />
      <div className="grid grid-cols-2 gap-4">
        <InputComponent
          htmlForm="price-product"
          label="Precio"
          placeholder="0.00"
          type="number"
          step="0.01"
          {...register("price")}
        />
        <InputComponent
          htmlForm="stock-product"
          label="Stock"
          placeholder="0"
          type="number"
          {...register("stock")}
        />
      </div>
      <InputComponent
        htmlForm="sku-product"
        label="SKU (opcional)"
        placeholder="Ej: CAF-001"
        type="text"
        {...register("sku")}
      />
      <Controller
        control={control}
        name="categoryId"
        render={({ field }) => (
          <div className="space-y-2">
            <CategoryTreeSelect
              value={field.value ?? null}
              onChange={(value) => field.onChange(value ?? null)}
              placeholder="Seleccionar categoría"
            />
          </div>
        )}
      />
      <div className="space-y-2">
        <label className="text-sm font-medium">Estado</label>
        <select
          {...register("status")}
          className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Imágenes</label>
        <div className="flex flex-wrap gap-4 mt-2">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 border rounded overflow-hidden group"
            >
              <img
                src={url}
                alt={`Product ${idx}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <ImageUpload
            onUpload={handleImageUpload}
            value={null} // no single image control, usamos array
            onChange={() => {}}
            label="Añadir imagen"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};
