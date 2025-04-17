import { useState } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSPaymentField } from "./IGSPaymentField";
import { BadgeEuro, Receipt, AlertTriangle, Calendar } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { useIGSReliquat } from "@/hooks/fiscal/useIGSReliquat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  getIGSPaymentDeadlines, 
  calculatePaymentStatus,
  calculateQuarterlyPayment,
  calculateIGSAmount
} from "@/components/clients/identity/igs/utils/igsCalculations";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface IGSPaymentsSectionProps {
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onPatenteChange: (payment: IGSPayment) => void;
  onAcompteJanvierChange: (payment: IGSPayment) => void;
  onAcompteFevierChange: (payment: IGSPayment) => void;
  soumisIGS: boolean;
  classeIGS?: CGAClasse;
  adherentCGA: boolean;
  completedPayments?: string[];
  onCompletedPaymentsChange?: (payments: string[]) => void;
}

export function IGSPaymentsSection({
  patente,
  acompteJanvier,
  acompteFevrier,
  onPatenteChange,
  onAcompteJanvierChange,
  onAcompteFevierChange,
  soumisIGS,
  classeIGS,
  adherentCGA,
  completedPayments = [],
  onCompletedPaymentsChange
}: IGSPaymentsSectionProps) {
  const reliquat = useIGSReliquat(
    soumisIGS,
    classeIGS,
    adherentCGA,
    patente,
    acompteJanvier,
    acompteFevrier
  );
  
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

  const [showPayments, setShowPayments] = useState(false);

  if (!soumisIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="activateDeduction" 
          checked={showPayments} 
          onCheckedChange={setShowPayments} 
        />
        <Label htmlFor="activateDeduction" className="font-medium">
          Activer la déduction
        </Label>
      </div>

      {showPayments && (
        <>
          <h4 className="font-medium">Paiements et déductions</h4>
          
          {/* Payment deadlines section */}
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
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-800" />
            <AlertTitle className="text-amber-800">Important</AlertTitle>
            <AlertDescription className="text-sm text-amber-800">
              Les paiements et déductions ne sont pris en compte que s'ils sont autorisés par l'administration fiscale.
              Veuillez vous assurer d'avoir les justificatifs nécessaires.
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-blue-50 border-blue-200">
            <Calendar className="h-4 w-4 text-blue-800" />
            <AlertTitle className="text-blue-800">Échéances de paiement IGS</AlertTitle>
            <AlertDescription className="text-sm text-blue-800">
              L'IGS se paie par trimestre aux dates suivantes : 15 janvier, 15 avril, 15 juillet et 15 octobre.
              Vous pouvez payer en 1, 2 ou 4 fois selon votre choix.
            </AlertDescription>
          </Alert>
          
          <IGSPaymentField
            label="Patente payée pour l'exercice (FCFA)"
            payment={patente}
            onChange={(montant, quittance) => 
              onPatenteChange({ montant, quittance })}
            helperText="Vient en déduction de l'IGS si autorisée par l'administration fiscale"
          />
          
          {reliquat !== null && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800 font-medium flex items-center">
                <BadgeEuro className="h-5 w-5 mr-2" />
                Reliquat IGS à payer: {reliquat.toLocaleString()} FCFA
                <Badge variant={reliquat === 0 ? "success" : "destructive"} className="ml-2">
                  {reliquat === 0 ? "Soldé" : "Non soldé"}
                </Badge>
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
