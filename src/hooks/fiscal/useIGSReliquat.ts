
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";
import { calculateIGSAmount, calculateIGSReliquat } from "@/components/clients/identity/igs/utils/igsCalculations";

export const useIGSReliquat = (
  soumisIGS: boolean,
  classeIGS: CGAClasse | undefined,
  adherentCGA: boolean,
  patente: IGSPayment = { montant: '', quittance: '' },
  acompteJanvier: IGSPayment,
  acompteFevrier: IGSPayment
) => {
  const [reliquat, setReliquat] = useState<number | null>(null);

  useEffect(() => {
    const montantIGS = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);
    // Nous conservons les paramètres acompteJanvier et acompteFevrier pour maintenir
    // la compatibilité avec le reste du code, mais ces montants ne seront plus considérés
    // dans le reliquat puisqu'ils ont été supprimés de l'interface
    const calculatedReliquat = calculateIGSReliquat(montantIGS, patente, acompteJanvier, acompteFevrier);
    setReliquat(calculatedReliquat);
  }, [soumisIGS, classeIGS, adherentCGA, patente.montant, acompteJanvier.montant, acompteFevrier.montant]);

  return reliquat;
};
