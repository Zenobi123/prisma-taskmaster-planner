
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";

const MissionHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Mission</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les missions et leur suivi
          </p>
        </div>
        <NewTaskDialog />
      </div>
    </>
  );
};

export default MissionHeader;
