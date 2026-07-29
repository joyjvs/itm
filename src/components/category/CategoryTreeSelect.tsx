import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/useCategories";
import { flattenCategoryTree } from "@/lib/category-utils";
import { useEffect } from "react";
import { Field, FieldLabel } from "../ui/field";

interface CategoryTreeSelectProps {
  value?: string | null;
  onChange: (value: string | null) => void;
  className?: string;
  placeholder?: string;
  onBlur?: () => void;
}

export const CategoryTreeSelect = ({
  value,
  onChange,
  className,
  placeholder = "Seleccionar categoría",
  onBlur,
}: CategoryTreeSelectProps) => {
  const { tree, fetchTree, isLoading } = useCategories();

  useEffect(() => {
    fetchTree();
  }, [fetchTree]);

  const options = flattenCategoryTree(tree).map((cat) => ({
    label: "  ".repeat(cat.level) + cat.name,
    value: cat.id,
  }));

   const selectedLabel = value
     ? options.find((opt) => opt.value === value)?.label
     : undefined;

  return (
    <Field>
      <FieldLabel>Categoría padre (opcional)</FieldLabel>
      <Select
        value={value ?? undefined}
        onValueChange={(next) => onChange(next ?? null)}
      >
        <SelectTrigger className={className} onBlur={onBlur}>
          <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} >
            { selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};
