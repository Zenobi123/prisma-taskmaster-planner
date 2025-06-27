
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { getClientsWithNonCompliantFiscalSituation } from "@/services/fiscal/nonCompliantFiscalService";

interface NonCompliantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NonCompliantDialog = ({ open, onOpenChange }: NonCompliantDialogProps) => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients-non-compliant-fiscal"],
    queryFn: getClientsWithNonCompliantFiscalSituation,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  const handleEditClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Clients avec situation fiscale non conforme</DialogTitle>
          </DialogHeader>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Clients avec situation fiscale non conforme</DialogTitle>
          </DialogHeader>
          <p className="text-red-600">Erreur lors du chargement des clients non conformes</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Clients avec situation fiscale non conforme</span>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {clients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600">
              Aucun client avec une situation fiscale non conforme
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {clients.map((client: any) => (
              <div key={client.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-800">
                      {client.nom || client.raisonsociale}
                    </h4>
                    <p className="text-sm text-neutral-600">
                      NIU: {client.niu}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Centre: {client.centrerattachement || 'Non défini'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
                      Non conforme
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client.id)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Corriger</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
