
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurList } from "@/components/collaborateurs/CollaborateurList";
import { CollaborateurHeader } from "@/components/collaborateurs/CollaborateurHeader";
import { CollaborateurSearch } from "@/components/collaborateurs/CollaborateurSearch";
import { CollaborateurDialog } from "@/components/collaborateurs/CollaborateurDialog";
import { Collaborateur, CollaborateurPermissions } from "@/types/collaborateur";
import { getCollaborateurs, addCollaborateur, deleteCollaborateur, updateCollaborateur } from "@/services/collaborateurService";
import Sidebar from "@/components/dashboard/Sidebar";
import PageLayout from "@/components/layout/PageLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Collaborateurs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatut, setSelectedStatut] = useState<string>("all");
  const [selectedPoste, setSelectedPoste] = useState<string>("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");

  // Vérifier les autorisations d'accès
  useEffect(() => {
    if (userRole !== "admin") {
      toast({
        variant: "destructive",
        title: "Accès non autorisé",
        description: "Seuls les administrateurs peuvent accéder à la gestion des collaborateurs."
      });
      navigate("/");
    }
  }, [userRole, navigate, toast]);

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

  // Si l'utilisateur n'est pas administrateur, ne pas rendre le contenu
  if (userRole !== "admin") {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <PageLayout>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Accès non autorisé</AlertTitle>
            <AlertDescription>
              Seuls les administrateurs peuvent accéder à la gestion des collaborateurs.
            </AlertDescription>
          </Alert>
        </PageLayout>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <PageLayout>
          <div className="p-8">
            <CollaborateurHeader onOpenDialog={() => setIsDialogOpen(true)} />
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </PageLayout>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <PageLayout>
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
              onStatusChange={handleStatusChange}
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
      </PageLayout>
    </div>
  );
}
