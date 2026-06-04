
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewMissionDialog from "@/components/missions/NewMissionDialog";

const MissionHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 sm:gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">Missions</h1>
          <p className="text-neutral-500 mt-1 text-xs sm:text-sm hidden sm:block">
            Gérez les missions en cours, leur attribution et leur avancement
          </p>
        </div>
        <NewMissionDialog />
      </div>
    </div>
  );
};

export default MissionHeader;
