
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TaxObligationStatus } from "@/hooks/fiscal/types";

interface IgsDetailPanelProps {
  igsStatus: TaxObligationStatus;
}

export const IgsDetailPanel = ({ igsStatus }: IgsDetailPanelProps) => {
  if (!igsStatus || !igsStatus.assujetti) {
    return null;
  }

  const isPaid = igsStatus.paye;
  const lastPaymentDate = igsStatus.datePaiement;
  const paymentAmount = igsStatus.montant || 0;
  const observations = igsStatus.observations || "";

  return (
    <Card className="mt-2 border-dashed">
      <CardContent className="pt-4 pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-muted-foreground">Statut de paiement</Label>
              <div className="flex items-center space-x-2">
                <Badge variant={isPaid ? "success" : "destructive"} className="mt-1">
                  {isPaid ? "Payé" : "Non payé"}
                </Badge>
              </div>
            </div>
            
            {isPaid && lastPaymentDate && (
              <div className="text-right space-y-1">
                <Label className="text-sm font-medium text-muted-foreground">Date de paiement</Label>
                <div className="flex items-center text-sm mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <span>{lastPaymentDate}</span>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Montant</Label>
            <p className="text-sm mt-1 font-medium">
              {new Intl.NumberFormat('fr-FR').format(paymentAmount)} FCFA
            </p>
          </div>
          
          {observations && (
            <>
              <Separator className="my-2" />
              <div>
                <div className="flex items-center mb-1">
                  <Info className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <Label className="text-sm font-medium text-muted-foreground">Observations</Label>
                </div>
                <p className="text-sm whitespace-pre-line">{observations}</p>
              </div>
            </>
          )}
          
          {!isPaid && (
            <div className="flex items-start mt-2 bg-amber-50 p-2 rounded-md border border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                Ce client doit régulariser son IGS. Pensez à l'inclure dans votre prochain rapport de suivi.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
