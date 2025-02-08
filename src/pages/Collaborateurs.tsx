
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurList } from "@/components/collaborateurs/CollaborateurList";
import { CollaborateurHeader } from "@/components/collaborateurs/CollaborateurHeader";
import { CollaborateurSearch } from "@/components/collaborateurs/CollaborateurSearch";
import { CollaborateurDialog } from "@/components/collaborateurs/CollaborateurDialog";
import { Collaborateur, CollaborateurRole } from "@/types/collaborateur";
import { getCollaborateurs, addCollaborateur, deleteCollaborateur } from "@/services/collaborateurService";

export default function Collaborateurs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newCollaborateur, setNewCollaborateur] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "" as CollaborateurRole,
    telephone: "",
    niveauetude: "",
    dateentree: "",
    datenaissance: "",
    statut: "",
    ville: "",
    quartier: "",
  });

  const { data: collaborateurs = [], isLoading } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  const addMutation = useMutation({
    mutationFn: addCollaborateur,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
      toast({
        title: "Collaborateur ajouté",
        description: "Le nouveau collaborateur a été ajouté avec succès.",
      });
      setIsDialogOpen(false);
      setNewCollaborateur({
        nom: "",
        prenom: "",
        email: "",
        poste: "" as CollaborateurRole,
        telephone: "",
        niveauetude: "",
        dateentree: "",
        datenaissance: "",
        statut: "",
        ville: "",
        quartier: "",
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout du collaborateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout du collaborateur.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollaborateur,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
      toast({
        title: "Collaborateur supprimé",
        description: "Le collaborateur a été supprimé avec succès.",
      });
    },
  });

  const postes = Array.from(
    new Set(collaborateurs.map((collab) => collab.poste))
  );

  const filteredCollaborateurs = collaborateurs.filter((collab) => {
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
    if (!newCollaborateur.poste) {
      toast({
        title: "Erreur",
        description: "Le poste est obligatoire",
        variant: "destructive",
      });
      return;
    }
    addMutation.mutate(newCollaborateur);
  };

  const handleChange = (field: string, value: string) => {
    setNewCollaborateur((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <CollaborateurHeader onOpenDialog={() => setIsDialogOpen(true)} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

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

        <CollaborateurList 
          collaborateurs={filteredCollaborateurs}
          onDelete={(id) => deleteMutation.mutate(id)} 
        />
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
