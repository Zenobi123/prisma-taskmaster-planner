import { useState } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { BadgeEuro, Receipt, AlertTriangle, Calendar } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { useIGSReliquat } from "@/hooks/fiscal/useIGSReliquat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  getIGSPaymentDeadlines, 
  calculatePaymentStatus,
  calculateQuarterlyPayment,
  calculateIGSAmount
} from "@/components/clients/identity/igs/utils/igsCalculations";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface IGSPaymentsSectionProps {
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onAcompteJanvierChange: (payment: IGSPayment) => void;
  onAcompteFevrierChange: (payment: IGSPayment) => void;
  soumisIGS: boolean;
  classeIGS?: CGAClasse;
  adherentCGA: boolean;
  completedPayments?: string[];
  onCompletedPaymentsChange?: (payments: string[]) => void;
  title?: string;
}

export function IGSPaymentsSection({
  acompteJanvier,
  acompteFevrier,
  onAcompteJanvierChange,
  onAcompteFevrierChange,
  soumisIGS,
  classeIGS,
  adherentCGA,
  completedPayments = [],
  onCompletedPaymentsChange,
  title = "Paiements et déductions"
}: IGSPaymentsSectionProps) {
  const [paymentsList, setPaymentsList] = useState<string[]>(completedPayments);
  const deadlines = getIGSPaymentDeadlines();
  const totalAmount = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);
  const quarterlyAmount = calculateQuarterlyPayment(totalAmount);
  const paymentStatus = calculatePaymentStatus(paymentsList);

  const handlePaymentToggle = (paymentId: string, isChecked: boolean) => {
    let newPaymentsList = isChecked 
      ? [...paymentsList, paymentId]
      : paymentsList.filter(id => id !== paymentId);
    
    setPaymentsList(newPaymentsList);
    
    if (onCompletedPaymentsChange) {
      onCompletedPaymentsChange(newPaymentsList);
    }
  };

  if (!soumisIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">{title}</h4>
      
      {totalAmount !== null && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              Échéances de paiement
              <Badge variant={paymentStatus.isUpToDate ? "success" : "destructive"} className="ml-2">
                {paymentStatus.isUpToDate ? "À jour" : "En retard"}
              </Badge>
            </h4>
            
            {!paymentStatus.isUpToDate && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {paymentStatus.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {deadlines.map(deadline => (
              <div key={deadline.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
                <Checkbox 
                  id={`payment-${deadline.id}`}
                  checked={paymentsList.includes(deadline.id)}
                  onCheckedChange={(checked) => {
                    handlePaymentToggle(deadline.id, checked === true);
                  }}
                />
                <label 
                  htmlFor={`payment-${deadline.id}`}
                  className="text-sm flex-1 flex justify-between cursor-pointer"
                >
                  <span>{deadline.label}</span>
                  {quarterlyAmount && (
                    <span className="font-medium text-blue-700 flex items-center">
                      <BadgeEuro className="h-3 w-3 mr-1" />
                      {quarterlyAmount.toLocaleString()} FCFA
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
          
          {quarterlyAmount && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-sm text-blue-800">
                  Payé: {paymentsList.length} sur 4 échéances
                </p>
                <p className="text-sm font-medium text-blue-800">
                  {(quarterlyAmount * paymentsList.length).toLocaleString()} / {totalAmount.toLocaleString()} FCFA
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
      <Alert className="bg-blue-50 border-blue-200">
        <Calendar className="h-4 w-4 text-blue-800" />
        <AlertTitle className="text-blue-800">Échéances de paiement IGS</AlertTitle>
        <AlertDescription className="text-sm text-blue-800">
          L'IGS se paie par trimestre aux dates suivantes : 15 janvier, 15 avril, 15 juillet et 15 octobre.
          Vous pouvez payer en 1, 2 ou 4 fois selon votre choix.
        </AlertDescription>
      </Alert>
    </div>
  );
}
