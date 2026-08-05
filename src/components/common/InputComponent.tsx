import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  htmlForm: string;
  label: string;
  error?: string;
  type: string;
  placeholder: string;
}

const InputComponent = ({
  htmlForm,
  label,
  error,
  type,
  placeholder,
  ...props
}: InputComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";
  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <Field>
      <FieldLabel htmlFor={htmlForm}>{label}</FieldLabel>
      <div className="relative">
        <Input
          id={htmlForm}
          type={inputType}
          placeholder={placeholder}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onClick={() => setShowPassword((current) => !current)}
            className="absolute inset-y-0 right-2 flex items-center text-gray-500 transition-colors hover:text-gray-900"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <FieldError>{error}</FieldError>
    </Field>
  );
};

export default InputComponent;
