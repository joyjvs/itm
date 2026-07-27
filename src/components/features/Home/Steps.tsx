import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, BookOpen, ShoppingCart, MapPin } from "lucide-react";

const steps = [
  {
    icon: LogIn,
    title: "Inicie sesión",
    description:
      "Regístrese y tras firmar contrato podrá comenzar a realizar pedidos.",
  },
  {
    icon: BookOpen,
    title: "Explore nuestro catálogo",
    description: "Consulte productos y precios.",
  },
  {
    icon: ShoppingCart,
    title: "Agregue al carrito",
    description: "Seleccione los artículos deseados y finalice su compra.",
  },
  {
    icon: MapPin,
    title: "Recoja en almacén o solicite domicilio",
    description: "Puede consultar nuestra ubicación.",
  },
];

const HowItWorks = () => {
  return (
    <section className="container mx-auto py-12 px-4">
      {/* Título de la sección */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-blue-950 mb-10 font-serif">
        ¿Cómo funciona?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <Card
            key={index}
            className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-950 mb-4">
                <step.icon className="w-7 h-7" />
              </div>
              <CardTitle className="text-lg font-bold text-blue-950">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600 text-sm">
              {step.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;