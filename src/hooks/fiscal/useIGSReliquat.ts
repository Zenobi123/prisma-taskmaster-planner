
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";
import { calculateIGSAmount, calculateIGSReliquat } from "@/components/clients/identity/igs/utils/igsCalculations";

export const useIGSReliquat = (
  soumisIGS: boolean,
  classeIGS: CGAClasse | undefined,
  adherentCGA: boolean,
  patente: IGSPayment,
  acompteJanvier: IGSPayment,
  acompteFevrier: IGSPayment
) => {
  const [reliquat, setReliquat] = useState<number | null>(null);

  useEffect(() => {
    const montantIGS = calculateIGSAmount(soumisIGS, classeIGS, adherentCGA);
    const calculatedReliquat = calculateIGSReliquat(montantIGS, patente, acompteJanvier, acompteFevrier);
    setReliquat(calculatedReliquat);
  }, [soumisIGS, classeIGS, adherentCGA, patente.montant, acompteJanvier.montant, acompteFevrier.montant]);

  return reliquat;
};
