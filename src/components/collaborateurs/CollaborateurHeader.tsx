
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CollaborateurHeaderProps {
  onOpenDialog: () => void;
}

export function CollaborateurHeader({ onOpenDialog }: CollaborateurHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Collaborateurs
          </h1>
          <p className="text-neutral-600 mt-1">
            Gérez votre équipe et leurs accès
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white"
          onClick={onOpenDialog}
        >
          <Plus className="w-4 h-4" />
          Nouveau collaborateur
        </Button>
      </div>
    </header>
  );
}
