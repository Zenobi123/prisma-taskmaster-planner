
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MissionCardProps {
  mission: {
    id: number;
    title: string;
    client: string;
    assignedTo: string;
    status: string;
    startDate: string;
    endDate: string;
  };
}

const MissionCard = ({ mission }: MissionCardProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>;
      case "planifiee":
        return <Badge variant="outline">Planifiée</Badge>;
      case "terminee":
        return <Badge variant="success">Terminée</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{mission.title}</h3>
          <p className="text-gray-600">{mission.client}</p>
          <p className="text-sm text-gray-500">Assigné à: {mission.assignedTo}</p>
          <div className="flex gap-2 mt-2">
            <span className="text-sm text-gray-500">
              {mission.startDate} - {mission.endDate}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusBadge(mission.status)}
          <Button variant="outline" size="sm">
            <Briefcase className="mr-2 h-4 w-4" />
            Voir détails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionCard;

