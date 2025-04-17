
import { useState, useEffect, useCallback } from "react";
import { Etablissement, IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";
import { determineIGSClassFromCA } from "@/components/clients/identity/igs/utils/igsCalculations";

interface IGSStatusProps {
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

export function useIGSStatusState({
  soumisIGS = false,
  adherentCGA = false,
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  chiffreAffairesAnnuel = 0,
  etablissements = [],
  onChange
}: IGSStatusProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente || { montant: '', quittance: '' });
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier || { montant: '', quittance: '' });
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier || { montant: '', quittance: '' });
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
    setPatenteState(patente || { montant: '', quittance: '' });
    setAcompteJanvierState(acompteJanvier || { montant: '', quittance: '' });
    setAcompteFevrierState(acompteFevrier || { montant: '', quittance: '' });
    setLocalChiffreAffaires(chiffreAffairesAnnuel || 0);
    
    if (etablissements && etablissements.length > 0) {
      setLocalEtablissements(etablissements);
    } else if (localEtablissements.length === 0) {
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

  const handleAcompteFevrierChange = (payment: IGSPayment) => {
    setAcompteFevrierState(payment);
    onChange("igs.acompteFevrier", payment);
  };

  const handleChiffreAffairesChange = (value: number) => {
    setLocalChiffreAffaires(value);
    onChange("igs.chiffreAffairesAnnuel", value);
  };

  const handleEtablissementsChange = (value: Etablissement[]) => {
    setLocalEtablissements(value);
    onChange("igs.etablissements", value);
    
    const totalChiffreAffaires = value.reduce(
      (sum, etab) => sum + (etab.chiffreAffaires || 0), 
      0
    );
    handleChiffreAffairesChange(totalChiffreAffaires);
  };

  const handleTotalChange = (total: number) => {
    handleChiffreAffairesChange(total);
    
    const newClasse = determineIGSClassFromCA(total);
    onChange("igs.classeIGS", newClasse);
  };

  return {
    soumisIGS,
    adherentCGA,
    classeIGS,
    patenteState,
    acompteJanvierState,
    acompteFevrierState,
    localChiffreAffaires,
    localEtablissements,
    onSoumisIGSChange: (checked: boolean) => onChange("igs.soumisIGS", checked),
    onAdherentCGAChange: (checked: boolean) => onChange("igs.adherentCGA", checked),
    onClasseIGSChange: (value: CGAClasse) => onChange("igs.classeIGS", value),
    handlePatenteChange,
    handleAcompteJanvierChange,
    handleAcompteFevrierChange,
    handleChiffreAffairesChange,
    handleEtablissementsChange,
    handleTotalChange
  };
}
