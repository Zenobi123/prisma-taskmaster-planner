
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getClientsWithUnpaidIgs } from '@/services/fiscal/unpaidIgsService';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { Client } from '@/types/client';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface UnpaidIgsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

export const UnpaidIgsDialog = ({ isOpen, onClose }: UnpaidIgsDialogProps) => {
  const navigate = useNavigate();
  
  const { data: unpaidIgsClients = [], isLoading } = useQuery({
    queryKey: ['unpaidIgsClients'],
    queryFn: getClientsWithUnpaidIgs,
    enabled: isOpen,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000
  });
  
  const handleViewClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onClose();
  };
  
  const getClientName = (client: Client) => {
    return client.nom || client.raisonsociale || 'Client sans nom';
  };
  
  console.log("UnpaidIgsDialog - Clients found:", unpaidIgsClients.length);
  
  if (!isLoading && unpaidIgsClients && unpaidIgsClients.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={() => onClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aucun client en attente de paiement IGS</DialogTitle>
            <DialogDescription>
              Tous les clients ayant une obligation IGS sont à jour.
            </DialogDescription>
          </DialogHeader>
          <Separator />
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Clients n'ayant pas payé leur IGS
          </DialogTitle>
          <DialogDescription>
            {isLoading ? "Chargement..." : `${unpaidIgsClients.length} clients ont un IGS non payé.`}
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {unpaidIgsClients.map((client) => (
              <div key={client.id} className="py-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{getClientName(client)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewClient(client.id)}
                  >
                    Gérer
                  </Button>
                </div>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
