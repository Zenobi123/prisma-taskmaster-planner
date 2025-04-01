
import { useCollaborateurs } from "@/hooks/useCollaborateurs";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";
import { CollaborateurLoading } from "@/components/collaborateurs/CollaborateurLoading";
import { CollaborateurContent } from "@/components/collaborateurs/CollaborateurContent";
import { useAuthorization } from "@/hooks/useAuthorization";

export default function Collaborateurs() {
  // Vérifier les autorisations d'accès
  const { isAuthorized } = useAuthorization(
    ["admin"], 
    "collaborateurs",
    { showToast: true }
  );

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
    newCollaborateur,
    isLoading,
    postes,
    filteredCollaborateurs,
    handleSubmit,
    handleChange,
    handleStatusChange,
    onDelete,
  } = useCollaborateurs();

  // Si l'utilisateur n'est pas administrateur, ne pas rendre le contenu
  if (!isAuthorized) {
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
