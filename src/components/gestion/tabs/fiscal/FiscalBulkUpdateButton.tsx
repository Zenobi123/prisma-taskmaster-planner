
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export const FiscalBulkUpdateButton = () => {
  const { updateClientsfiscalData, updatingClients, isLoading } = useBulkFiscalUpdate();

  const progressPercentage = updatingClients.total > 0 
    ? (updatingClients.processed / updatingClients.total) * 100 
    : 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={updateClientsfiscalData} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour en cours...
              </>
            ) : (
              "Mettre à jour les obligations fiscales pour tous les clients"
            )}
          </Button>
          
          {isLoading && (
            <div className="space-y-2">
              <Progress value={progressPercentage} className="w-full" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Progression : {updatingClients.processed}/{updatingClients.total}
                </span>
                <span>
                  {updatingClients.successful} succès • {updatingClients.failed} échecs
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
