import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Banner } from "@/types/banner.types";
import { BannerForm } from "./BannerForm";

interface BannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner?: Banner | null;
  onSuccess?: () => void;
}

export const BannerModal = ({
  open,
  onOpenChange,
  banner,
  onSuccess,
}: BannerModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{banner ? "Editar banner" : "Crear banner"}</DialogTitle>
      </DialogHeader>
      <BannerForm
        key={`${open}-${banner?.id ?? "new"}`}
        banner={banner}
        onSuccess={() => {
          onSuccess?.();
          onOpenChange(false);
        }}
      />
    </DialogContent>
  </Dialog>
);
