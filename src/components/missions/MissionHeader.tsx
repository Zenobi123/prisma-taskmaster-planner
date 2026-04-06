
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";

const MissionHeader = () => {
  return (
    <div className="mb-8">
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
