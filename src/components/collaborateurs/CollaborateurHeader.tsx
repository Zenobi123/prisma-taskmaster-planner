
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

interface CollaborateurHeaderProps {
  onOpenDialog: () => void;
}

export function CollaborateurHeader({ onOpenDialog }: CollaborateurHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <BackButton />
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
