
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase, Search, Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMissions, createMission, updateMissionStatus } from "@/services/missionService";
import { getClients } from "@/services/clientService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { Mission, MissionType } from "@/types/mission";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCollaborateur, setSelectedCollaborateur] = useState("");
  const [selectedType, setSelectedType] = useState<MissionType>("DSF");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: missions = [], isLoading: missionsLoading } = useQuery({
    queryKey: ["missions"],
    queryFn: getMissions,
  });

  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const { data: collaborateurs = [] } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  const createMissionMutation = useMutation({
    mutationFn: createMission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast({
        title: "Mission créée",
        description: "La mission a été créée avec succès.",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la mission.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateMissionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["missions"] });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la mission a été mis à jour avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedClient("");
    setSelectedCollaborateur("");
    setSelectedType("DSF");
    setSelectedDate(undefined);
  };

  const handleCreateMission = () => {
    if (!selectedClient || !selectedCollaborateur || !selectedDate) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    createMissionMutation.mutate({
      client_id: selectedClient,
      collaborateur_id: selectedCollaborateur,
      type: selectedType,
      date_echeance: format(selectedDate, "yyyy-MM-dd"),
      status: "en_attente",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "en_cours":
        return <Badge variant="secondary">En cours</Badge>;
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "terminee":
        return <Badge variant="success">Terminée</Badge>;
      default:
        return null;
    }
  };

  const filteredMissions = missions.filter((mission: any) => {
    const matchesSearch =
      mission.clients?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.clients?.raisonsociale?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.collaborateurs?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.collaborateurs?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getMissionTypeLabel = (type: string) => {
    switch (type) {
      case "DSF":
        return "DSF";
      case "Declaration_Mensuelle_Fiscale":
        return "Déclaration Mensuelle Fiscale";
      case "Declaration_Mensuelle_Sociale":
        return "Déclaration Mensuelle Sociale";
      case "Conseil":
        return "Conseil";
      default:
        return type;
    }
  };

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client: any) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.type === "morale" ? client.raisonsociale : client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de mission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DSF">DSF</SelectItem>
                      <SelectItem value="Declaration_Mensuelle_Fiscale">
                        Déclaration Mensuelle Fiscale
                      </SelectItem>
                      <SelectItem value="Declaration_Mensuelle_Sociale">
                        Déclaration Mensuelle Sociale
                      </SelectItem>
                      <SelectItem value="Conseil">Conseil</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedCollaborateur} onValueChange={setSelectedCollaborateur}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assigné à" />
                    </SelectTrigger>
                    <SelectContent>
                      {collaborateurs.map((collab: any) => (
                        <SelectItem key={collab.id} value={collab.id}>
                          {`${collab.prenom} ${collab.nom}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date d'échéance</label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      locale={fr}
                    />
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={handleCreateMission}
                    disabled={createMissionMutation.isPending}
                  >
                    {createMissionMutation.isPending ? "Création..." : "Créer la mission"}
                  </Button>
                </div>
              </div>
            </ScrollArea>
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
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="en_cours">En cours</SelectItem>
            <SelectItem value="terminee">Terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredMissions.map((mission: any) => (
          <div
            key={mission.id}
            className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {getMissionTypeLabel(mission.type)}
                </h3>
                <p className="text-gray-600">
                  {mission.clients.type === "morale"
                    ? mission.clients.raisonsociale
                    : mission.clients.nom}
                </p>
                <p className="text-sm text-gray-500">
                  Assigné à: {mission.collaborateurs.prenom} {mission.collaborateurs.nom}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-sm text-gray-500">
                    Échéance: {format(new Date(mission.date_echeance), "dd/MM/yyyy")}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Select
                  value={mission.status}
                  onValueChange={(newStatus) => updateStatusMutation.mutate({ missionId: mission.id, status: newStatus })}
                >
                  <SelectTrigger className="w-[140px]">
                    {getStatusBadge(mission.status)}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                  </SelectContent>
                </Select>
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

