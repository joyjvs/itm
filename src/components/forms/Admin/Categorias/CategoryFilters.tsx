import { useEffect } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
  name: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().optional(),
  createdAfter: z.string().optional(),
  createdBefore: z.string().optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

const CategoryFilters = () => {
  const { filters, tree, setFilters, fetchTree } = useCategories();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema) as Resolver<FilterFormValues>,
    defaultValues: {
      name: filters.name,
      description: filters.description,
      parentId: filters.parentId ?? "",
      createdAfter: filters.createdAfter,
      createdBefore: filters.createdBefore,
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

    if (values.name) cleanedFilters.name = values.name;
    if (values.description) cleanedFilters.description = values.description;
    if (values.parentId) cleanedFilters.parentId = values.parentId;
    if (values.createdAfter) cleanedFilters.createdAfter = values.createdAfter;
    if (values.createdBefore)
      cleanedFilters.createdBefore = values.createdBefore;

    setFilters(cleanedFilters);
  };

  const handleClearFilters = () => {
    form.reset({
      name: "",
      description: "",
      parentId: "",
      createdAfter: "",
      createdBefore: "",
    } as unknown as FilterFormValues);

    form.setValue("parentId", "", { shouldValidate: false });

    setFilters({
      name: "",
      parentId: "",
      description: "",
      createdAfter: "",
      createdBefore: "",
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
              htmlForm="category"
              label="Categoría"
              placeholder="Categoría"
              type="text"
              {...form.register("name")}
            />
          </div>
          {/* Categoria Padre */}
          <div className="w-full min-w-0">
            <Controller
              name="parentId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Categoría Padre</FieldLabel>
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
          {/* Botones */}
        </div>
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

export default CategoryFilters;
