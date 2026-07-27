import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <h2 className="text-2xl font-semibold text-foreground">
          Página No Encontrada
        </h2>
        <p className="text-muted-foreground max-w-md">
          La página que buscas no existe o ha sido movida. Por favor, vuelve al
          inicio.
        </p>
        <Button onClick={() => navigate("/")}>Volver al Inicio</Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
