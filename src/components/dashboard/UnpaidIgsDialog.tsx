
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidIGS } from "@/services/unpaidIgsService";
import { ClientList } from "@/components/clients/ClientList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Client } from "@/types/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface UnpaidIgsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnpaidIgsDialog({ open, onOpenChange }: UnpaidIgsDialogProps) {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-igs"],
    queryFn: getClientsWithUnpaidIGS,
    enabled: open,
  });

  const handleViewClient = (client: Client) => {
    onOpenChange(false);
    // Navigate to fiscal management with client and tab params
    navigate(`/gestion?client=${client.id}&tab=obligations-fiscales`);
  };

  const handleEditClient = (client: Client) => {
    handleViewClient(client);
  };

  const handleArchiveClient = (client: Client) => {
    // No action needed for this view
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Clients avec IGS impayés</DialogTitle>
          <DialogDescription>
            Liste des clients assujettis à l'IGS qui ne l'ont pas encore payé.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Aucun client avec IGS impayé trouvé.</p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[70vh]">
            <ClientList
              clients={clients}
              onView={handleViewClient}
              onEdit={handleEditClient}
              onArchive={handleArchiveClient}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
