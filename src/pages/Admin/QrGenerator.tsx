import { useRef, useState } from "react";
import { Printer, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const normalizeHttpUrl = (value: string): string | null => {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    const normalizedPath =
      url.pathname === "/" && !url.search && !url.hash ? "" : url.pathname;

    return `${url.origin}${normalizedPath}${url.search}${url.hash}`;
  } catch {
    return null;
  }
};

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] ?? character,
  );

export const QrGeneratorPage = () => {
  const [url, setUrl] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [error, setError] = useState("");
  const qrRef = useRef<SVGSVGElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedUrl = normalizeHttpUrl(url.trim());

    if (!normalizedUrl) {
      setQrValue("");
      setError("Introduce una URL válida que comience con http:// o https://.");
      return;
    }

    setError("");
    setQrValue(normalizedUrl);
  };

  const handlePrint = () => {
    const printWindow = window.open(
      "",
      "qr-print-window",
      "width=600,height=800",
    );
    const qrMarkup = qrRef.current?.outerHTML;

    if (!printWindow || !qrMarkup) {
      setError(
        "No se pudo abrir la ventana de impresión. Permite las ventanas emergentes e inténtalo de nuevo.",
      );
      return;
    }

    const safeQrValue = escapeHtml(qrValue);
    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <title>Codigo QR</title>
          <style>
            @page { margin: 1.5cm; }
            * { box-sizing: border-box; }
            body {
              align-items: center;
              color: #111827;
              display: flex;
              flex-direction: column;
              font-family: Arial, sans-serif;
              gap: 18px;
              justify-content: center;
              min-height: 90vh;
              text-align: center;
            }
            svg { height: 256px; width: 256px; }
            p { font-size: 14px; margin: 0; max-width: 520px; overflow-wrap: anywhere; }
          </style>
        </head>
        <body>
          <h1>Codigo QR</h1>
          ${qrMarkup}
          <p>${safeQrValue}</p>
        </body>
      </html>
    `);
    printWindow.document.close();

    let hasPrinted = false;
    const print = () => {
      if (hasPrinted) return;
      hasPrinted = true;
      printWindow.focus();
      printWindow.addEventListener("afterprint", () => printWindow.close(), {
        once: true,
      });
      printWindow.print();
    };

    printWindow.addEventListener("load", print, { once: true });
    window.setTimeout(print, 250);
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <QrCode className="size-6" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold">Genere QR</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Introduce una URL para crear un código QR que tus clientes puedan
            escanear.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border bg-card p-5 shadow-sm sm:p-6"
          >
            <div className="space-y-2">
              <label htmlFor="qr-url" className="text-sm font-medium">
                URL de destino
              </label>
              <Input
                id="qr-url"
                type="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  if (error) setError("");
                }}
                placeholder="https://iberomax.shop"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "qr-url-error" : undefined}
              />
              {error && (
                <p id="qr-url-error" className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <QrCode aria-hidden="true" />
              Generar código QR
            </Button>
          </form>

          <section
            aria-live="polite"
            className="flex min-h-64 flex-col items-center justify-center rounded-lg border bg-card p-5 text-center shadow-sm sm:p-6"
          >
            {qrValue ? (
              <>
                <div className="rounded-lg border bg-white p-4">
                  <QRCodeSVG
                    ref={qrRef}
                    value={qrValue}
                    size={256}
                    level="M"
                    marginSize={4}
                    title={`Código QR para ${qrValue}`}
                  />
                </div>
                <p className="mt-4 max-w-full break-all text-sm text-muted-foreground">
                  {qrValue}
                </p>
                <a
                  href={qrValue}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Abrir enlace
                </a>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={handlePrint}
                >
                  <Printer aria-hidden="true" />
                  Imprimir QR
                </Button>
              </>
            ) : (
              <>
                <QrCode
                  className="size-12 text-muted-foreground/60"
                  aria-hidden="true"
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  El código QR aparecerá aquí después de generar uno.
                </p>
              </>
            )}
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
