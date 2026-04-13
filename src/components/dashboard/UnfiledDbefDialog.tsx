
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-[95vw] sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b border-border/50">
          <DialogTitle className="flex items-center text-base sm:text-xl">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-purple-500 shrink-0" />
            DBEF non déposées ({clients.length})
          </DialogTitle>
          <DialogDescription>
            Liste des personnes morales n'ayant pas encore déposé leur DBEF.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
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
                <div key={client.id} className="border rounded-lg p-3 hover:bg-purple-50/50">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-medium text-sm leading-tight">
                      {client.raisonsociale || client.nom}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs shrink-0 border-purple-300 hover:bg-purple-50 hover:text-purple-700"
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
