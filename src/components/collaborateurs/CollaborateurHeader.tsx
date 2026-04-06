
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CollaborateurHeaderProps {
  onOpenDialog: () => void;
}

export function CollaborateurHeader({ onOpenDialog }: CollaborateurHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">
            Collaborateurs
          </h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Gérez votre équipe, leurs postes et leurs accès au système
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
