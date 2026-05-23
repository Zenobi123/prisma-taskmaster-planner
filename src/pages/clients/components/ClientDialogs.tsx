
import { useRef } from "react";
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
  onAddClient: (clientData) => void;
  onUpdateClient: (clientData) => void;
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
  // Keep the last non-null client so dialog content doesn't vanish during the
  // close animation (when selectedClient is cleared before the dialog finishes
  // animating out).
  const lastClientRef = useRef<Client | null>(null);
  if (selectedClient) lastClientRef.current = selectedClient;
  const activeClient = lastClientRef.current;

  // Always render — never unmount based on state, let the Dialog `open` prop
  // control visibility. Removing the early return prevents the unmount/remount
  // cycle that caused the UI freeze after two consecutive operations.
  return (
    <>
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="bg-white max-w-[95vw] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Ajouter un nouveau client</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Remplissez les informations du nouveau client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] sm:h-[75vh] pr-2 sm:pr-4">
            <ClientForm
              type={newClientType}
              onTypeChange={onNewClientTypeChange}
              onSubmit={(clientData) => {
                onAddClient(clientData);
              }}
            />
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-white max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Détails du client</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Informations détaillées sur le client
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] sm:max-h-[75vh] pr-2 sm:pr-4">
            {activeClient && <ClientView client={activeClient} />}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-white max-w-[95vw] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Modifier le client</DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              Modifiez les informations du client ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[70vh] sm:h-[75vh] pr-2 sm:pr-4">
            {activeClient && (
              <ClientForm
                type={activeClient.type}
                initialData={activeClient}
                onSubmit={(clientData) => {
                  onUpdateClient(clientData);
                }}
              />
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
