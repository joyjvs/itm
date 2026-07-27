import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  registerSchema,
  type RegisterFormData,
} from "../../validators/auth.validators";
import { useAuth } from "../../hooks/useAuth";
import InputComponent from "../common/InputComponent";
import { Button } from "@/components/ui/button"
import Alert from "../common/Alert";

interface RegisterFormProps {
  onSuccess?: () => void;
}

const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { register: authRegister, isLoading, error, clearError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setSubmitError(null);
      clearError();
      await authRegister(data.email, data.password, data.name, data.lastName);
      onSuccess?.();
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || "Error al registrarse");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      {(error || submitError) && (
        <Alert variant="destructive" onClose={clearError}>
          {error || submitError}
        </Alert>
      )}

      <InputComponent
        htmlForm="input-field-name"
        label="Nombre"
        placeholder="Juan"
        type="text"
        {...register("name")}
        error={errors.name?.message}
      />

      <InputComponent
        htmlForm="input-field-lastName"
        label="Apellidos"
        placeholder="Perez"
        type="text"
        {...register("lastName")}
        error={errors.lastName?.message}
      />

      <InputComponent
        htmlForm="input-field-email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <InputComponent
        htmlForm="input-field-password"
        label="Contraseña"
        placeholder="**********"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <InputComponent
        htmlForm="input-field-confirmPassword"
        label="Confirmar Contraseña"
        placeholder="**********"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" disabled={isLoading} className="w-full bg-blue-950">
        {isLoading ? "Registrando..." : "Registrarse"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <a href="/login" className="text-primary hover:underline">
          Iniciar sesión
        </a>
      </p>
    </form>
  );
};

export default RegisterForm;
