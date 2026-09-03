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
  const { filters, setFilters } = useProducts();
  const { tree, fetchTree } = useCategories();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema) as Resolver<FilterFormValues>,
    defaultValues: {
      search: filters.search || "",
      categoryId: filters.categoryId ? String(filters.categoryId) : "",
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
  });

  useEffect(() => {
    void fetchTree();
  }, [fetchTree]);

  const categoryOptions = flattenCategoryTree(tree).map((cat) => ({
    label: cat.name,
    value: String(cat.id),
  }));

  const onSubmit = async (values: FilterFormValues) => {
    const cleanedFilters: Partial<FilterFormValues> = {};

    if (values.search?.trim()) {
      cleanedFilters.search = values.search.trim();
    }

    if (values.categoryId && values.categoryId.trim()) {
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
      categoryId: "",
      minPrice: "",
      maxPrice: "",
    } as unknown as FilterFormValues);

    form.setValue("categoryId", "", { shouldValidate: false });

    setFilters({
      search: "",
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-full">
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        {/* Filtros */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:flex-1 xl:grid-cols-4">
          {/* Buscador */}
          <div className="w-full min-w-0 [&_input]:w-full">
            <InputComponent
              htmlForm="producto"
              label="Producto"
              placeholder="Producto"
              type="text"
              {...form.register("search")}
            />
          </div>

          {/* Categoría */}
          <div className="w-full min-w-0">
            <Controller
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Categoría</FieldLabel>
                  <Select
                    items={categoryOptions}
                    value={field.value || ""}
                    onValueChange={(next) =>
                      field.onChange(next === "" ? undefined : next)
                    }
                  >
                    <SelectTrigger
                      className="w-full min-w-0"
                      onBlur={field.onBlur}
                    >
                      <SelectValue
                        placeholder={
                          tree.length
                            ? "Selecciona una categoría"
                            : "Cargando..."
                        }
                      />
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
          </div>

          {/* Precio mínimo */}
          <div className="w-full min-w-0">
            <Field>
              <FieldLabel>Precio Mínimo</FieldLabel>
              <Input
                type="number"
                placeholder="Min precio"
                inputMode="numeric"
                pattern="[0-9]*"
                {...form.register("minPrice")}
                className="w-full min-w-0"
              />
            </Field>
          </div>

          {/* Precio máximo */}
          <div className="w-full min-w-0">
            <Field>
              <FieldLabel>Precio Máximo</FieldLabel>
              <Input
                type="number"
                placeholder="Max precio"
                inputMode="numeric"
                pattern="[0-9]*"
                {...form.register("maxPrice")}
                className="w-full min-w-0"
              />
            </Field>
          </div>
        </div>

        {/* Botones */}
        <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center xl:w-auto xl:shrink-0">
          <Button type="submit" className="w-full bg-blue-950 sm:w-auto">
            Buscar
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            className="w-full sm:w-auto"
          >
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
};
