
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";

const MissionHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
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

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">Missions</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Gérez les missions en cours, leur attribution et leur avancement
          </p>
        </div>
        <NewTaskDialog />
      </div>
    </div>
  );
};

export default MissionHeader;
