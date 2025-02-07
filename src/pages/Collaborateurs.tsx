import { useState } from "react";
import { Plus, Search, Filter, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurList } from "@/components/collaborateurs/CollaborateurList";
import { CollaborateurForm } from "@/components/collaborateurs/CollaborateurForm";
import { CollaborateurRole, CollaborateurPermissions, Collaborateur } from "@/types/collaborateur";

const collaborateursData: Collaborateur[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@cabinet.fr",
    poste: "expert-comptable",
    dateEntree: "2023-01-01",
    statut: "actif",
    tachesEnCours: 5,
    permissions: [
      { module: "clients", niveau: "administration" },
      { module: "taches", niveau: "administration" },
      { module: "facturation", niveau: "administration" },
    ],
    telephone: "0123456789",
    niveauEtude: "Bac+5",
    dateNaissance: "1990-01-01",
    ville: "Paris",
    quartier: "Bastille",
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Pierre",
    email: "pierre.martin@cabinet.fr",
    poste: "assistant",
    dateEntree: "2023-03-15",
    statut: "actif",
    tachesEnCours: 3,
    permissions: [
      { module: "clients", niveau: "lecture" },
      { module: "taches", niveau: "ecriture" },
    ],
    telephone: "0123456789",
    niveauEtude: "Bac+3",
    dateNaissance: "1995-05-15",
    ville: "Paris",
    quartier: "République",
  },
];

export default function Collaborateurs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCollaborateur, setNewCollaborateur] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    telephone: "",
    niveauEtude: "",
    dateEntree: "",
    dateNaissance: "",
    statut: "",
    ville: "",
    quartier: "",
  });

  const postes = Array.from(
    new Set(collaborateursData.map((collab) => collab.poste))
  );

  const filteredCollaborateurs = collaborateursData.filter((collab) => {
    const matchesSearch =
      collab.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatut =
      selectedStatut === "all" || collab.statut === selectedStatut;

    const matchesPoste =
      selectedPoste === "all" || collab.poste === selectedPoste;

    return matchesSearch && matchesStatut && matchesPoste;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newCollaborateurData = {
      ...newCollaborateur,
      id: String(Date.now()),
      statut: "actif",
      tachesEnCours: 0,
      permissions: [], // Les permissions seront ajoutées selon les cases cochées
    };
    
    toast({
      title: "Collaborateur ajouté",
      description: "Le nouveau collaborateur a été ajouté avec succès.",
    });
    setIsDialogOpen(false);
    setNewCollaborateur({
      nom: "",
      prenom: "",
      email: "",
      poste: "",
      telephone: "",
      niveauEtude: "",
      dateEntree: "",
      dateNaissance: "",
      statut: "",
      ville: "",
      quartier: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setNewCollaborateur((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="p-8">
      <header className="mb-8">
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Collaborateurs
            </h1>
            <p className="text-neutral-600 mt-1">
              Gérez votre équipe et leurs accès
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white">
                <Plus className="w-4 h-4" />
                Nouveau collaborateur
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau collaborateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau collaborateur ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <CollaborateurForm
                  collaborateur={newCollaborateur}
                  onChange={handleChange}
                  onSubmit={handleSubmit}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Rechercher un collaborateur..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              >
                <Filter className="w-4 h-4" />
                Filtres
                {(selectedStatut !== "all" || selectedPoste !== "all") && (
                  <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {Number(selectedStatut !== "all") + Number(selectedPoste !== "all")}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select
                    value={selectedStatut}
                    onValueChange={setSelectedStatut}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poste</label>
                  <Select
                    value={selectedPoste}
                    onValueChange={setSelectedPoste}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un poste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      {postes.map((poste) => (
                        <SelectItem key={poste} value={poste}>
                          {poste}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <CollaborateurList collaborateurs={filteredCollaborateurs} />
      </div>
    </div>
  );
}
