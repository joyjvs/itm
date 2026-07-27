import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { User } from "lucide-react";

const AccountComponent = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  console.log(user)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <div className="flex items-center gap-2 px-3 py-2 rounded-md">
            <User />
            <span className="text-sm font-medium">{user?.firstName}</span>
          </div>
        }
      />
      <DropdownMenuContent className="w-40" align="start">
        {isAuthenticated && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Perfil
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Mis pedidos
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/change-password")}>
                Cambiar Contraseña
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => logout()}>
                Salir
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {!isAuthenticated && (
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => navigate("/login")}>
              Acceder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/register")}>
              Crear Cuenta
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AccountComponent;
