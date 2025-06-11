
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
        <DialogContent className="bg-white max-h-[90vh] max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau client</DialogTitle>
            <DialogDescription>
              Remplissez les informations du nouveau client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[75vh] pr-4">
            <ClientForm
              type={newClientType}
              onTypeChange={onNewClientTypeChange}
              onSubmit={(clientData) => {
                console.log("Données du client à ajouter:", clientData);
                onAddClient(clientData);
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {selectedClient && (
        <>
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="bg-white max-h-[90vh] max-w-4xl">
              <DialogHeader>
                <DialogTitle>Détails du client</DialogTitle>
                <DialogDescription>
                  Informations détaillées sur le client
                </DialogDescription>
              </DialogHeader>
              <ClientView client={selectedClient} />
            </DialogContent>
          </Dialog>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-white max-h-[90vh] max-w-4xl">
              <DialogHeader>
                <DialogTitle>Modifier le client</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du client ci-dessous.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[75vh] pr-4">
                <ClientForm
                  type={selectedClient.type}
                  initialData={selectedClient}
                  onSubmit={(clientData) => {
                    console.log("Données du client à mettre à jour:", clientData);
                    onUpdateClient(clientData);
                  }}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
