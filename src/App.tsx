
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Collaborateurs from "./pages/Collaborateurs";
import CollaborateurDetails from "./pages/CollaborateurDetails";
import CollaborateurEdit from "./pages/CollaborateurEdit";
import Clients from "./pages/Clients";
import Gestion from "./pages/Gestion";
import Missions from "./pages/Missions";
import Planning from "./pages/Planning";
import Facturation from "./pages/Facturation";
import Depenses from "./pages/Depenses";
import Parametres from "./pages/Parametres";
import Courrier from "./pages/Courrier";
import Rapports from "./pages/Rapports";

// Configuration optimisée de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <div className="transition-all duration-300">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaborateurs"
                element={
                  <ProtectedRoute>
                    <Collaborateurs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaborateurs/:id"
                element={
                  <ProtectedRoute>
                    <CollaborateurDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/collaborateurs/:id/edit"
                element={
                  <ProtectedRoute>
                    <CollaborateurEdit />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Clients />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gestion"
                element={
                  <ProtectedRoute>
                    <Gestion />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/missions"
                element={
                  <ProtectedRoute>
                    <Missions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/planning"
                element={
                  <ProtectedRoute>
                    <Planning />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facturation"
                element={
                  <ProtectedRoute>
                    <Facturation />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/depenses"
                element={
                  <ProtectedRoute>
                    <Depenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/parametres"
                element={
                  <ProtectedRoute>
                    <Parametres />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courrier"
                element={
                  <ProtectedRoute>
                    <Courrier />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rapports"
                element={
                  <ProtectedRoute>
                    <Rapports />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
