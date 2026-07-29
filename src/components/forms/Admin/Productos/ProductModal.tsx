import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { Product } from "@/types/product.types";

interface ProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess?: () => void;
}

export const ProductModal = ({
  open,
  onOpenChange,
  product,
  onSuccess,
}: ProductModalProps) => {
  const isEditing = !!product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar producto" : "Crear producto"}
          </DialogTitle>
        </DialogHeader>
        <ProductForm
          product={product}
          onSuccess={() => {
            onSuccess?.();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
