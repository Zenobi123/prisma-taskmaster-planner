import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAppUpdates } from "@/hooks/useAppUpdates";
import { UpdateNotification } from "@/components/updates/UpdateNotification";
import Index from "./pages/Index";
import Login from "./pages/Login";
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { updateInfo, isApplyingUpdate, applyUpdate, dismissUpdate } = useAppUpdates();

  return (
    <div className="transition-all duration-300">
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborateurs"
            element={
              <PrivateRoute>
                <Collaborateurs />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborateurs/:id"
            element={
              <PrivateRoute>
                <CollaborateurDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/collaborateurs/:id/edit"
            element={
              <PrivateRoute>
                <CollaborateurEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <Clients />
              </PrivateRoute>
            }
          />
          <Route
            path="/gestion"
            element={
              <PrivateRoute>
                <Gestion />
              </PrivateRoute>
            }
          />
          <Route
            path="/missions"
            element={
              <PrivateRoute>
                <Missions />
              </PrivateRoute>
            }
          />
          <Route
            path="/planning"
            element={
              <PrivateRoute>
                <Planning />
              </PrivateRoute>
            }
          />
          <Route
            path="/facturation"
            element={
              <PrivateRoute>
                <Facturation />
              </PrivateRoute>
            }
          />
          <Route
            path="/depenses"
            element={
              <PrivateRoute>
                <Depenses />
              </PrivateRoute>
            }
          />
          <Route
            path="/parametres"
            element={
              <PrivateRoute>
                <Parametres />
              </PrivateRoute>
            }
          />
          <Route
            path="/courrier"
            element={
              <PrivateRoute>
                <Courrier />
              </PrivateRoute>
            }
          />
          <Route
            path="/rapports"
            element={
              <PrivateRoute>
                <Rapports />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      
      {updateInfo.hasUpdate && (
        <UpdateNotification
          version={updateInfo.version}
          onApplyUpdate={applyUpdate}
          onDismiss={dismissUpdate}
          isApplying={isApplyingUpdate}
        />
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
