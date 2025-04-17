
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CGAClasse } from "@/types/client";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { IGSClassSelector } from "@/components/clients/identity/igs/IGSClassSelector";
import { IGSAmountDisplay } from "@/components/clients/identity/igs/IGSAmountDisplay";
import { IGSEstablishmentsSection } from "./IGSEstablishmentsSection";
import { IGSPaymentsSection } from "../IGSPaymentsSection";

export interface IGSStatusContentProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patenteState: IGSPayment;
  acompteJanvierState: IGSPayment;
  acompteFevrierState: IGSPayment;
  localChiffreAffaires: number;
  localEtablissements: any[];
  completedPayments: string[];
  onSoumisIGSChange: (checked: boolean) => void;
  onAdherentCGAChange: (checked: boolean) => void;
  onClasseIGSChange: (value: CGAClasse) => void;
  handlePatenteChange: (field: "montant" | "quittance", value: string) => void;
  handleAcompteJanvierChange: (field: "montant" | "quittance", value: string) => void;
  handleAcompteFevrierChange: (field: "montant" | "quittance", value: string) => void;
  handleChiffreAffairesChange: (value: number) => void;
  handleEtablissementsChange: (etablissements: any[]) => void;
  handleTotalChange: (value: string) => void;
  handleCompletedPaymentsChange: (payments: string[]) => void;
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
  completedPayments,
  onSoumisIGSChange,
  onAdherentCGAChange,
  onClasseIGSChange,
  handlePatenteChange,
  handleAcompteJanvierChange,
  handleAcompteFevrierChange,
  handleChiffreAffairesChange,
  handleEtablissementsChange,
  handleCompletedPaymentsChange
}: IGSStatusContentProps) {
  return (
    <div className="space-y-6">
      {/* Section Soumis à l'IGS */}
      <div className="flex items-center space-x-2">
        <Switch 
          id="soumisIGS" 
          checked={soumisIGS}
          onCheckedChange={onSoumisIGSChange}
        />
        <Label htmlFor="soumisIGS">Soumis à l'IGS</Label>
      </div>

      {soumisIGS && (
        <>
          {/* Section Adhérent CGA */}
          <div className="flex items-center space-x-2">
            <Switch 
              id="adherentCGA" 
              checked={adherentCGA}
              onCheckedChange={onAdherentCGAChange}
            />
            <Label htmlFor="adherentCGA">Adhérent CGA (50% de réduction)</Label>
          </div>

          {/* Section Classe IGS */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="classeIGS">Classe IGS</Label>
              <IGSClassSelector 
                value={classeIGS} 
                onChange={onClasseIGSChange}
              />
            </div>

            {/* Affichage du montant IGS */}
            <IGSAmountDisplay 
              soumisIGS={soumisIGS}
              adherentCGA={adherentCGA}
              classeIGS={classeIGS}
            />
          </div>

          {/* Section Établissements */}
          <IGSEstablishmentsSection 
            etablissements={localEtablissements} 
            chiffreAffairesAnnuel={localChiffreAffaires}
            onChiffreAffairesChange={handleChiffreAffairesChange}
            onEtablissementsChange={handleEtablissementsChange}
          />

          {/* Section Paiements et déductions */}
          <IGSPaymentsSection 
            acompteJanvier={acompteJanvierState}
            acompteFevrier={acompteFevrierState}
            onAcompteJanvierChange={(payment) => {
              handleAcompteJanvierChange('montant', payment.montant);
              handleAcompteJanvierChange('quittance', payment.quittance);
            }}
            onAcompteFevrierChange={(payment) => {
              handleAcompteFevrierChange('montant', payment.montant);
              handleAcompteFevrierChange('quittance', payment.quittance);
            }}
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
