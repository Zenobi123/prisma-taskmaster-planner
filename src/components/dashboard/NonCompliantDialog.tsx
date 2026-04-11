
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
    refetchInterval: 60000,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });

  const handleEditClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Clients avec situation fiscale non conforme</DialogTitle>
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
        <DialogContent className="max-w-[95vw] sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Clients avec situation fiscale non conforme</DialogTitle>
          </DialogHeader>
          <p className="text-red-600 text-sm">Erreur lors du chargement des clients non conformes</p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2 text-base sm:text-lg">
            <span className="hidden sm:inline">Clients avec situation fiscale non conforme</span>
            <span className="sm:hidden">Situation non conforme</span>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 shrink-0 text-xs">
              {clients.length} client{clients.length > 1 ? 's' : ''}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {clients.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-neutral-600 text-sm">
              Aucun client avec une situation fiscale non conforme
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {clients.map((client: any) => (
              <div key={client.id} className="border rounded-lg p-3 sm:p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-800 text-sm sm:text-base truncate">
                      {client.nom || client.raisonsociale}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600">
                      NIU: {client.niu}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-600 truncate">
                      Centre: {client.centrerattachement || 'Non défini'}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:space-x-2 shrink-0">
                    <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs whitespace-nowrap">
                      Non conforme
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClient(client.id)}
                      className="flex items-center gap-1 h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Corriger</span>
                      <span className="sm:hidden">Gérer</span>
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
