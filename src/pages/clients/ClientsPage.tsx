
import { Dialog } from "@/components/ui/dialog";
import { useClientsPage } from "./hooks/useClientsPage";
import { ClientsHeader } from "./components/ClientsHeader";
import { ClientsContent } from "./components/ClientsContent";
import { ClientDialogs } from "./components/ClientDialogs";
import { LoadingState } from "./components/LoadingState";

export default function ClientsPage() {
  const {
    clients,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    isDialogOpen,
    setIsDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isViewDialogOpen,
    setIsViewDialogOpen,
    newClientType,
    setNewClientType,
    selectedClient,
    addMutation,
    updateMutation,
    handleView,
    handleEdit,
    handleArchive,
    handleRestore,
    toast
  } = useClientsPage();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer la liste des clients",
      variant: "destructive",
    });
  }

  return (
    <div className="p-8">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ClientsHeader onAddClientClick={() => setIsDialogOpen(true)} />

        <ClientsContent
          clients={clients}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          selectedSecteur={selectedSecteur}
          onSecteurChange={setSelectedSecteur}
          showArchived={showArchived}
          onShowArchivedChange={setShowArchived}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onRestore={handleRestore}
        />

        <ClientDialogs
          isAddDialogOpen={isDialogOpen}
          setIsAddDialogOpen={setIsDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
          isViewDialogOpen={isViewDialogOpen}
          setIsViewDialogOpen={setIsViewDialogOpen}
          selectedClient={selectedClient}
          newClientType={newClientType}
          onNewClientTypeChange={setNewClientType}
          onAddClient={(clientData) => addMutation.mutate(clientData)}
          onUpdateClient={(clientData) => {
            if (selectedClient) {
              updateMutation.mutate({
                id: selectedClient.id,
                updates: clientData,
              });
            }
          }}
        />
      </Dialog>
    </div>
  );
}
