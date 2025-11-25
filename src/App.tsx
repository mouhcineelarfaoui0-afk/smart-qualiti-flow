import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NonConformities from "./pages/NonConformities";
import Audits from "./pages/Audits";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <div className="flex min-h-screen w-full bg-background">
                    <Sidebar />
                    <main className="flex-1 p-8 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/non-conformities" element={<NonConformities />} />
                        <Route path="/audits" element={<Audits />} />
                        <Route path="/documents" element={<div className="text-center py-20 text-muted-foreground">Module Documents - En construction</div>} />
                        <Route path="/ai-assistant" element={<div className="text-center py-20 text-muted-foreground">Assistant IA - En construction</div>} />
                        <Route path="/settings" element={<div className="text-center py-20 text-muted-foreground">Paramètres - En construction</div>} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
