
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">
            Collaborateurs
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Gérez votre équipe, leurs postes et leurs accès au système
          </p>
        </div>
        <Button
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white w-full sm:w-auto shrink-0"
          onClick={onOpenDialog}
        >
          <Plus className="w-4 h-4" />
          Nouveau collaborateur
        </Button>
      </div>
    </header>
  );
}
