
import { IGSToggleSection } from "../../components/IGSToggleSection";
import { ChiffreAffairesSection } from "../../components/ChiffreAffairesSection";
import { EtablissementsSection } from "../../components/etablissements";
import { IGSClassesSelector } from "../../components/IGSClassesSelector";
import { IGSAmountDisplay } from "../../components/IGSAmountDisplay";
import { IGSPaymentsSection } from "../../components/IGSPaymentsSection";
import { Etablissement, IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IGSStatusContentProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patenteState: IGSPayment;
  acompteJanvierState: IGSPayment;
  acompteFevrierState: IGSPayment;
  localChiffreAffaires: number;
  localEtablissements: Etablissement[];
  completedPayments?: string[];
  onSoumisIGSChange: (checked: boolean) => void;
  onAdherentCGAChange: (checked: boolean) => void;
  onClasseIGSChange: (value: CGAClasse) => void;
  handlePatenteChange: (payment: IGSPayment) => void;
  handleAcompteJanvierChange: (payment: IGSPayment) => void;
  handleAcompteFevrierChange: (payment: IGSPayment) => void;
  handleChiffreAffairesChange: (value: number) => void;
  handleEtablissementsChange: (value: Etablissement[]) => void;
  handleTotalChange: (total: number) => void;
  handleCompletedPaymentsChange?: (payments: string[]) => void;
}

export function IGSStatusContent({
  soumisIGS,
  adherentCGA,
  classeIGS,
  patenteState,
  acompteJanvierState,
  acompteFevrierState,
  localChiffreAffaires,
  localEtablissements,
  completedPayments = [],
  onSoumisIGSChange,
  onAdherentCGAChange,
  onClasseIGSChange,
  handlePatenteChange,
  handleAcompteJanvierChange,
  handleAcompteFevrierChange,
  handleChiffreAffairesChange,
  handleEtablissementsChange,
  handleTotalChange,
  handleCompletedPaymentsChange
}: IGSStatusContentProps) {
  return (
    <div className="flex flex-col space-y-4">
      <IGSToggleSection
        soumisIGS={soumisIGS}
        adherentCGA={adherentCGA}
        onSoumisIGSChange={onSoumisIGSChange}
        onAdherentCGAChange={onAdherentCGAChange}
      />
      
      {soumisIGS && (
        <>
          <ChiffreAffairesSection
            chiffreAffaires={localChiffreAffaires}
            onChange={handleChiffreAffairesChange}
            onClasseChange={onClasseIGSChange}
            readOnly={true} // Le chiffre d'affaires est en lecture seule car calculé automatiquement
          />
          
          <EtablissementsSection
            etablissements={localEtablissements}
            onChange={handleEtablissementsChange}
            onTotalChange={handleTotalChange}
          />
          
          <IGSClassesSelector 
            classeIGS={classeIGS} 
            onChange={onClasseIGSChange} 
          />
          
          <IGSAmountDisplay 
            soumisIGS={soumisIGS} 
            classeIGS={classeIGS} 
            adherentCGA={adherentCGA} 
          />
          
          <IGSPaymentsSection 
            patente={patenteState}
            acompteJanvier={acompteJanvierState}
            acompteFevrier={acompteFevrierState}
            onPatenteChange={handlePatenteChange}
            onAcompteJanvierChange={handleAcompteJanvierChange}
            onAcompteFevrierChange={handleAcompteFevrierChange}
            soumisIGS={soumisIGS}
            classeIGS={classeIGS}
            adherentCGA={adherentCGA}
            completedPayments={completedPayments}
            onCompletedPaymentsChange={handleCompletedPaymentsChange}
          />
        </>
      )}
    </div>
  );
}
