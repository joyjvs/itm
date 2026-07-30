import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
}

const ConfirmAlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
}: ConfirmAlertDialogProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);

    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent size="sm" className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isConfirming}
            onClick={() => {
              void handleConfirm();
            }}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;
