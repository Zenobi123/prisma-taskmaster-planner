
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/fiscal/unfiledDsfService";
import { FileText, AlertTriangle, FileWarning, Phone, Building } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnfiledDsfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnfiledDsfDialog = ({ open, onOpenChange }: UnfiledDsfDialogProps) => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unfiled-dsf-dialog"],
    queryFn: getClientsWithUnfiledDsf,
    // Configurer le rafraîchissement automatique
    refetchInterval: 60000,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: open // Ne charge les données que si la boîte de dialogue est ouverte
  });

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-base sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 shrink-0" />
            DSF non déposées ({clients.length})
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Chargement des données...</p>
          </div>
        ) : clients.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>NIU</TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>Centre des impôts</span>
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        <span>Contact</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-blue-50">
                      <TableCell className="font-medium">
                        {client.type === "physique" ? client.nom : client.raisonsociale}
                      </TableCell>
                      <TableCell>{client.niu}</TableCell>
                      <TableCell>{client.centrerattachement}</TableCell>
                      <TableCell>{client.contact?.telephone}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigateToClient(client.id)}
                          className="border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                        >
                          Gérer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="sm:hidden space-y-2">
              {clients.map((client) => (
                <div key={client.id} className="border rounded-lg p-3 hover:bg-blue-50/50">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm leading-tight">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs shrink-0 border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => handleNavigateToClient(client.id)}
                    >
                      Gérer
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                    <span>NIU: {client.niu}</span>
                    {client.centrerattachement && <span>{client.centrerattachement}</span>}
                    {client.contact?.telephone && <span>{client.contact.telephone}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="py-8 text-center border-2 border-blue-200 rounded-md bg-blue-50 my-4">
            <FileWarning className="h-12 w-12 mx-auto text-blue-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucun client avec DSF non déposée
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Tous les clients assujettis à la DSF sont à jour avec leurs déclarations.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
