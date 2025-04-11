
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSPaymentField } from "./IGSPaymentField";
import { BadgeEuro } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { igsClassesInfo } from "./IGSClassesSelector";

interface IGSPaymentsSectionProps {
  montantIGS: number | null;
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onPatenteChange: (payment: IGSPayment) => void;
  onAcompteJanvierChange: (payment: IGSPayment) => void;
  onAcompteFevierChange: (payment: IGSPayment) => void;
}

export function IGSPaymentsSection({
  montantIGS,
  patente,
  acompteJanvier,
  acompteFevrier,
  onPatenteChange,
  onAcompteJanvierChange,
  onAcompteFevierChange
}: IGSPaymentsSectionProps) {
  const [reliquat, setReliquat] = useState<number | null>(null);

  // Calculer le reliquat IGS
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

  if (montantIGS === null) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4 border-t pt-4">
      <h4 className="font-medium">Paiements et déductions</h4>
      
      {/* Patente */}
      <IGSPaymentField
        label="Patente payée pour l'exercice (FCFA)"
        payment={patente}
        onChange={(montant, quittance) => 
          onPatenteChange({ montant, quittance })}
      />
      
      {/* Acompte IR de janvier */}
      <IGSPaymentField
        label="Acompte IR de janvier 2025 (FCFA)"
        payment={acompteJanvier}
        onChange={(montant, quittance) => 
          onAcompteJanvierChange({ montant, quittance })}
      />
      
      {/* Acompte IR de février */}
      <IGSPaymentField
        label="Acompte IR de février 2025 (FCFA)"
        payment={acompteFevrier}
        onChange={(montant, quittance) => 
          onAcompteFevierChange({ montant, quittance })}
      />
      
      {/* Reliquat */}
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

// Helper function to calculate IGS amount
export function calculateIGSAmount(soumisIGS: boolean, classeIGS?: CGAClasse, adherentCGA?: boolean): number | null {
  if (soumisIGS && classeIGS && igsClassesInfo[classeIGS]) {
    let baseAmount = igsClassesInfo[classeIGS].montant;
    
    // Appliquer une réduction de 50% si adhérent CGA
    if (adherentCGA) {
      baseAmount = baseAmount * 0.5;
    }
    
    return baseAmount;
  }
  return null;
}
