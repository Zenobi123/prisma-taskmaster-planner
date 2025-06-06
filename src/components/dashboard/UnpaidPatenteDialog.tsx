
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { FileText, AlertTriangle, FileWarning, Phone, Building } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnpaidPatenteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnpaidPatenteDialog = ({ open, onOpenChange }: UnpaidPatenteDialogProps) => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente-dialog"],
    queryFn: getClientsWithUnpaidPatente,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileText className="h-5 w-5 mr-2 text-red-500" />
            Patentes non payées ({clients.length})
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        ) : clients.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <TableRow key={client.id} className="hover:bg-red-50">
                    <TableCell className="font-medium">
                      {client.type === "physique" ? client.nom : client.raisonsociale}
                    </TableCell>
                    <TableCell>{client.niu}</TableCell>
                    <TableCell>{client.centrerattachement}</TableCell>
                    <TableCell>{client.contact.telephone}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleNavigateToClient(client.id)}
                        className="border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-red-200 rounded-md bg-red-50">
            <FileWarning className="h-12 w-12 mx-auto text-red-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucun client avec patente impayée
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Tous les clients assujettis à la patente sont à jour avec leurs paiements.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
