import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  loginSchema,
  type LoginFormData,
} from "../../validators/auth.validators";
import { useAuth } from "../../hooks/useAuth";
import Input from "../common/Input";
import Button from "../common/Button";
import Alert from "../common/Alert";

interface LoginFormProps {
  onSuccess?: () => void;
}

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setSubmitError(null);
      clearError();
      await login(data.email, data.password);
      onSuccess?.();
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || "Credenciales inválidas.");
      return;
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

      <Input
        label="Correo Electrónico"
        placeholder="tu@email.com"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Contraseña"
        placeholder="••••••••"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <a href="/register" className="text-primary hover:underline">
          Registrarse
        </a>
      </p>
    </form>
  );
};

export default LoginForm;
