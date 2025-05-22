
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { getClientsWithUnfiledDarp } from '@/services/unfiledDarpService';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface UnfiledDarpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UnfiledDarpDialog: React.FC<UnfiledDarpDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients-unfiled-darp'],
    queryFn: getClientsWithUnfiledDarp,
    enabled: open, // Only fetch when dialog is open
    staleTime: 30000 // 30 seconds
  });
  
  const navigateToClientFiscal = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
            Clients avec DARP non déposée
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-md">
            Une erreur est survenue lors du chargement des données.
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">Aucun client n'a de DARP non déposée.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>NIU</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.nom || client.raisonsociale}</TableCell>
                  <TableCell>{client.niu}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigateToClientFiscal(client.id)}
                    >
                      Gérer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};
