
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientsHeaderProps {
  onAddClientClick: () => void;
  onTrashClick: () => void;
  isMobile?: boolean;
}

export function ClientsHeader({ onAddClientClick, onTrashClick, isMobile }: ClientsHeaderProps) {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToDashboard}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          {!isMobile && "Tableau de bord"}
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            Clients
          </h1>
          <p className="text-neutral-600 mt-1">
            Gérez vos clients et leurs informations
          </p>
        </div>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={onTrashClick}
          className={`flex items-center gap-2 ${isMobile ? 'flex-1' : ''}`}
        >
          <Trash2 className="h-4 w-4" />
          {isMobile ? "Corbeille" : "Voir la corbeille"}
        </Button>
        <Button
          onClick={onAddClientClick}
          className={`flex items-center gap-2 ${isMobile ? 'flex-1' : ''}`}
        >
          <Plus className="h-4 w-4" />
          {isMobile ? "Ajouter" : "Nouveau client"}
        </Button>
      </div>
    </div>
  );
}
