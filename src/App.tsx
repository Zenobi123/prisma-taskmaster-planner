import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Collaborateurs from "./pages/Collaborateurs";
import Clients from "./pages/Clients";
import Missions from "./pages/Missions";
import Planning from "./pages/Planning";
import Temps from "./pages/Temps";
import Rapports from "./pages/Rapports";
import Facturation from "./pages/Facturation";
import Depenses from "./pages/Depenses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/collaborateurs" element={<Collaborateurs />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/temps" element={<Temps />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/facturation" element={<Facturation />} />
          <Route path="/depenses" element={<Depenses />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;