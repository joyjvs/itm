import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import {
  LogIn,
  BookOpen,
  ShoppingCart,
  MapPin,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Inicie sesión",
    description:
      "Regístrese y, tras firmar contrato, podrá comenzar a realizar pedidos.",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    icon: BookOpen,
    title: "Explore nuestro catálogo",
    description: "Consulte productos, precios y disponibilidad.",
    accent: "from-indigo-600 to-violet-600",
  },
  {
    icon: ShoppingCart,
    title: "Agregue al carrito",
    description:
      "Seleccione los artículos deseados y finalice su compra fácilmente.",
    accent: "from-violet-600 to-fuchsia-600",
  },
  {
    icon: MapPin,
    title: "Recoja en almacén o domicilio",
    description: "Elija recogida en almacén o solicite entrega a domicilio.",
    accent: "from-fuchsia-600 to-rose-600",
  },
];

const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/60 py-20">
      {/* Decoración de fondo */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-blue-300/20 blur-3xl" />
        <div className="absolute -right-32 top-24 h-80 w-80 rounded-full bg-indigo-300/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-violet-300/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        {/* Encabezado */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-900 shadow-sm">
            Guía rápida
          </span>

          <h2 className="mt-6 font-serif text-3xl font-bold text-blue-950 md:text-5xl">
            ¿Cómo funciona?
          </h2>

          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Realice su pedido en pocos pasos y de forma simple, desde el
            catálogo hasta la entrega final.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14">
          {/* Línea conectora en desktop */}
          <div
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-16 hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block"
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <Card
                  key={step.title}
                  className="group relative overflow-hidden border-blue-100/80 bg-white/80 p-6 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Número de paso gigante */}
                  <div className="absolute right-4 top-2 text-7xl font-black text-blue-950/5 transition-colors duration-300 group-hover:text-blue-950/10">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Ícono */}
                  <div
                    className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.accent} text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
                  >
                    <Icon className="h-8 w-8" />
                  </div>

                  {/* Contenido */}
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
                    Paso {index + 1}
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-blue-950">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>

                  {/* Línea inferior animada */}
                  <div className="mt-6 h-1 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 group-hover:w-full" />
                </Card>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 rounded-full bg-blue-950 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-blue-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-900 hover:shadow-2xl md:text-base"
          >
            Explorar catálogo
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
