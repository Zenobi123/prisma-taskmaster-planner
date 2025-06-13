
import { Dialog } from "@/components/ui/dialog";
import { useClientsPage } from "./hooks/useClientsPage";
import { ClientsHeader } from "./components/ClientsHeader";
import { ClientsContent } from "./components/ClientsContent";
import { ClientDialogs } from "./components/ClientDialogs";
import { LoadingState } from "./components/LoadingState";
import { ClientTrash } from "@/components/clients/ClientTrash";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ClientsPage() {
  const {
    clients,
    allClients,
    isLoading,
    isDataReady,
    error,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    selectedSecteur,
    setSelectedSecteur,
    showArchived,
    setShowArchived,
    showTrash,
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
    handleDelete,
    handleTrashClick,
    handleCloseTrash,
    handleMultiCriteriaChange,
    toast
  } = useClientsPage();
  
  const isMobile = useIsMobile();

  // Error handling
  useEffect(() => {
    if (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des clients",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading || !isDataReady) {
    return <LoadingState isMobile={isMobile} />;
  }

  // Show trash view
  if (showTrash) {
    return (
      <div className={isMobile ? "p-3 sm:p-4" : "p-8"}>
        <ClientTrash onClose={handleCloseTrash} />
      </div>
    );
  }

  return (
    <div className={isMobile ? "p-3 sm:p-4" : "p-8"}>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <ClientsHeader 
          onAddClientClick={() => setIsDialogOpen(true)}
          onTrashClick={handleTrashClick}
          isMobile={isMobile}
        />

        {isMobile ? (
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <ClientsContent
              clients={clients}
              allClients={allClients}
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
              onDelete={handleDelete}
              onMultiCriteriaChange={handleMultiCriteriaChange}
              isMobile={isMobile}
            />
          </ScrollArea>
        ) : (
          <ClientsContent
            clients={clients}
            allClients={allClients}
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
            onDelete={handleDelete}
            onMultiCriteriaChange={handleMultiCriteriaChange}
            isMobile={isMobile}
          />
        )}

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
