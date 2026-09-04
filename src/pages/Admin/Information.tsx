import { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useInformation } from "@/hooks/useInformation";
import type {
  InformationPayload,
  SocialNetwork,
} from "@/types/information.types";

const emptyNetwork = (): SocialNetwork => ({ name: "", link: "", icon: "" });

export const InformationPage = () => {
  const { information, isLoading, fetchInformation, saveInformation } =
    useInformation();
  const [form, setForm] = useState<Partial<InformationPayload>>({});
  const [logoPreview, setLogoPreview] = useState<string>();

  useEffect(() => {
    void fetchInformation();
  }, [fetchInformation]);

  const currentForm: InformationPayload = {
    address: information?.address ?? "",
    phone: information?.phone ?? "",
    email: information?.email ?? "",
    businessHours: information?.businessHours ?? "",
    socialNetworks: information?.socialNetworks ?? [],
    ...form,
  };
  const currentLogo = logoPreview ?? information?.logo;

  const updateField = (
    field: keyof Omit<InformationPayload, "socialNetworks" | "logo">,
    value: string,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateNetwork = (
    index: number,
    field: keyof SocialNetwork,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      socialNetworks: (
        current.socialNetworks ?? currentForm.socialNetworks
      ).map((network, networkIndex) =>
        networkIndex === index ? { ...network, [field]: value } : network,
      ),
    }));
  };

  const handleLogoChange = (file: File | undefined) => {
    setForm((current) => ({ ...current, logo: file }));
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveInformation({
      ...currentForm,
      socialNetworks: currentForm.socialNetworks.filter(
        (network) => network.name.trim() || network.link.trim(),
      ),
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-4xl p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Información</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona los datos de contacto que se muestran en la aplicación.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-lg border bg-card p-5 shadow-sm sm:p-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium sm:col-span-2">
              Dirección
              <Input
                value={currentForm.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder="Av. Principal 1234, Ciudad, País"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Teléfono
              <Input
                value={currentForm.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+1 (234) 567-890"
              />
            </label>
            <label className="space-y-2 text-sm font-medium">
              Correo electrónico
              <Input
                type="email"
                value={currentForm.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="contacto@iberomax.com"
              />
            </label>
            <label className="space-y-2 text-sm font-medium sm:col-span-2">
              Horario de atención
              <Input
                value={currentForm.businessHours}
                onChange={(event) =>
                  updateField("businessHours", event.target.value)
                }
                placeholder="Lun - Vie: 9:00 - 18:00"
              />
            </label>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-semibold">Redes sociales</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    socialNetworks: [
                      ...currentForm.socialNetworks,
                      emptyNetwork(),
                    ],
                  }))
                }
              >
                Añadir red
              </Button>
            </div>
            {currentForm.socialNetworks.map((network, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-md border p-3 sm:grid-cols-[1fr_1.5fr_1fr_auto] sm:items-end"
              >
                <label className="space-y-2 text-sm font-medium">
                  Nombre
                  <Input
                    value={network.name}
                    onChange={(event) =>
                      updateNetwork(index, "name", event.target.value)
                    }
                    placeholder="Facebook"
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Enlace
                  <Input
                    type="url"
                    value={network.link}
                    onChange={(event) =>
                      updateNetwork(index, "link", event.target.value)
                    }
                    placeholder="https://..."
                  />
                </label>
                <label className="space-y-2 text-sm font-medium">
                  Icono
                  <Input
                    value={network.icon}
                    onChange={(event) =>
                      updateNetwork(index, "icon", event.target.value)
                    }
                    placeholder="facebook"
                  />
                </label>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      socialNetworks: currentForm.socialNetworks.filter(
                        (_, networkIndex) => networkIndex !== index,
                      ),
                    }))
                  }
                >
                  Quitar
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <label className="space-y-2 text-sm font-medium">
              Logo
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => handleLogoChange(event.target.files?.[0])}
              />
            </label>
            {currentLogo && (
              <img
                src={currentLogo}
                alt="Logo actual"
                className="h-20 max-w-48 rounded border object-contain p-2"
              />
            )}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default InformationPage;
