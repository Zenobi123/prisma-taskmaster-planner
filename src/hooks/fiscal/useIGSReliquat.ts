
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";
import { igsClassesInfo } from "@/components/gestion/tabs/fiscal/components/IGSClassesSelector";

export const useIGSReliquat = (
  soumisIGS: boolean,
  classeIGS: CGAClasse | undefined,
  adherentCGA: boolean,
  patente: IGSPayment,
  acompteJanvier: IGSPayment,
  acompteFevrier: IGSPayment
) => {
  const [reliquat, setReliquat] = useState<number | null>(null);

  // Calculate IGS amount based on class and CGA status
  const calculateIGSAmount = (soumisIGS: boolean, classeIGS?: CGAClasse, adherentCGA?: boolean): number | null => {
    if (!soumisIGS || !classeIGS || !igsClassesInfo[classeIGS]) {
      return null;
    }
    
    let montantIGS = igsClassesInfo[classeIGS].montant;
    
    // Apply 50% reduction for CGA members
    if (adherentCGA) {
      montantIGS = montantIGS * 0.5;
    }
    
    return montantIGS;
  };

  useEffect(() => {
    const montantIGS = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);
    
    if (montantIGS !== null) {
      const patenteValue = parseFloat(patente.montant) || 0;
      const janvierValue = parseFloat(acompteJanvier.montant) || 0;
      const fevrierValue = parseFloat(acompteFevrier.montant) || 0;
      
      const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
      setReliquat(reliquatValue > 0 ? reliquatValue : 0);
    } else {
      setReliquat(null);
    }
  }, [soumisIGS, classeIGS, adherentCGA, patente.montant, acompteJanvier.montant, acompteFevrier.montant]);

  return reliquat;
};
