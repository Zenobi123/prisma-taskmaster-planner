
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDbef } from "@/services/fiscal/unfiledDbefService";
import { FileText, FileWarning, Phone, Building } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface UnfiledDbefDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnfiledDbefDialog = ({ open, onOpenChange }: UnfiledDbefDialogProps) => {
  const navigate = useNavigate();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unfiled-dbef-dialog"],
    queryFn: getClientsWithUnfiledDbef,
    refetchInterval: 60000,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    enabled: open
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
            <FileText className="h-5 w-5 mr-2 text-purple-500" />
            DBEF non deposees ({clients.length})
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des donnees...</p>
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
                      <span>Centre des impots</span>
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
                  <TableRow key={client.id} className="hover:bg-purple-50">
                    <TableCell className="font-medium">
                      {client.raisonsociale || client.nom}
                    </TableCell>
                    <TableCell>{client.niu}</TableCell>
                    <TableCell>{client.centrerattachement}</TableCell>
                    <TableCell>{client.contact?.telephone}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleNavigateToClient(client.id)}
                        className="border-purple-300 hover:bg-purple-50 hover:text-purple-700"
                      >
                        Gerer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-8 text-center border-2 border-purple-200 rounded-md bg-purple-50 my-4">
            <FileWarning className="h-12 w-12 mx-auto text-purple-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg mb-2">
              Aucune DBEF non deposee
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Toutes les personnes morales sont a jour avec leurs declarations DBEF.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
