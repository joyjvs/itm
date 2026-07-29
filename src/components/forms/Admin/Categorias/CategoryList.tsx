import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Category } from "@/types/category.types";

interface CategoryListProps {
  categories: Category[];
  isLoading: boolean;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

export const CategoryList = ({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: CategoryListProps) => {
  if (isLoading) return <div>Cargando categorías...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Categoría padre</TableHead>
          <TableHead>Subcategorías</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => (
          <TableRow key={cat.id}>
            <TableCell>{cat.name}</TableCell>
            <TableCell>{cat.slug}</TableCell>
            <TableCell>{cat.parentId ? "Sí" : "Raíz"}</TableCell>
            <TableCell>
              <Badge variant="secondary">{cat.children?.length || 0}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(cat)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(cat.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
