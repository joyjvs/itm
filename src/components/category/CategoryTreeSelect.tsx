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
}

export const CategoryTreeSelect = ({
  value,
  onChange,
  className,
  placeholder = "Seleccionar categoría",
}: CategoryTreeSelectProps) => {
  const { tree, fetchTree, isLoading } = useCategories();

  useEffect(() => {
    fetchTree();
  }, []);

  const options = flattenCategoryTree(tree).map((cat) => ({
    label: "  ".repeat(cat.level) + cat.name,
    value: cat.id,
  }));

  return (
    <Field>
      <FieldLabel>Categoría padre (opcional)</FieldLabel>
      <Select value={value ?? ""} onValueChange={(next) => onChange(next)}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={isLoading ? "Cargando..." : placeholder} />
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
