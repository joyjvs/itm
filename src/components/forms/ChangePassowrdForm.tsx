import { useAuth } from "@/hooks/useAuth";
import { changePasswordSchema } from "@/validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { type ChangePassowrdFormData } from "@/validators/auth.validators";
import Alert from "../common/Alert";
import Input from "../common/Input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

const ChangePassowrdForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const { changePassword, isLoading, error, clearError, user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassowrdFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePassowrdFormData) => {
    try {
      setSubmitError(null);
      clearError();
      await changePassword(user!.id, data.password, data.confirmPassword);
      onSuccess?.();
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSubmitError(message || "Error al iniciar sesión");
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
        label="Contraseña nueva"
        placeholder="**********"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label="Confirmar contraseña"
        placeholder="**********"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Cambiando contraseña..." : "Cambiar contraseña"}
      </Button>
    </form>
  );
};

export default ChangePassowrdForm;
