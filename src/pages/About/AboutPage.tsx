import { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Target,
  Eye,
  Award,
  Clock,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { useAbout } from "@/hooks/useAbout";
import { useInformation } from "@/hooks/useInformation";

const valueIcons = { target: Target, eye: Eye, award: Award } as const;

const AboutPage = () => {
  const { about, isLoading: isAboutLoading, fetchAbout } = useAbout();
  const {
    information,
    isLoading: isInformationLoading,
    fetchInformation,
  } = useInformation();

  useEffect(() => {
    void fetchAbout();
    void fetchInformation();
  }, [fetchAbout, fetchInformation]);

  if (isAboutLoading || isInformationLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
          Cargando información...
        </div>
      </MainLayout>
    );
  }

  if (!about) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold text-blue-950">Sobre Nosotros</h1>
          <p className="mt-3 text-gray-600">
            La información aún no está disponible.
          </p>
        </div>
      </MainLayout>
    );
  }

  const values = [
    { title: "Misión", description: about.mission, icon: Target as LucideIcon },
    { title: "Visión", description: about.vision, icon: Eye as LucideIcon },
    ...about.values,
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-blue-950 md:text-5xl">
            {about.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            {about.subtitle}
          </p>
        </div>
        <div className="mb-12 grid items-center gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-2xl font-bold text-blue-950">
              {about.historyTitle}
            </h2>
            <p className="leading-relaxed text-gray-600">
              {about.historyDescription}
            </p>
          </div>
          {about.historyImage && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
              <img
                src={about.historyImage}
                alt={about.historyTitle}
                className="h-auto w-full rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {values.map((value, index) => {
            const Icon: LucideIcon =
              typeof value.icon === "string"
                ? (valueIcons[value.icon as keyof typeof valueIcons] ?? Award)
                : (value.icon ?? Award);
            return (
              <Card
                key={`${value.title}-${index}`}
                className="border-0 shadow-md transition-shadow hover:shadow-lg"
              >
                <CardHeader className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-950">
                    <Icon className="h-7 w-7" />
                  </div>
                  <CardTitle className="text-xl font-bold text-blue-950">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600">
                  {value.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
        {about.teamMembers.length > 0 && (
          <>
            <h2 className="mb-8 text-center text-2xl font-bold text-blue-950">
              Nuestro Equipo
            </h2>
            <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {about.teamMembers.map((member) => (
                <Card
                  key={`${member.name}-${member.role}`}
                  className="border-0 text-center shadow-md transition-shadow hover:shadow-lg"
                >
                  <CardHeader className="flex flex-col items-center">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-24 w-24 rounded-full border-4 border-blue-100 object-cover"
                      />
                    )}
                    <CardTitle className="mt-3 text-lg font-bold text-blue-950">
                      {member.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </>
        )}
        <div className="grid grid-cols-1 gap-6 rounded-lg border border-blue-100 bg-blue-50 p-8 md:grid-cols-2">
          <div>
            <h3 className="mb-4 flex items-center text-xl font-bold text-blue-950">
              <MapPin className="mr-2 h-5 w-5" />
              Visítanos
            </h3>
            <p className="text-gray-600">{information?.address ?? ""}</p>
            <p className="mt-2 text-gray-600">
              <Clock className="mr-1 inline h-4 w-4" />
              {information?.businessHours ?? ""}
            </p>
          </div>
          <div>
            <h3 className="mb-4 flex items-center text-xl font-bold text-blue-950">
              <Users className="mr-2 h-5 w-5" />
              Contáctanos
            </h3>
            <p className="text-gray-600">
              <strong>Teléfono:</strong> {information?.phone ?? ""}
            </p>
            <p className="text-gray-600">
              <strong>Email:</strong> {information?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
