
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChiffreAffairesSection } from "./components/ChiffreAffairesSection";
import { EtablissementsSection } from "./components/etablissements";
import { IGSClassesSelector } from "./components/IGSClassesSelector";
import { IGSAmountDisplay } from "./components/IGSAmountDisplay";
import { IGSPaymentsSection } from "./components/IGSPaymentsSection";
import { IGSToggleSection } from "./components/IGSToggleSection";
import { CGAClasse, Etablissement } from "@/types/client";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { createDefaultEtablissement } from "./components/etablissements/utils";

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
  // S'assurer que les valeurs par défaut sont correctement initialisées
  const defaultPatente = { montant: '', quittance: '' };
  const defaultAcompteJanvier = { montant: '', quittance: '' };
  const defaultAcompteFevrier = { montant: '', quittance: '' };
  
  // Initialiser les états avec des valeurs par défaut appropriées
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente || defaultPatente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier || defaultAcompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier || defaultAcompteFevrier);
  
  // Initialiser les établissements comme un NOUVEAU tableau et s'assurer qu'il y a au moins un établissement
  const safeEtablissements = Array.isArray(etablissements) && etablissements.length > 0 
    ? etablissements 
    : [createDefaultEtablissement()];
    
  const [localChiffreAffaires, setLocalChiffreAffaires] = useState<number>(chiffreAffairesAnnuel || 0);

  useEffect(() => {
    console.log("IGSStatusSection - Initialisation des états avec les props");
    setPatenteState(patente || defaultPatente);
    setAcompteJanvierState(acompteJanvier || defaultAcompteJanvier);
    setAcompteFevrierState(acompteFevrier || defaultAcompteFevrier);
    setLocalChiffreAffaires(chiffreAffairesAnnuel || 0);
  }, [patente, acompteJanvier, acompteFevrier, chiffreAffairesAnnuel]);

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

  const handleChiffreAffairesChange = (value: number) => {
    setLocalChiffreAffaires(value);
    onChange("igs.chiffreAffairesAnnuel", value);
  };

  const handleEtablissementsChange = (newEtablissements: Etablissement[]) => {
    console.log("IGSStatusSection - handleEtablissementsChange appelé avec:", newEtablissements);
    
    // S'assurer que newEtablissements est toujours un tableau non vide
    let safeNewEtablissements = [];
    
    if (Array.isArray(newEtablissements) && newEtablissements.length > 0) {
      safeNewEtablissements = [...newEtablissements];
    } else {
      safeNewEtablissements = [createDefaultEtablissement()];
      console.log("Correction d'une liste d'établissements vide avec un établissement par défaut");
    }
    
    // Propager le changement au parent avec une copie pour éviter les problèmes de référence
    onChange("igs.etablissements", safeNewEtablissements);
    
    console.log("IGSStatusSection - Changement propagé au parent:", safeNewEtablissements);
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
                  chiffreAffaires={localChiffreAffaires}
                  onChange={handleChiffreAffairesChange}
                  onClasseChange={(value) => onChange("igs.classeIGS", value)}
                />
                
                <EtablissementsSection
                  etablissements={safeEtablissements}
                  onChange={handleEtablissementsChange}
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
