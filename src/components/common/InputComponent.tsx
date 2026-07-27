import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

interface InputComponentProps extends React.InputHTMLAttributes<HTMLInputElement> {
  htmlForm: string;
  label: string;
  error?: string;
  type: string;
  placeholder: string;
}

const InputComponent = ({htmlForm, label, error, type, placeholder, ...props}: InputComponentProps) => { 

  return (
    <Field>
      <FieldLabel htmlFor={htmlForm}>{label}</FieldLabel>
      <Input
        type={type}
        placeholder={placeholder}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </Field>
  )
}

export default InputComponent