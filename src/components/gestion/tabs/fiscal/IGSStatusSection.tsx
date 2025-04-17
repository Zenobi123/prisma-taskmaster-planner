
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChiffreAffairesSection } from "./components/ChiffreAffairesSection";
import { IGSClassesSelector } from "./components/IGSClassesSelector";
import { IGSAmountDisplay } from "./components/IGSAmountDisplay";
import { IGSPaymentsSection } from "./components/IGSPaymentsSection";
import { IGSToggleSection } from "./components/IGSToggleSection";
import { EtablissementsSection } from "./components/etablissements";
import { CGAClasse } from "@/types/client";
import { IGSPayment, Etablissement } from "@/hooks/fiscal/types/igsTypes";

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
  const [localChiffreAffaires, setLocalChiffreAffaires] = useState<number>(chiffreAffairesAnnuel || 0);
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>(
    etablissements && etablissements.length > 0 
      ? etablissements 
      : [{ 
          nom: "Établissement principal", 
          activite: "", 
          ville: "", 
          departement: "", 
          quartier: "", 
          chiffreAffaires: 0 
        }]
  );

  // S'assurer qu'il y a toujours au moins un établissement
  useEffect(() => {
    if (!etablissements || etablissements.length === 0) {
      const defaultEtab = [{ 
        nom: "Établissement principal", 
        activite: "", 
        ville: "", 
        departement: "", 
        quartier: "", 
        chiffreAffaires: 0 
      }];
      setLocalEtablissements(defaultEtab);
      onChange("igs.etablissements", defaultEtab);
    }
  }, []);

  // Mettre à jour la valeur du chiffre d'affaires total quand les établissements changent
  useEffect(() => {
    const totalChiffreAffaires = localEtablissements.reduce(
      (sum, etab) => sum + (etab.chiffreAffaires || 0), 
      0
    );
    
    if (totalChiffreAffaires !== localChiffreAffaires) {
      setLocalChiffreAffaires(totalChiffreAffaires);
      onChange("igs.chiffreAffairesAnnuel", totalChiffreAffaires);
    }
  }, [localEtablissements]);

  useEffect(() => {
    console.log("IGSStatusSection - Initialisation des états avec les props");
    setPatenteState(patente || defaultPatente);
    setAcompteJanvierState(acompteJanvier || defaultAcompteJanvier);
    setAcompteFevrierState(acompteFevrier || defaultAcompteFevrier);
    setLocalChiffreAffaires(chiffreAffairesAnnuel || 0);
    
    if (etablissements && etablissements.length > 0) {
      setLocalEtablissements(etablissements);
    } else if (localEtablissements.length === 0) {
      // Assurer qu'il y a au moins un établissement par défaut
      const defaultEtab = [{ 
        nom: "Établissement principal", 
        activite: "", 
        ville: "", 
        departement: "", 
        quartier: "", 
        chiffreAffaires: 0 
      }];
      setLocalEtablissements(defaultEtab);
    }
  }, [patente, acompteJanvier, acompteFevrier, chiffreAffairesAnnuel, etablissements]);

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

  // Cette fonction est maintenant appelée automatiquement via l'effet
  const handleChiffreAffairesChange = (value: number) => {
    setLocalChiffreAffaires(value);
    onChange("igs.chiffreAffairesAnnuel", value);
  };

  const handleEtablissementsChange = (value: Etablissement[]) => {
    setLocalEtablissements(value);
    onChange("igs.etablissements", value);
    
    // Calculer et mettre à jour le chiffre d'affaires total
    const totalChiffreAffaires = value.reduce(
      (sum, etab) => sum + (etab.chiffreAffaires || 0), 
      0
    );
    handleChiffreAffairesChange(totalChiffreAffaires);
  };

  // Fonction pour gérer la mise à jour de la classe IGS en fonction du CA
  const handleTotalChange = (total: number) => {
    handleChiffreAffairesChange(total);
    
    // Déterminer la classe IGS en fonction du chiffre d'affaires total
    const determineClasse = (ca: number): CGAClasse => {
      if (ca < 500000) return "classe1";
      if (ca < 1000000) return "classe2";
      if (ca < 1500000) return "classe3";
      if (ca < 2000000) return "classe4";
      if (ca < 2500000) return "classe5";
      if (ca < 5000000) return "classe6";
      if (ca < 10000000) return "classe7";
      if (ca < 20000000) return "classe8";
      if (ca < 30000000) return "classe9";
      return "classe10";
    };
    
    onChange("igs.classeIGS", determineClasse(total));
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
                  readOnly={true} // Le chiffre d'affaires est en lecture seule car calculé automatiquement
                />
                
                <EtablissementsSection
                  etablissements={localEtablissements}
                  onChange={handleEtablissementsChange}
                  onTotalChange={handleTotalChange}
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
