
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Collaborateur } from "@/types/collaborateur";
import { getCollaborateurs, createCollaborateur, deleteCollaborateur, updateCollaborateur } from "@/services/collaborateurService";

export const useCollaborateurs = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  const [newCollaborateur, setNewCollaborateur] = useState<Omit<Collaborateur, 'id' | 'created_at' | 'tachesencours'>>({
    nom: "",
    prenom: "",
    email: "",
    poste: "comptable",
    telephone: "",
    niveauetude: "",
    dateentree: "",
    datenaissance: "",
    statut: "actif",
    ville: "",
    quartier: "",
    permissions: []
  });

  const { data: collaborateurs = [], isLoading } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
  });

  const addMutation = useMutation({
    mutationFn: createCollaborateur,
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
        poste: "comptable",
        telephone: "",
        niveauetude: "",
        dateentree: "",
        datenaissance: "",
        statut: "actif",
        ville: "",
        quartier: "",
        permissions: []
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
    onError: (error) => {
      console.error("Erreur lors de la suppression du collaborateur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du collaborateur.",
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, newStatus }: { id: string; newStatus: "actif" | "inactif" }) => 
      updateCollaborateur(id, { statut: newStatus }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["collaborateurs"] });
      const statusText = data.statut === "actif" ? "activé" : "désactivé";
      toast({
        title: `Collaborateur ${statusText}`,
        description: `Le collaborateur a été ${statusText} avec succès.`,
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la modification du statut:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification du statut.",
        variant: "destructive",
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
    addMutation.mutate(newCollaborateur);
  };

  const handleChange = (field: string, value: any) => {
    setNewCollaborateur((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStatusChange = (id: string, newStatus: "actif" | "inactif") => {
    statusMutation.mutate({ id, newStatus });
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedStatut,
    setSelectedStatut,
    selectedPoste,
    setSelectedPoste,
    isFiltersOpen,
    setIsFiltersOpen,
    isDialogOpen,
    setIsDialogOpen,
    userRole,
    navigate,
    newCollaborateur,
    collaborateurs,
    isLoading,
    postes,
    filteredCollaborateurs,
    handleSubmit,
    handleChange,
    handleStatusChange,
    onDelete: (id: string) => deleteMutation.mutate(id),
  };
};
