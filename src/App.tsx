import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import NonConformities from "./pages/NonConformities";
import Audits from "./pages/Audits";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
