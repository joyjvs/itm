import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ChangePassowrdForm from "@/components/forms/ChangePassowrdForm";
import AuthLogo from "@/components/common/AuthLogo";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl"><AuthLogo /></CardTitle>
          <CardDescription>Cambiar contraseña</CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePassowrdForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePasswordPage;
