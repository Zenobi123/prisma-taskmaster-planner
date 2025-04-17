
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import { calculateIGSAmount, calculateQuarterlyPayment, getIGSPaymentDeadlines } from "@/components/clients/identity/igs/utils/igsCalculations";
import { useState, useEffect } from "react";

interface IGSPaymentsSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  completedPayments: string[];
  onAcompteJanvierChange: (payment: IGSPayment) => void;
  onAcompteFevrierChange: (payment: IGSPayment) => void;
  onCompletedPaymentsChange: (payments: string[]) => void;
}

export function IGSPaymentsSection({
  soumisIGS,
  adherentCGA,
  classeIGS,
  acompteJanvier,
  acompteFevrier,
  completedPayments = [],
  onAcompteJanvierChange,
  onAcompteFevrierChange,
  onCompletedPaymentsChange
}: IGSPaymentsSectionProps) {
  const [localCompletedPayments, setLocalCompletedPayments] = useState<string[]>(completedPayments);
  
  // Calculate IGS amount
  const igsAmount = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);
  const quarterlyAmount = calculateQuarterlyPayment(igsAmount);
  const deadlines = getIGSPaymentDeadlines();
  
  // Update completed payments when props change
  useEffect(() => {
    setLocalCompletedPayments(completedPayments);
  }, [completedPayments]);

  // Handle payment toggle
  const handlePaymentToggle = (paymentId: string, isChecked: boolean) => {
    let newPayments: string[];
    
    if (isChecked) {
      newPayments = [...localCompletedPayments, paymentId];
    } else {
      newPayments = localCompletedPayments.filter(id => id !== paymentId);
    }
    
    setLocalCompletedPayments(newPayments);
    onCompletedPaymentsChange(newPayments);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-md font-medium">Paiements trimestriels IGS</h4>
      
      <Card>
        <CardContent className="pt-4">
          {igsAmount !== null && (
            <div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200">
              <p className="font-medium text-blue-700">Montant total IGS annuel: {igsAmount.toLocaleString()} FCFA</p>
              {quarterlyAmount !== null && (
                <p className="text-sm text-blue-600">Paiement trimestriel: {quarterlyAmount.toLocaleString()} FCFA</p>
              )}
            </div>
          )}
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            {deadlines.map((deadline) => {
              const isPaid = localCompletedPayments.includes(deadline.id);
              const isOverdue = new Date() > deadline.date && !isPaid;
              
              return (
                <div key={deadline.id} className="flex items-center justify-between p-2 rounded-md border bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium">{deadline.label}</p>
                    {quarterlyAmount !== null && (
                      <p className="text-sm text-gray-600">{quarterlyAmount.toLocaleString()} FCFA</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {isPaid ? (
                      <Badge className="bg-green-100 text-green-800 border-green-300">Payé</Badge>
                    ) : isOverdue ? (
                      <Badge variant="destructive">En retard</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">À payer</Badge>
                    )}
                    
                    <Switch
                      checked={isPaid}
                      onCheckedChange={(checked) => handlePaymentToggle(deadline.id, checked)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-sm text-gray-500">
            <p>Note: Veuillez marquer les paiements comme complétés pour les mettre à jour dans le tableau de bord.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
