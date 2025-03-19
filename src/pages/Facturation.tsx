
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Facturation = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center h-64">
        <h1 className="text-2xl font-bold mb-4">Module de facturation</h1>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Le module de facturation a été supprimé du système.
          Veuillez contacter l'administrateur pour plus d'informations.
        </p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Retourner à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default Facturation;
