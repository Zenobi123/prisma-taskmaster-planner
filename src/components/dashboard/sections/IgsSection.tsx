
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UnpaidIgsDialog } from '../UnpaidIgsDialog';
import { getClientsWithUnpaidIgs } from '@/services/unpaidIgsService';
import { useQuery } from '@tanstack/react-query';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '@/types/client';

export const IgsSection = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  
  const { data: unpaidIgsClients = [], isLoading } = useQuery({
    queryKey: ['unpaidIgsClients'],
    queryFn: getClientsWithUnpaidIgs,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000 // 5 minutes
  });
  
  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);

  return (
    <Card>
      <CardHeader className="pb-2 pt-6">
        <CardTitle className="text-xl flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
          Impôt Global Synthétique (IGS)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <LoaderCircle className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : unpaidIgsClients && unpaidIgsClients.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm">
              <span className="font-bold text-yellow-600">{unpaidIgsClients.length}</span> clients ont 
              un IGS non payé pour l'année en cours.
            </p>
            <Button variant="outline" className="w-full" onClick={handleOpenDialog}>
              Voir les clients concernés
            </Button>
          </div>
        ) : (
          <p className="text-sm">Aucun client n'a d'IGS non payé pour l'année en cours.</p>
        )}
      </CardContent>
      
      <UnpaidIgsDialog 
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        clients={unpaidIgsClients as Client[]}
      />
    </Card>
  );
};
