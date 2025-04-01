
import { useEffect } from "react";
import { useCollaborateurs } from "@/hooks/useCollaborateurs";
import { useToast } from "@/components/ui/use-toast";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";
import { CollaborateurLoading } from "@/components/collaborateurs/CollaborateurLoading";
import { CollaborateurContent } from "@/components/collaborateurs/CollaborateurContent";

export default function Collaborateurs() {
  const { toast } = useToast();
  const {
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
    isLoading,
    postes,
    filteredCollaborateurs,
    handleSubmit,
    handleChange,
    handleStatusChange,
    onDelete,
  } = useCollaborateurs();

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

  // Si l'utilisateur n'est pas administrateur, ne pas rendre le contenu
  if (userRole !== "admin") {
    return <CollaborateurUnauthorized />;
  }

  if (isLoading) {
    return <CollaborateurLoading onOpenDialog={() => setIsDialogOpen(true)} />;
  }

  return (
    <CollaborateurContent
      searchTerm={searchTerm}
      selectedStatut={selectedStatut}
      selectedPoste={selectedPoste}
      isFiltersOpen={isFiltersOpen}
      postes={postes}
      filteredCollaborateurs={filteredCollaborateurs}
      isDialogOpen={isDialogOpen}
      newCollaborateur={newCollaborateur}
      onSearchChange={setSearchTerm}
      onStatutChange={setSelectedStatut}
      onPosteChange={setSelectedPoste}
      onFiltersOpenChange={setIsFiltersOpen}
      onOpenDialogChange={setIsDialogOpen}
      onDelete={onDelete}
      onStatusChange={handleStatusChange}
      onChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}
