import { Menu, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUIStore } from "../../store/uiStore";
import AccountComponent from "../features/Account/AccountComponent";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Badge } from "@/components/ui/badge";

const Header = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useUIStore();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-slate-50 border-b border-input backdrop-blur">
      <div className="flex items-center justify-between h-22 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <img
            src="/logo.jpeg"
            alt="IberoMax"
            className="h-22 w-auto sm:h-12 md:h-22"
          />

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/")}
          >
            Inicio
          </Button>

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/products")}
          >
            Comprar
          </Button>

          <Button
            className="text-blue-950"
            variant="link"
            onClick={() => navigate("/about")}
          >
            Sobre nostros
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs rounded-full"
              >
                {totalItems}
              </Badge>
            )}
          </Link>
          <AccountComponent />
        </div>
      </div>
    </header>
  );
};

export default Header;
