import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurList } from "@/components/collaborateurs/CollaborateurList";
import { CollaborateurHeader } from "@/components/collaborateurs/CollaborateurHeader";
import { CollaborateurSearch } from "@/components/collaborateurs/CollaborateurSearch";
import { CollaborateurDialog } from "@/components/collaborateurs/CollaborateurDialog";
import { Collaborateur } from "@/types/collaborateur";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
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
      permissions: [],
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
      <CollaborateurHeader onOpenDialog={() => setIsDialogOpen(true)} />

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <CollaborateurSearch
          searchTerm={searchTerm}
          selectedStatut={selectedStatut}
          selectedPoste={selectedPoste}
          isFiltersOpen={isFiltersOpen}
          postes={postes}
          onSearchChange={setSearchTerm}
          onStatutChange={setSelectedStatut}
          onPosteChange={setSelectedPoste}
          onFiltersOpenChange={setIsFiltersOpen}
        />

        <CollaborateurList collaborateurs={filteredCollaborateurs} />
      </div>

      <CollaborateurDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        collaborateur={newCollaborateur}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
