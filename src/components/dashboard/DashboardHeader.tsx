
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import NewTaskDialog from "./NewTaskDialog";

interface DashboardHeaderProps {
  lastRefresh: Date;
  onRefresh: () => void;
}

const DashboardHeader = ({ lastRefresh, onRefresh }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b border-neutral-200 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-800">
            Tableau de bord
          </h1>
          <p className="text-neutral-600 mt-1">
            Bienvenue sur votre espace de gestion
          </p>
        </div>
        <div className="flex gap-2">
          {/* Bouton d'actualisation supprimé car l'actualisation est automatique */}
          <NewTaskDialog />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
