
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
  onSoumisIGSChange: (checked: boolean) => void;
  onAdherentCGAChange: (checked: boolean) => void;
  onClasseIGSChange: (value: CGAClasse) => void;
  handlePatenteChange: (payment: IGSPayment) => void;
  handleAcompteJanvierChange: (payment: IGSPayment) => void;
  handleAcompteFevierChange: (payment: IGSPayment) => void;
  handleChiffreAffairesChange: (value: number) => void;
  handleEtablissementsChange: (value: Etablissement[]) => void;
  handleTotalChange: (total: number) => void;
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
  onSoumisIGSChange,
  onAdherentCGAChange,
  onClasseIGSChange,
  handlePatenteChange,
  handleAcompteJanvierChange,
  handleAcompteFevierChange,
  handleChiffreAffairesChange,
  handleEtablissementsChange,
  handleTotalChange
}: IGSStatusContentProps) {
  const [showPayments, setShowPayments] = useState(false);

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
          
          {/* Déclencheur pour les paiements et déductions */}
          <div className="flex items-center space-x-2 pt-4">
            <Switch 
              id="showPayments" 
              checked={showPayments} 
              onCheckedChange={setShowPayments} 
            />
            <Label htmlFor="showPayments" className="font-medium">
              Activer les paiements et déductions
            </Label>
          </div>
          
          {showPayments && (
            <IGSPaymentsSection 
              patente={patenteState}
              acompteJanvier={acompteJanvierState}
              acompteFevrier={acompteFevrierState}
              onPatenteChange={handlePatenteChange}
              onAcompteJanvierChange={handleAcompteJanvierChange}
              onAcompteFevierChange={handleAcompteFevierChange}
              soumisIGS={soumisIGS}
              classeIGS={classeIGS}
              adherentCGA={adherentCGA}
            />
          )}
        </>
      )}
    </div>
  );
}
