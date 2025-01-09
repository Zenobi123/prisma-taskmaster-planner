import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle mission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer une nouvelle mission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Input placeholder="Titre de la mission" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">SARL TechPro</SelectItem>
                    <SelectItem value="client2">SAS WebDev</SelectItem>
                    <SelectItem value="client3">EURL ConseilPlus</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Assigné à" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collab1">Sophie Martin</SelectItem>
                    <SelectItem value="collab2">Pierre Dubois</SelectItem>
                    <SelectItem value="collab3">Marie Lambert</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de début</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="planifiee">Planifiée</SelectItem>
            <SelectItem value="terminee">Terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
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
        ))}
      </div>
    </div>
  );
};

export default Missions;