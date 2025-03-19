
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import Index from "@/pages/Index";
import Clients from "@/pages/Clients";
import Collaborateurs from "@/pages/Collaborateurs";
import CollaborateurDetails from "@/pages/CollaborateurDetails";
import CollaborateurEdit from "@/pages/CollaborateurEdit";
import Depenses from "@/pages/Depenses";
import Facturation from "@/pages/Facturation";
import FactureDetails from "@/pages/FactureDetails";
import FactureEdit from "@/pages/FactureEdit";
import Gestion from "@/pages/Gestion";
import Login from "@/pages/Login";
import Missions from "@/pages/Missions";
import Planning from "@/pages/Planning";
import Rapports from "@/pages/Rapports";
import Temps from "@/pages/Temps";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/collaborateurs" element={<Collaborateurs />} />
          <Route path="/collaborateurs/:id" element={<CollaborateurDetails />} />
          <Route path="/collaborateurs/:id/edit" element={<CollaborateurEdit />} />
          <Route path="/depenses" element={<Depenses />} />
          <Route path="/facturation" element={<Facturation />} />
          <Route path="/facturation/:id" element={<FactureDetails />} />
          <Route path="/facturation/:id/edit" element={<FactureEdit />} />
          <Route path="/gestion" element={<Gestion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/temps" element={<Temps />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
