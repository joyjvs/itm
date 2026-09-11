import { startTransition, useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAbout } from "@/hooks/useAbout";
import type {
  AboutPayload,
  AboutTeamMember,
  AboutValue,
} from "@/types/about.types";

const emptyValue = (): AboutValue => ({ title: "", description: "", icon: "" });
const emptyMember = (): AboutTeamMember => ({ name: "", role: "", image: "" });

export const AboutAdminPage = () => {
  const { about, isLoading, fetchAbout, saveAbout } = useAbout();
  const [form, setForm] = useState<AboutPayload>({
    title: "",
    subtitle: "",
    historyTitle: "",
    historyDescription: "",
    mission: "",
    vision: "",
    values: [],
    teamMembers: [],
  });
  const [historyImage, setHistoryImage] = useState<File>();
  const [teamImages, setTeamImages] = useState<(File | undefined)[]>([]);

  useEffect(() => {
    void fetchAbout();
  }, [fetchAbout]);
  useEffect(() => {
    if (!about) return;
    startTransition(() => {
      setForm({
        title: about.title,
        subtitle: about.subtitle,
        historyTitle: about.historyTitle,
        historyDescription: about.historyDescription,
        mission: about.mission,
        vision: about.vision,
        values: about.values,
        teamMembers: about.teamMembers,
      });
      setTeamImages([]);
    });
  }, [about]);

  const updateField = (
    field: keyof Omit<
      AboutPayload,
      "values" | "teamMembers" | "historyImage" | "teamImages"
    >,
    value: string,
  ) => setForm((current) => ({ ...current, [field]: value }));
  const updateValue = (index: number, field: keyof AboutValue, value: string) =>
    setForm((current) => ({
      ...current,
      values: current.values.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  const updateMember = (
    index: number,
    field: keyof AboutTeamMember,
    value: string,
  ) =>
    setForm((current) => ({
      ...current,
      teamMembers: current.teamMembers.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  const removeMember = (index: number) => {
    setForm((current) => ({
      ...current,
      teamMembers: current.teamMembers.filter((_, i) => i !== index),
    }));
    setTeamImages((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await saveAbout({
      ...form,
      historyImage,
      teamImages: teamImages.filter((file): file is File => Boolean(file)),
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto max-w-5xl p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Acerca de Nosotros</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona el contenido de la página pública.
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-lg border bg-card p-5 shadow-sm sm:p-6"
        >
          <section className="grid gap-4 sm:grid-cols-2">
            {(
              [
                "title",
                "subtitle",
                "historyTitle",
                "historyDescription",
                "mission",
                "vision",
              ] as const
            ).map((field) => (
              <label
                key={field}
                className="space-y-2 text-sm font-medium sm:col-span-2"
              >
                {
                  {
                    title: "Título",
                    subtitle: "Subtítulo",
                    historyTitle: "Título de historia",
                    historyDescription: "Descripción de historia",
                    mission: "Misión",
                    vision: "Visión",
                  }[field]
                }
                <Input
                  value={form[field]}
                  onChange={(event) => updateField(field, event.target.value)}
                />
              </label>
            ))}
            <label className="space-y-2 text-sm font-medium sm:col-span-2">
              Imagen de historia
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={(event) => setHistoryImage(event.target.files?.[0])}
              />
            </label>
            {about?.historyImage && !historyImage && (
              <img
                src={about.historyImage}
                alt="Historia actual"
                className="h-32 rounded border object-cover sm:col-span-2"
              />
            )}
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Valores</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    values: [...current.values, emptyValue()],
                  }))
                }
              >
                Añadir valor
              </Button>
            </div>
            {form.values.map((value, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-md border p-3 sm:grid-cols-3"
              >
                <Input
                  placeholder="Título"
                  value={value.title}
                  onChange={(event) =>
                    updateValue(index, "title", event.target.value)
                  }
                />
                <Input
                  placeholder="Icono"
                  value={value.icon ?? ""}
                  onChange={(event) =>
                    updateValue(index, "icon", event.target.value)
                  }
                />
                <Input
                  placeholder="Descripción"
                  value={value.description}
                  onChange={(event) =>
                    updateValue(index, "description", event.target.value)
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      values: current.values.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Quitar
                </Button>
              </div>
            ))}
          </section>
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Equipo</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setForm((current) => ({
                    ...current,
                    teamMembers: [...current.teamMembers, emptyMember()],
                  }))
                }
              >
                Añadir miembro
              </Button>
            </div>
            {form.teamMembers.map((member, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-md border p-3 sm:grid-cols-2"
              >
                <Input
                  placeholder="Nombre"
                  value={member.name}
                  onChange={(event) =>
                    updateMember(index, "name", event.target.value)
                  }
                />
                <Input
                  placeholder="Cargo"
                  value={member.role}
                  onChange={(event) =>
                    updateMember(index, "role", event.target.value)
                  }
                />
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) =>
                    setTeamImages((current) => {
                      const next = [...current];
                      next[index] = event.target.files?.[0];
                      return next;
                    })
                  }
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeMember(index)}
                >
                  Quitar
                </Button>
                {member.image && !teamImages[index] && (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                )}
              </div>
            ))}
          </section>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default AboutAdminPage;
