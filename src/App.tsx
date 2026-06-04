import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAutoUpdate } from "./hooks/useAutoUpdate";
import { ExerciceProvider } from "@/contexts/ExerciceContext";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

// Lazy-load des pages pour réduire le bundle initial et accélérer le 1er rendu
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Collaborateurs = lazy(() => import("./pages/Collaborateurs"));
const CollaborateurDetails = lazy(() => import("./pages/CollaborateurDetails"));
const CollaborateurEdit = lazy(() => import("./pages/CollaborateurEdit"));
const Clients = lazy(() => import("./pages/Clients"));
const Gestion = lazy(() => import("./pages/Gestion"));
const Missions = lazy(() => import("./pages/Missions"));
const Planning = lazy(() => import("./pages/Planning"));
const Facturation = lazy(() => import("./pages/Facturation"));
const Parametres = lazy(() => import("./pages/Parametres"));
const Courrier = lazy(() => import("./pages/Courrier"));
const Rapports = lazy(() => import("./pages/Rapports"));
const Aide = lazy(() => import("./pages/Aide"));

// Configuration optimisée de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

function PrivateRoute({ children, session }: { children: React.ReactNode; session: Session | null }) {
  if (session === null) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AutoUpdateListener() {
  useAutoUpdate();
  return null;
}

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const App = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveInitialSession = async () => {
      try {
        const timeoutPromise = new Promise<null>((resolve) => {
          window.setTimeout(() => resolve(null), 5000);
        });

        const sessionPromise = supabase.auth
          .getSession()
          .then(({ data }) => data.session ?? null)
          .catch((error) => {
            console.error("Erreur lors de la récupération de la session:", error);
            return null;
          });

        const initialSession = await Promise.race([sessionPromise, timeoutPromise]);

        if (isMounted) {
          setSession(initialSession);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Échec de l'initialisation d'authentification:", error);
        if (isMounted) {
          setSession(null);
          setIsLoading(false);
        }
      }
    };

    resolveInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSession(session);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <RouteFallback />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AutoUpdateListener />
      <TooltipProvider>
        <div className="transition-all duration-300">
          <Toaster />
          <Sonner />
          <ExerciceProvider>
            <BrowserRouter>
              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
                  <Route path="/" element={<PrivateRoute session={session}><Index /></PrivateRoute>} />
                  <Route path="/collaborateurs" element={<PrivateRoute session={session}><Collaborateurs /></PrivateRoute>} />
                  <Route path="/collaborateurs/:id" element={<PrivateRoute session={session}><CollaborateurDetails /></PrivateRoute>} />
                  <Route path="/collaborateurs/:id/edit" element={<PrivateRoute session={session}><CollaborateurEdit /></PrivateRoute>} />
                  <Route path="/clients" element={<PrivateRoute session={session}><Clients /></PrivateRoute>} />
                  <Route path="/gestion" element={<PrivateRoute session={session}><Gestion /></PrivateRoute>} />
                  <Route path="/missions" element={<PrivateRoute session={session}><Missions /></PrivateRoute>} />
                  <Route path="/planning" element={<PrivateRoute session={session}><Planning /></PrivateRoute>} />
                  <Route path="/facturation" element={<PrivateRoute session={session}><Facturation /></PrivateRoute>} />
                  <Route path="/parametres" element={<PrivateRoute session={session}><Parametres /></PrivateRoute>} />
                  <Route path="/courrier" element={<PrivateRoute session={session}><Courrier /></PrivateRoute>} />
                  <Route path="/rapports" element={<PrivateRoute session={session}><Rapports /></PrivateRoute>} />
                  <Route path="/aide" element={<PrivateRoute session={session}><Aide /></PrivateRoute>} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </ExerciceProvider>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
