import { toast } from "sonner";
import { TOAST_DURATION } from "./constants";

export const showSuccess = (message: string, description?: string) => {
  return toast.success(message, {
    description,
    duration: TOAST_DURATION,
  });
};

export const showError = (message: string, description?: string) => {
  return toast.error(message, {
    description,
    duration: TOAST_DURATION,
  });
};

export const showInfo = (message: string, description?: string) => {
  return toast.info(message, {
    description,
    duration: TOAST_DURATION,
  });
};
