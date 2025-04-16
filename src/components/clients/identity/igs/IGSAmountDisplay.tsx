
import { BadgeEuro } from "lucide-react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { igsClassesInfo } from "./IGSClassSelector";

interface IGSAmountDisplayProps {
  soumisIGS: boolean;
  classeIGS?: CGAClasse;
  adherentCGA: boolean;
}

export function IGSAmountDisplay({ soumisIGS, classeIGS, adherentCGA }: IGSAmountDisplayProps) {
  if (!soumisIGS || !classeIGS || !igsClassesInfo[classeIGS]) {
    return null;
  }
  
  let montantIGS = igsClassesInfo[classeIGS].montant;
  
  // Appliquer une réduction de 50% si adhérent CGA
  if (adherentCGA) {
    montantIGS = montantIGS * 0.5;
  }
  
  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md mt-6">
      <p className="text-green-800 font-medium flex items-center">
        <BadgeEuro className="h-5 w-5 mr-2" />
        Montant de l'IGS à payer: {montantIGS.toLocaleString()} FCFA
        {adherentCGA && " (Réduction CGA de 50% appliquée)"}
      </p>
    </div>
  );
}
