
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSPaymentField } from "./IGSPaymentField";
import { BadgeEuro } from "lucide-react";
import { calculateIGSAmount } from "@/components/gestion/tabs/fiscal/components/IGSClassesSelector";
import { CGAClasse } from "@/hooks/fiscal/types";

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
  const [reliquat, setReliquat] = useState<number | null>(null);
  const montantIGS = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);

  // Calculate reliquat
  useEffect(() => {
    if (montantIGS !== null) {
      const patenteValue = parseFloat(patente.montant) || 0;
      const janvierValue = parseFloat(acompteJanvier.montant) || 0;
      const fevrierValue = parseFloat(acompteFevrier.montant) || 0;
      
      const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
      setReliquat(reliquatValue > 0 ? reliquatValue : 0);
    } else {
      setReliquat(null);
    }
  }, [montantIGS, patente.montant, acompteJanvier.montant, acompteFevrier.montant]);

  if (!soumisIGS || montantIGS === null) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Paiements et déductions</h4>
      
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
