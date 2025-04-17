
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSPaymentField } from "./IGSPaymentField";
import { BadgeEuro, Receipt } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { useIGSReliquat } from "@/hooks/fiscal/useIGSReliquat";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
      
      <Alert className="bg-amber-50 border-amber-200 text-amber-800">
        <Receipt className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Les paiements et déductions ne sont pris en compte que s'ils sont autorisés par l'administration fiscale.
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
