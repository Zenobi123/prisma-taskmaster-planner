
import { Client, ClientType } from "@/types/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientView } from "@/components/clients/ClientView";

interface ClientDialogsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isViewDialogOpen: boolean;
  setIsViewDialogOpen: (open: boolean) => void;
  selectedClient: Client | null;
  newClientType: ClientType;
  onNewClientTypeChange: (type: ClientType) => void;
  onAddClient: (clientData: any) => void;
  onUpdateClient: (clientData: any) => void;
}

export function ClientDialogs({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isEditDialogOpen,
  setIsEditDialogOpen,
  isViewDialogOpen,
  setIsViewDialogOpen,
  selectedClient,
  newClientType,
  onNewClientTypeChange,
  onAddClient,
  onUpdateClient,
}: ClientDialogsProps) {
  if (!selectedClient && !isAddDialogOpen) return null;

  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white overflow-hidden max-w-2xl max-h-[90vh] w-[90vw]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <ClientForm
              type={newClientType}
              onTypeChange={onNewClientTypeChange}
              onSubmit={(clientData) => {
                console.log("Données du client à ajouter:", clientData);
                onAddClient(clientData);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {selectedClient && (
        <>
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="bg-white overflow-hidden max-w-2xl max-h-[90vh] w-[90vw]">
              <DialogHeader>
                <DialogTitle>Détails du client</DialogTitle>
                <DialogDescription>
                  Informations détaillées sur le client
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[calc(90vh-120px)] pr-4 mt-4">
                <div className="p-1">
                  <ClientView client={selectedClient} />
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-white overflow-hidden max-w-2xl max-h-[90vh] w-[90vw]">
              <DialogHeader>
                <DialogTitle>Modifier le client</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du client ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <ClientForm
                  type={selectedClient.type}
                  initialData={selectedClient}
                  onSubmit={(clientData) => {
                    console.log("Données du client à mettre à jour:", clientData);
                    onUpdateClient(clientData);
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
