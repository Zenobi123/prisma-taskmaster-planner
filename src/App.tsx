
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Clients from "./pages/Clients";
import Collaborateurs from "./pages/Collaborateurs";
import CollaborateurDetails from "./pages/CollaborateurDetails";
import CollaborateurEdit from "./pages/CollaborateurEdit";
import Facturation from "./pages/Facturation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Missions from "./pages/Missions";
import Planning from "./pages/Planning";
import Temps from "./pages/Temps";
import Depenses from "./pages/Depenses";
import Rapports from "./pages/Rapports";
import Gestion from "./pages/Gestion";
import UserAdmin from "./pages/UserAdmin";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  // Vérifier l'authentification au chargement de l'application
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(isAuth);
    };

    window.addEventListener("storage", checkAuth);
    checkAuth();

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Index /> : <Navigate to="/login" />}
        />
        <Route
          path="/clients"
          element={isAuthenticated ? <Clients /> : <Navigate to="/login" />}
        />
        <Route
          path="/collaborateurs"
          element={isAuthenticated ? <Collaborateurs /> : <Navigate to="/login" />}
        />
        <Route
          path="/collaborateurs/:id"
          element={isAuthenticated ? <CollaborateurDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/collaborateurs/:id/edit"
          element={isAuthenticated ? <CollaborateurEdit /> : <Navigate to="/login" />}
        />
        <Route
          path="/facturation"
          element={isAuthenticated ? <Facturation /> : <Navigate to="/login" />}
        />
        <Route
          path="/missions"
          element={isAuthenticated ? <Missions /> : <Navigate to="/login" />}
        />
        <Route
          path="/planning"
          element={isAuthenticated ? <Planning /> : <Navigate to="/login" />}
        />
        <Route
          path="/temps"
          element={isAuthenticated ? <Temps /> : <Navigate to="/login" />}
        />
        <Route
          path="/depenses"
          element={isAuthenticated ? <Depenses /> : <Navigate to="/login" />}
        />
        <Route
          path="/rapports"
          element={isAuthenticated ? <Rapports /> : <Navigate to="/login" />}
        />
        <Route
          path="/gestion"
          element={isAuthenticated ? <Gestion /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={isAuthenticated ? <UserAdmin /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
