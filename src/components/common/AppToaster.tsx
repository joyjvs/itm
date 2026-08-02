import { Toaster } from "sonner";

export const AppToaster = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      visibleToasts={5}
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: "border border-slate-200 shadow-lg rounded-xl",
          success: "bg-green-50 text-green-900",
          error: "bg-red-50 text-red-900",
          info: "bg-blue-50 text-blue-900",
          loading: "bg-slate-50 text-slate-900",
        },
      }}
    />
  );
};

export default AppToaster;
