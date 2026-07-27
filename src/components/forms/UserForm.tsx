import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usersService } from "../../api/services/users.service";
import type { User } from "../../types/auth.types";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserFormData,
  type UpdateUserFormData,
} from "../../validators/user.validators";
import Alert from "../common/Alert";
import Button from "../common/Button";
import Input from "../common/Input";

interface UserFormProps {
  user?: User | null;
  onSuccess?: () => void;
}

type UserFormData = CreateUserFormData | UpdateUserFormData;

const UserForm = ({ user, onSuccess }: UserFormProps) => {
  const isEditing = !!user;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: user
      ? {
          name: user.name,
          lastName: user.lastName,
          email: user.email,
        }
      : undefined,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [reset, user]);

  const onSubmit = async (data: UserFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (isEditing && user) {
        const updateData = data as UpdateUserFormData;
        await usersService.update(user.id, {
          name: updateData.name,
          lastName: updateData.lastName,
          email: updateData.email,
        });
      } else {
        await usersService.create(data as CreateUserFormData);
        reset();
      }

      onSuccess?.();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "No se pudo guardar el usuario",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitError && (
        <Alert variant="destructive" onClose={() => setSubmitError(null)}>
          {submitError}
        </Alert>
      )}

      <Input
        label="Nombre"
        placeholder="Juan"
        {...register("name")}
        error={errors.name?.message}
      />

      <Input
        label="Apellido"
        placeholder="Perez"
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <Input
        label="Email"
        placeholder="usuario@email.com"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      {!isEditing && (
        <Input
          label="Contrasena"
          placeholder="********"
          type="password"
          {...register("password")}
          error={"password" in errors ? errors.password?.message : undefined}
        />
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          {isEditing ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
