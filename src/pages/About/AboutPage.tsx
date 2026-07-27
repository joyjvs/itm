// src/pages/About/AboutPage.tsx
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Eye, Award, Clock, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Conoce nuestra historia, misión y el equipo que hace posible
            ofrecerte los mejores productos.
          </p>
        </div>

        {/* Sección de historia / descripción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-950 mb-4">
              Más de 30 años de experiencia
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Fundada en 1992, nuestra empresa ha crecido desde un pequeño
              negocio familiar hasta convertirse en un referente en la
              distribución de productos de alta calidad. Nuestro compromiso con
              la excelencia y la satisfacción del cliente nos ha permitido
              expandirnos y ofrecer un catálogo diverso que abarca múltiples
              categorías.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Hoy, seguimos innovando y adaptándonos a las necesidades del
              mercado, siempre con la misma pasión y dedicación que nos
              caracteriza.
            </p>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <img
              src="/images/about-us.jpg" // Asegúrate de tener esta imagen o usa placeholder
              alt="Nuestra empresa"
              className="w-full h-auto rounded-lg shadow-md"
              onError={(e) => {
                // Fallback si no existe la imagen
                (e.target as HTMLImageElement).src =
                  "https://picsum.photos/seed/about/600/400";
              }}
            />
          </div>
        </div>

        {/* Misión, Visión, Valores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-950 mb-4">
                <Target className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-950">
                Misión
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Proveer productos de alta calidad a precios competitivos,
              garantizando la satisfacción total de nuestros clientes y
              construyendo relaciones duraderas.
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-950 mb-4">
                <Eye className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-950">
                Visión
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Ser el aliado estratégico preferido por nuestros clientes,
              destacando por nuestra innovación, calidad y servicio
              personalizado a nivel nacional.
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-950 mb-4">
                <Award className="w-7 h-7" />
              </div>
              <CardTitle className="text-xl font-bold text-blue-950">
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-gray-600">
              Integridad, calidad, compromiso, innovación y trabajo en equipo.
              Son los pilares que guían cada una de nuestras acciones.
            </CardContent>
          </Card>
        </div>

        {/* Equipo (opcional) */}
        <h2 className="text-2xl font-bold text-blue-950 text-center mb-8">
          Nuestro Equipo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              name: "Juan Pérez",
              role: "CEO & Fundador",
              img: "https://randomuser.me/api/portraits/men/1.jpg",
            },
            {
              name: "María Gómez",
              role: "Directora de Operaciones",
              img: "https://randomuser.me/api/portraits/women/2.jpg",
            },
            {
              name: "Carlos Rodríguez",
              role: "Jefe de Ventas",
              img: "https://randomuser.me/api/portraits/men/3.jpg",
            },
            {
              name: "Ana Martínez",
              role: "Atención al Cliente",
              img: "https://randomuser.me/api/portraits/women/4.jpg",
            },
          ].map((member, idx) => (
            <Card
              key={idx}
              className="border-0 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <CardHeader className="flex flex-col items-center">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
                <CardTitle className="text-lg font-bold text-blue-950 mt-3">
                  {member.name}
                </CardTitle>
                <p className="text-sm text-gray-500">{member.role}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Información de contacto y ubicación */}
        <div className="bg-blue-50 p-8 rounded-lg border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-950" />
              Visítanos
            </h3>
            <p className="text-gray-600">Av. Principal 1234, Ciudad, País</p>
            <p className="text-gray-600 mt-2">
              <Clock className="inline w-4 h-4 mr-1 text-blue-950" />
              Lun - Vie: 9:00 - 18:00
            </p>
            <Button className="mt-4 bg-blue-950 hover:bg-blue-950 text-white">
              Ver ubicación en mapa
            </Button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-950 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-950" />
              Contáctanos
            </h3>
            <p className="text-gray-600">
              <strong>Teléfono:</strong> +1 (234) 567-890
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> contacto@reservapro.com
            </p>
            <p className="text-gray-600 mt-2">
              Estamos aquí para ayudarte. No dudes en escribirnos.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
