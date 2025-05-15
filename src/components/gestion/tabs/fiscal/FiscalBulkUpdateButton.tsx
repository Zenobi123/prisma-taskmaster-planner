
import React from 'react';
import { Button } from '@/components/ui/button';
import { useBulkFiscalUpdate } from '@/hooks/fiscal/useBulkFiscalUpdate';
import { RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const FiscalBulkUpdateButton = () => {
  const { updateClientsfiscalData, updatingClients, isLoading, isUpdating } = useBulkFiscalUpdate();

  const progressPercentage = updatingClients.total > 0 
    ? (updatingClients.processed / updatingClients.total) * 100 
    : 0;

  // Create a click handler that doesn't need parameters
  const handleButtonClick = () => {
    updateClientsfiscalData();
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Mise à jour des obligations fiscales</CardTitle>
        <CardDescription>
          Met à jour les données fiscales pour tous les clients en gestion externalisée
          <span className="text-xs block mt-1 text-muted-foreground">Les mises à jour sont également effectuées automatiquement</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleButtonClick} 
            disabled={isLoading || isUpdating}
            className="w-full"
            size="lg"
            variant={isUpdating ? "outline" : "default"}
          >
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour en cours...
              </>
            ) : (
              "Mettre à jour les obligations fiscales pour tous les clients"
            )}
          </Button>
          
          {isUpdating && (
            <div className="space-y-3">
              <Progress value={progressPercentage} className="w-full h-2" />
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
          
          {!isUpdating && updatingClients.processed > 0 && (
            <div className="text-sm text-muted-foreground text-center">
              Dernière mise à jour : {updatingClients.successful} succès, {updatingClients.failed} échecs
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
