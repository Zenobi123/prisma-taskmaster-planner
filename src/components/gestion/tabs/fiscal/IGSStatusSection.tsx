
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChiffreAffairesSection } from "./components/ChiffreAffairesSection";
import { EtablissementsSection } from "./components/EtablissementsSection";
import { IGSClassesSelector } from "./components/IGSClassesSelector";
import { IGSAmountDisplay } from "./components/IGSAmountDisplay";
import { IGSPaymentsSection } from "./components/IGSPaymentsSection";
import { IGSToggleSection } from "./components/IGSToggleSection";
import { CGAClasse, Etablissement } from "@/types/client";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";

interface IGSStatusSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  chiffreAffairesAnnuel?: number;
  etablissements?: Etablissement[];
  onChange: (name: string, value: any) => void;
}

export function IGSStatusSection({
  soumisIGS = false,
  adherentCGA = false,
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  chiffreAffairesAnnuel = 0,
  etablissements = [],
  onChange
}: IGSStatusSectionProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);

  useEffect(() => {
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
  }, [patente, acompteJanvier, acompteFevrier]);

  const handlePatenteChange = (payment: IGSPayment) => {
    setPatenteState(payment);
    onChange("igs.patente", payment);
  };

  const handleAcompteJanvierChange = (payment: IGSPayment) => {
    setAcompteJanvierState(payment);
    onChange("igs.acompteJanvier", payment);
  };

  const handleAcompteFevierChange = (payment: IGSPayment) => {
    setAcompteFevrierState(payment);
    onChange("igs.acompteFevrier", payment);
  };

  return (
    <div className="space-y-4 mb-6">
      <h3 className="text-lg font-semibold">Impôt Général Synthétique (IGS)</h3>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            <IGSToggleSection
              soumisIGS={soumisIGS}
              adherentCGA={adherentCGA}
              onSoumisIGSChange={(checked) => onChange("igs.soumisIGS", checked)}
              onAdherentCGAChange={(checked) => onChange("igs.adherentCGA", checked)}
            />
            
            {soumisIGS && (
              <>
                <ChiffreAffairesSection
                  chiffreAffaires={chiffreAffairesAnnuel}
                  onChange={(value) => onChange("igs.chiffreAffairesAnnuel", value)}
                  onClasseChange={(value) => onChange("igs.classeIGS", value)}
                />
                
                <EtablissementsSection
                  etablissements={etablissements || []}
                  onChange={(value) => onChange("igs.etablissements", value)}
                />
                
                <IGSClassesSelector 
                  classeIGS={classeIGS} 
                  onChange={(value) => onChange("igs.classeIGS", value)} 
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
                  onAcompteFevierChange={handleAcompteFevierChange}
                  soumisIGS={soumisIGS}
                  classeIGS={classeIGS}
                  adherentCGA={adherentCGA}
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
