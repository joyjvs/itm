import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ProcessingPaymentOverlay = () => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <div
      ref={overlayRef}
      tabIndex={-1}
      role="alertdialog"
      aria-modal="true"
      aria-label="Procesando pago"
      onKeyDown={(event) => {
        if (event.key === "Tab") {
          event.preventDefault();
        }
      }}
      className="fixed inset-0 z-[9999] flex cursor-wait flex-col items-center justify-center gap-4 bg-slate-950/70 backdrop-blur-sm outline-none"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />

      <div className="text-center">
        <p className="text-sm font-semibold text-white">Procesando pago...</p>
        <p className="mt-1 text-xs text-white/70">
          Por favor no cierres ni recargues esta página
        </p>
      </div>
    </div>,
    document.body,
  );
};


export default ProcessingPaymentOverlay;