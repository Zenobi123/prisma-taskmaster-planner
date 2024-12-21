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
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurList } from "@/components/collaborateurs/CollaborateurList";
import { CollaborateurForm } from "@/components/collaborateurs/CollaborateurForm";

interface Collaborateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  dateEntree: string;
  statut: "actif" | "inactif";
  tachesEnCours: number;
}

const collaborateursData: Collaborateur[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@cabinet.fr",
    poste: "Expert Comptable",
    dateEntree: "2023-01-01",
    statut: "actif",
    tachesEnCours: 5,
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Pierre",
    email: "pierre.martin@cabinet.fr",
    poste: "Comptable",
    dateEntree: "2023-03-15",
    statut: "actif",
    tachesEnCours: 3,
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@cabinet.fr",
    poste: "Assistante comptable",
    dateEntree: "2023-06-01",
    statut: "actif",
    tachesEnCours: 4,
  },
];

export default function Collaborateurs() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredCollaborateurs = collaborateursData.filter(
    (collab) =>
      collab.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <DialogContent className="bg-white">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau collaborateur</DialogTitle>
                <DialogDescription>
                  Remplissez les informations du nouveau collaborateur ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <CollaborateurForm
                collaborateur={newCollaborateur}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
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
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>

        <CollaborateurList collaborateurs={filteredCollaborateurs} />
      </div>
    </div>
  );
}