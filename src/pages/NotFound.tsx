import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Home, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  return (
    <PageLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4 px-4">
        <AlertTriangle className="h-12 w-12 text-primary" />
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="text-lg text-gray-700">Page introuvable</p>
        <p className="text-sm text-muted-foreground max-w-md break-all">
          L'adresse <span className="font-mono">{location.pathname}</span> n'existe pas
          ou n'est plus disponible.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </PageLayout>
  );
};

export default NotFound;
