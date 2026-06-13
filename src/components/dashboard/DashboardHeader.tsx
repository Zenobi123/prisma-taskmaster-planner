
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import NewTaskDialog from "./NewTaskDialog";

interface DashboardHeaderProps {
  lastRefresh: Date;
  onRefresh: () => void;
}

const DashboardHeader = ({ lastRefresh, onRefresh }: DashboardHeaderProps) => {
  // Handle hidden refresh functionality
  const handleHiddenRefresh = () => {
    onRefresh();
  };

  return (
    <header className="bg-white border-b border-neutral-200 px-4 py-3 sm:px-6 md:px-8 sm:py-4 md:py-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-neutral-800 truncate">
            Tableau de bord
          </h1>
          <p className="text-neutral-600 mt-0.5 text-sm hidden sm:block">
            Bienvenue sur votre espace de gestion
          </p>
          <div className="mt-1">
            <span
              className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors"
              onClick={handleHiddenRefresh}
              title="Dernière actualisation"
            >
              Màj : {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0 ml-2">
          <NewTaskDialog />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
