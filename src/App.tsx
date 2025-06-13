
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import Facturation from "./pages/Facturation";
import Gestion from "./pages/Gestion";
import Collaborateurs from "./pages/Collaborateurs";
import CollaborateurDetails from "./pages/CollaborateurDetails";
import CollaborateurEdit from "./pages/CollaborateurEdit";
import Planning from "./pages/Planning";
import Rapports from "./pages/Rapports";
import Courrier from "./pages/Courrier";
import Parametres from "./pages/Parametres";
import Missions from "./pages/Missions";
import Temps from "./pages/Temps";
import Depenses from "./pages/Depenses";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/facturation" element={<Facturation />} />
            <Route path="/gestion" element={<Gestion />} />
            <Route path="/collaborateurs" element={<Collaborateurs />} />
            <Route path="/collaborateurs/:id" element={<CollaborateurDetails />} />
            <Route path="/collaborateurs/:id/edit" element={<CollaborateurEdit />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/rapports" element={<Rapports />} />
            <Route path="/courrier" element={<Courrier />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/temps" element={<Temps />} />
            <Route path="/depenses" element={<Depenses />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
