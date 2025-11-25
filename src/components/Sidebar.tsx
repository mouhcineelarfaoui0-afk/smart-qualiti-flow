import { Home, AlertTriangle, ClipboardCheck, FileText, Brain, Settings, Menu, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: AlertTriangle, label: "Non-conformités", path: "/non-conformities" },
  { icon: ClipboardCheck, label: "Audits", path: "/audits" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Brain, label: "Assistant IA", path: "/ai-assistant" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { signOut, user } = useAuth();

  return (
    <aside className={`${collapsed ? "w-20" : "w-64"} bg-card border-r border-border transition-all duration-300 flex flex-col`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          {!collapsed && <h1 className="text-xl font-bold text-primary">SmartQuali</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? "" : "ml-auto"}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {!collapsed && user && (
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border">
        {!collapsed ? (
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
            <div className="text-xs text-muted-foreground text-center">
              © 2025 SmartQuali
            </div>
          </div>
        ) : (
          <div className="p-4 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title="Déconnexion"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
};
