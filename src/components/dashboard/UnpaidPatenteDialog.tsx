
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { ClientList } from "@/components/clients/ClientList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Client } from "@/types/client";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface UnpaidPatenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UnpaidPatenteDialog({ open, onOpenChange }: UnpaidPatenteDialogProps) {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente"],
    queryFn: getClientsWithUnpaidPatente,
    enabled: open,
  });

  const handleViewClient = (client: Client) => {
    onOpenChange(false);
    navigate(`/gestion?client=${client.id}&tab=obligations-fiscales`);
  };

  // Fonctions fictives pour satisfaire l'interface ClientList
  const handleEditClient = (client: Client) => {
    handleViewClient(client);
  };

  const handleArchiveClient = (client: Client) => {
    // Pas d'action nécessaire pour cette vue
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Clients avec patentes impayées</DialogTitle>
          <DialogDescription>
            Liste des clients assujettis à la patente qui ne l'ont pas encore payée.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Aucun client avec patente impayée trouvé.</p>
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
