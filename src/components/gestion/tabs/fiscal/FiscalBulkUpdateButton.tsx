
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { RefreshCw } from 'lucide-react';

export const FiscalBulkUpdateButton = () => {
  const { updateClientsfiscalData, updatingClients, isLoading } = useBulkFiscalUpdate();

  return (
    <div className="flex flex-col space-y-2">
      <Button 
        onClick={updateClientsfiscalData} 
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Mise à jour en cours... ({updatingClients.processed}/{updatingClients.total})
          </>
        ) : (
          "Mettre à jour les obligations fiscales pour tous les clients"
        )}
      </Button>
      {isLoading && (
        <div className="text-sm text-muted-foreground text-center">
          Progression : {updatingClients.successful} succès, {updatingClients.failed} échecs
        </div>
      )}
    </div>
  );
};
