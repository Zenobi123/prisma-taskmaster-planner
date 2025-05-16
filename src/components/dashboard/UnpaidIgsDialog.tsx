
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getClientsWithUnpaidIgs } from '@/services/unpaidIgsService';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, X } from 'lucide-react';
import { Client } from '@/types/client';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface UnpaidIgsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
}

export const UnpaidIgsDialog = ({ isOpen, onClose, clients }: UnpaidIgsDialogProps) => {
  const navigate = useNavigate();
  
  const handleViewClient = (clientId: string) => {
    navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    onClose();
  };
  
  // Fonction pour afficher le nom du client
  const getClientName = (client: Client) => {
    return client.nom || client.raisonsociale || 'Client sans nom';
  };
  
  // Si la liste est vide, proposer un contenu alternatif
  if (clients && clients.length === 0) {
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
            {clients ? clients.length : 0} clients ont un IGS non payé.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        
        <div className="max-h-96 overflow-y-auto">
          {clients && clients.map((client) => (
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
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
