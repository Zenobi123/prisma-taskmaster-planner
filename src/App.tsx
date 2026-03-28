import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
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

function PrivateRoute({ children, session }: { children: React.ReactNode; session: Session | null }) {
  if (session === null) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer la session au chargement
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Écouter les changements de session (connexion, déconnexion, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        // Session cleared - no localStorage cleanup needed
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="transition-all duration-300">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute session={session}>
                    <Index />
                  </PrivateRoute>
                }
              />
              <Route
                path="/collaborateurs"
                element={
                  <PrivateRoute session={session}>
                    <Collaborateurs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/collaborateurs/:id"
                element={
                  <PrivateRoute session={session}>
                    <CollaborateurDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="/collaborateurs/:id/edit"
                element={
                  <PrivateRoute session={session}>
                    <CollaborateurEdit />
                  </PrivateRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <PrivateRoute session={session}>
                    <Clients />
                  </PrivateRoute>
                }
              />
              <Route
                path="/gestion"
                element={
                  <PrivateRoute session={session}>
                    <Gestion />
                  </PrivateRoute>
                }
              />
              <Route
                path="/missions"
                element={
                  <PrivateRoute session={session}>
                    <Missions />
                  </PrivateRoute>
                }
              />
              <Route
                path="/planning"
                element={
                  <PrivateRoute session={session}>
                    <Planning />
                  </PrivateRoute>
                }
              />
              <Route
                path="/facturation"
                element={
                  <PrivateRoute session={session}>
                    <Facturation />
                  </PrivateRoute>
                }
              />
              <Route
                path="/depenses"
                element={
                  <PrivateRoute session={session}>
                    <Depenses />
                  </PrivateRoute>
                }
              />
              <Route
                path="/parametres"
                element={
                  <PrivateRoute session={session}>
                    <Parametres />
                  </PrivateRoute>
                }
              />
              <Route
                path="/courrier"
                element={
                  <PrivateRoute session={session}>
                    <Courrier />
                  </PrivateRoute>
                }
              />
              <Route
                path="/rapports"
                element={
                  <PrivateRoute session={session}>
                    <Rapports />
                  </PrivateRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
