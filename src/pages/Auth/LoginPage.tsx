import LoginForm from '../../components/forms/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/common/Card';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl">
            <img
              src="/logo.jpeg"
              alt="IberoMax"
              className="mx-auto block h-20 w-auto sm:h-24 md:h-28"
              onClick={() => navigate("/")}
            />
          </CardTitle>
          <CardDescription>Inicia sesión en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;