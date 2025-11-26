import { Home, AlertTriangle, ClipboardCheck, FileText, Brain, Settings, Menu, LogOut, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

const menuItems = [
  { icon: Home, label: "Accueil", path: "/" },
  { icon: AlertTriangle, label: "Non-conformités", path: "/non-conformities" },
  { icon: ClipboardCheck, label: "Audits", path: "/audits" },
  { icon: FileText, label: "Documents", path: "/documents" },
  { icon: Brain, label: "Assistant IA", path: "/ai-assistant" },
  { icon: Settings, label: "Paramètres", path: "/settings" },
];

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { signOut, user } = useAuth();

  const NavItems = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex-1 p-4 space-y-2">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={onClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3.5 sm:py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`
          }
        >
          <item.icon className="h-5 w-5 flex-shrink-0" />
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );

  const UserSection = ({ onClick }: { onClick?: () => void }) => (
    <div className="border-t border-border p-4 space-y-3">
      {user && (
        <p className="text-xs text-muted-foreground truncate px-2">{user.email}</p>
      )}
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => {
          signOut();
          onClick?.();
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>
      <div className="text-xs text-muted-foreground text-center">
        © 2025 SmartQuali
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-primary">SmartQuali</h1>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
              <SheetHeader className="p-6 border-b border-border">
                <SheetTitle className="text-left text-primary">SmartQuali</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col h-[calc(100vh-5rem)]">
                <NavItems onClick={() => setMobileOpen(false)} />
                <UserSection onClick={() => setMobileOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Spacer for mobile header */}
      <div className="md:hidden h-[72px]"></div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary">SmartQuali</h1>
        </div>
        <NavItems />
        <UserSection />
      </aside>
    </>
  );
};
