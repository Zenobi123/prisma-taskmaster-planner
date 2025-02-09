
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MissionCard from "@/components/missions/MissionCard";
import MissionFilters from "@/components/missions/MissionFilters";
import NewMissionDialog from "@/components/missions/NewMissionDialog";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Données mockées pour l'exemple
  const missions = [
    {
      id: 1,
      title: "Audit comptable annuel",
      client: "SARL TechPro",
      assignedTo: "Sophie Martin",
      status: "en_cours",
      startDate: "2024-02-01",
      endDate: "2024-02-15",
    },
    {
      id: 2,
      title: "Déclaration TVA",
      client: "SAS WebDev",
      assignedTo: "Pierre Dubois",
      status: "planifiee",
      startDate: "2024-02-20",
      endDate: "2024-02-22",
    },
    {
      id: 3,
      title: "Bilan semestriel",
      client: "EURL ConseilPlus",
      assignedTo: "Marie Lambert",
      status: "terminee",
      startDate: "2024-01-15",
      endDate: "2024-01-30",
    },
  ];

  const filteredMissions = missions.filter((mission) => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto p-6">
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
          <h1 className="text-2xl font-bold">Missions</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les missions et leur suivi
          </p>
        </div>
        <NewMissionDialog />
      </div>

      <MissionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="grid gap-4">
        {filteredMissions.map((mission) => (
          <MissionCard key={mission.id} mission={mission} />
        ))}
      </div>
    </div>
  );
};

export default Missions;

