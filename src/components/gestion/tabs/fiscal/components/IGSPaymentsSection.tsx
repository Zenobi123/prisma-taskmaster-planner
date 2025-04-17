
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSPaymentField } from "./IGSPaymentField";
import { BadgeEuro, Receipt, AlertTriangle, Calendar } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { useIGSReliquat } from "@/hooks/fiscal/useIGSReliquat";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  adherentCGA
}: IGSPaymentsSectionProps) {
  const reliquat = useIGSReliquat(
    soumisIGS,
    classeIGS,
    adherentCGA,
    patente,
    acompteJanvier,
    acompteFevrier
  );

  if (!soumisIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Paiements et déductions</h4>
      
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
      />
      
      <IGSPaymentField
        label="Acompte IR de janvier 2025 (FCFA)"
        payment={acompteJanvier}
        onChange={(montant, quittance) => 
          onAcompteJanvierChange({ montant, quittance })}
      />
      
      <IGSPaymentField
        label="Acompte IR de février 2025 (FCFA)"
        payment={acompteFevrier}
        onChange={(montant, quittance) => 
          onAcompteFevierChange({ montant, quittance })}
      />
      
      {reliquat !== null && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 font-medium flex items-center">
            <BadgeEuro className="h-5 w-5 mr-2" />
            Reliquat IGS à payer: {reliquat.toLocaleString()} FCFA
          </p>
        </div>
      )}
    </div>
  );
}
