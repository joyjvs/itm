import { Link, useLocation } from "react-router-dom";
import { FolderOpen, Users, X } from "lucide-react";
import { useUIStore } from "../../store/uiStore";
import Button from "../common/Button";
import cn from "../../utils/cn";

const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const links = [
    { href: "/projects", label: "Proyectos", icon: FolderOpen },
    { href: "/users", label: "Usuarios", icon: Users },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-64 border-r border-input bg-background transition-transform duration-300 md:relative md:top-0 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <nav className="space-y-2 p-4">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                location.pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </aside>
    </>
  );
};

export default Sidebar;
