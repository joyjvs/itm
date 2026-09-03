import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataStateSkeleton } from "@/components/common/DataStateSkeleton";
import { Banner } from "@/types/banner.types";

interface BannerListProps {
  banners: Banner[];
  isLoading: boolean;
  onEdit: (banner: Banner) => void;
  onDelete: (id: string) => void;
}

export const BannerList = ({
  banners,
  isLoading,
  onEdit,
  onDelete,
}: BannerListProps) => {
  if (isLoading)
    return <DataStateSkeleton variant="table" count={6} className="py-4" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Imagen</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Enlace</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {banners.map((banner) => (
          <TableRow key={banner.id}>
            <TableCell>
              <img
                src={banner.imageUrl}
                alt={banner.name}
                className="h-12 w-20 rounded border object-cover"
              />
            </TableCell>
            <TableCell className="font-medium">{banner.name}</TableCell>
            <TableCell className="max-w-48 truncate">
              {banner.link || "-"}
            </TableCell>
            <TableCell>
              <Badge variant={banner.isActive ? "default" : "secondary"}>
                {banner.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(banner)}
                aria-label={`Editar ${banner.name}`}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(banner.id)}
                aria-label={`Eliminar ${banner.name}`}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
