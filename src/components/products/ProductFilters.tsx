// src/components/products/ProductFilters.tsx
import { useForm } from "react-hook-form";
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

import InputComponent from "../common/InputComponent";

// Esquema de validación para el formulario de filtros
const filterSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

type FilterFormValues = z.infer<typeof filterSchema>;

// Lista de categorías (idealmente vendrían del backend)
const categories = [
  { label: "Seleccione un producto", value: null },
  { label: "Bebidas", value: "bebidas" },
  { label: "Carnes", value: "carnes" },
  { label: "Confituras", value: "confituras" },
];

export const ProductFilters = () => {
  const { filters, setFilters, clearFilters } = useProducts();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: filters.search || "",
      category: filters.category || "",
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sortBy: filters.sortBy || "createdAt",
      sortOrder: filters.sortOrder || "desc",
    },
  });

  const onSubmit = async (values: FilterFormValues) => {
    // Convertir valores vacíos a undefined para no enviarlos
    const cleanedFilters = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== "" && v !== undefined),
    );
    setFilters(cleanedFilters);
  };

  const handleClearFilters = () => {
    form.reset({
      search: "",
      category: "",
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    clearFilters();
  };

  return (
    <form>
      <div className="flex justify-around gap-4 ">
        <InputComponent
          htmlForm="producto"
          label="Producto"
          placeholder="Producto"
          type="text"
        />

        <Field>
          <FieldLabel>Categorias</FieldLabel>
          <Select items={categories}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

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
