import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Banner } from "@/types/banner.types";
import { useBanners } from "@/hooks/useBanners";

const bannerSchema = z.object({
  name: z.string().trim().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  link: z.string().optional(),
  isActive: z.boolean(),
});

type BannerFormValues = z.infer<typeof bannerSchema>;

interface BannerFormProps {
  banner?: Banner | null;
  onSuccess?: () => void;
}

export const BannerForm = ({ banner, onSuccess }: BannerFormProps) => {
  const { createBanner, updateBanner, isLoading } = useBanners();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const isEditing = Boolean(banner);
  const existingImages = banner?.images?.length
    ? banner.images
    : banner?.imageUrl
      ? [banner.imageUrl]
      : [];
  const { register, control, handleSubmit, reset } = useForm<BannerFormValues>({
    defaultValues: {
      name: banner?.name ?? "",
      description: banner?.description ?? "",
      link: banner?.link ?? "",
      isActive: banner?.isActive ?? true,
    },
  });

  useEffect(() => {
    reset({
      name: banner?.name ?? "",
      description: banner?.description ?? "",
      link: banner?.link ?? "",
      isActive: banner?.isActive ?? true,
    });
  }, [banner, reset]);

  useEffect(
    () => () => previews.forEach((preview) => URL.revokeObjectURL(preview)),
    [previews],
  );

  const handleFilesChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const selected = Array.from(selectedFiles).slice(0, 5);
    setFiles(selected);
    setPreviews(selected.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (values: BannerFormValues) => {
    const parsed = bannerSchema.safeParse(values);
    if (!parsed.success || (!isEditing && files.length === 0)) return;

    const formData = new FormData();
    formData.append("name", values.name.trim());
    if (values.description?.trim())
      formData.append("description", values.description.trim());
    if (values.link?.trim()) formData.append("link", values.link.trim());
    formData.append("isActive", String(values.isActive));
    files.forEach((file) => formData.append("images", file));

    if (banner) await updateBanner(banner.id, formData);
    else await createBanner(formData);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="banner-name" className="text-sm font-medium">
          Nombre
        </label>
        <Input
          id="banner-name"
          placeholder="Ej: Promoción de verano"
          {...register("name")}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="banner-description" className="text-sm font-medium">
          Descripción
        </label>
        <Input
          id="banner-description"
          placeholder="Texto descriptivo opcional"
          {...register("description")}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="banner-link" className="text-sm font-medium">
          Enlace
        </label>
        <Input
          id="banner-link"
          placeholder="/products o https://..."
          {...register("link")}
        />
      </div>
      <Field className="items-center gap-3" orientation="horizontal">
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <>
              <input
                id="banner-active"
                type="checkbox"
                checked={field.value}
                onChange={(event) => field.onChange(event.target.checked)}
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <FieldLabel
                htmlFor="banner-active"
                className="text-sm font-medium"
              >
                Banner activo
              </FieldLabel>
            </>
          )}
        />
      </Field>
      <div className="space-y-2">
        <label htmlFor="banner-images" className="text-sm font-medium">
          Imágenes
        </label>
        <Input
          id="banner-images"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(event) => handleFilesChange(event.target.files)}
        />
        <p className="text-xs text-muted-foreground">
          Hasta 5 imágenes, máximo 5 MB cada una.
        </p>
        {(previews.length > 0 || existingImages.length > 0) && (
          <div className="flex flex-wrap gap-3">
            {(previews.length > 0 ? previews : existingImages).map(
              (url, index) => (
                <img
                  key={url}
                  src={url}
                  alt={`Vista previa ${index + 1}`}
                  className="h-20 w-28 rounded border object-cover"
                />
              ),
            )}
          </div>
        )}
        {isEditing && files.length === 0 && existingImages.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Las imágenes actuales se conservarán si no seleccionas nuevas.
          </p>
        )}
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Guardando..." : isEditing ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};
