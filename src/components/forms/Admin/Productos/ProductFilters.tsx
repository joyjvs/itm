// src/components/products/ProductFilters.tsx
import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldLabel } from "@/components/ui/field";

import InputComponent from "@/components/common/InputComponent";
import { useCategories } from "@/hooks/useCategories";
import { flattenCategoryTree } from "@/lib/category-utils";

const filterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  minPrice: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number().min(0).optional(),
  ),
  maxPrice: z.preprocess(
    (value) =>
      value === "" || value === null || value === undefined
        ? undefined
        : Number(value),
    z.number().min(0).optional(),
  ),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const normalizeNumberField = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

export const ProductFilters = () => {
  const { filters, setFilters, clearFilters } = useProducts();
  const { tree, fetchTree } = useCategories();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema) as Resolver<FilterFormValues>,
    defaultValues: {
      search: filters.search || "",
      categoryId: filters.categoryId ?? undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
  });

  useEffect(() => {
    void fetchTree();
  }, [fetchTree]);

  const categoryOptions = flattenCategoryTree(tree).map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  const getCategoryLabel = (value?: string) =>
    value
      ? categoryOptions.find((item) => item.value === value)?.label
      : undefined;

  const onSubmit = async (values: FilterFormValues) => {
    const cleanedFilters: Partial<FilterFormValues> = {};

    if (values.search?.trim()) {
      cleanedFilters.search = values.search.trim();
    }
    if (values.categoryId) {
      cleanedFilters.categoryId = values.categoryId;
    }

    const minPrice = normalizeNumberField(values.minPrice);
    if (minPrice !== undefined) {
      cleanedFilters.minPrice = minPrice;
    }

    const maxPrice = normalizeNumberField(values.maxPrice);
    if (maxPrice !== undefined) {
      cleanedFilters.maxPrice = maxPrice;
    }

    setFilters(cleanedFilters);
  };

  const handleClearFilters = () => {
    form.reset({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });

    clearFilters();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex justify-around gap-4 ">
        <InputComponent
          htmlForm="producto"
          label="Producto"
          placeholder="Producto"
          type="text"
          {...form.register("search")}
        />

        <Controller
          name="categoryId"
          control={form.control}
          defaultValue={undefined}
          render={({ field }) => (
            <Field>
              <FieldLabel>Categoría</FieldLabel>
              <Select
                value={field.value ?? undefined}
                onValueChange={(next) => field.onChange(next || undefined)}
              >
                <SelectTrigger
                  className="w-full max-w-48"
                  onBlur={field.onBlur}
                >
                  <SelectValue
                    placeholder={
                      tree.length ? "Selecciona una categoría" : "Cargando..."
                    }
                  >
                    {(value) => (value ? getCategoryLabel(value) : undefined)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categoryOptions.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Precio Mínimo</FieldLabel>
          <Input
            type="number"
            placeholder="Min precio"
            inputMode="numeric"
            pattern="[0-9]*"
            {...form.register("minPrice")}
            className="w-32"
          />
        </Field>

        <Field>
          <FieldLabel>Precio Máximo</FieldLabel>
          <Input
            type="number"
            placeholder="Max precio"
            inputMode="numeric"
            pattern="[0-9]*"
            {...form.register("maxPrice")}
            className="w-32"
          />
        </Field>

        <div className="flex gap-2 items-end">
          <Button type="submit" className="bg-blue-950">
            Buscar
          </Button>
          <Button type="button" variant="outline" onClick={handleClearFilters}>
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
};
