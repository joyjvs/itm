// src/pages/Profile/ProfilePage.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import InputComponent from "@/components/common/InputComponent";

// Esquema de validación para editar perfil
const profileSchema = z.object({
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const { user, isLoading, error, updateProfile, clearError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      lastName: user?.lastName || "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      clearError();
      await updateProfile(user!.id, values);
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    // reset({
    //   firstName: user?.firstName || "",
    //   email: user?.email || "",
    //   phone: user?.phone || "",
    //   address: user?.address || "",
    // });
    setIsEditing(false);
  };

  // Si no hay usuario autenticado (carga o no autenticado)
  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Mi Perfil</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Edita tus datos personales"
                  : "Consulta y administra tu información"}
              </CardDescription>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <InputComponent
                  htmlForm="name-profile"
                  label="Nombre"
                  type="text"
                  placeholder="Nombre"
                  {...register("firstName")}
                />

                <InputComponent
                  htmlForm="email-profile"
                  label="Correo electrónico"
                  type="email"
                  placeholder="Correo electrónico"
                  {...register("email")}
                />

                <InputComponent
                  htmlForm="lastName-profile"
                  label="Apellidos"
                  type="text"
                  placeholder="Apellidos"
                  {...register("lastName")}
                />

                <InputComponent
                  htmlForm="phone-profile"
                  label="Teléfono"
                  type="text"
                  placeholder="Teléfono"
                  {...register("phone")}
                />

                <InputComponent
                  htmlForm="address-profile"
                  label="Dirección"
                  type="text"
                  placeholder="Dirección"
                  {...register("address")}
                />

                {error && (
                  <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    type="submit"
                    className="bg-blue-950 hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            ) : (
              // Vista de solo lectura
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-lg">
                  <User className="w-5 h-5 text-blue-950" />
                  <span className="font-medium">Nombre:</span>
                  <span>{user.firstName}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Mail className="w-5 h-5 text-blue-950" />
                  <span className="font-medium">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Phone className="w-5 h-5 text-blue-950" />
                  <span className="font-medium">Teléfono:</span>
                  <span>{user.phone || "No especificado"}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-5 h-5 text-blue-950" />
                  <span className="font-medium">Dirección:</span>
                  <span>{user.address || "No especificada"}</span>
                </div>
                <div className="flex items-center gap-3 text-lg">
                  <Calendar className="w-5 h-5 text-blue-950" />
                  <span className="font-medium">Miembro desde:</span>
                  <span>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap gap-4 border-t pt-6">
            <Link to="/change-password">
              <Button variant="outline" className="flex items-center gap-2">
                Cambiar contraseña
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="flex items-center gap-2">
                Mis pedidos
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
