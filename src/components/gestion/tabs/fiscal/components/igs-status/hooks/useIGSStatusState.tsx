
import { useState, useEffect } from "react";
import { CGAClasse } from "@/types/client";
import { Etablissement, IGSPayment } from "@/hooks/fiscal/types/igsTypes";

interface UseIGSStatusStateProps {
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
  soumisIGS,
  adherentCGA,
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  chiffreAffairesAnnuel = 0,
  etablissements = [],
  onChange
}: UseIGSStatusStateProps) {
  // États locaux pour gérer les valeurs
  const [localSoumisIGS, setLocalSoumisIGS] = useState<boolean>(soumisIGS);
  const [localAdherentCGA, setLocalAdherentCGA] = useState<boolean>(adherentCGA);
  const [localClasseIGS, setLocalClasseIGS] = useState<CGAClasse | undefined>(classeIGS);
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
  const [localChiffreAffaires, setLocalChiffreAffaires] = useState<number>(chiffreAffairesAnnuel || 0);
  const [localEtablissements, setLocalEtablissements] = useState<Etablissement[]>(
    etablissements.length > 0 ? etablissements : [{
      nom: "Établissement principal",
      activite: "",
      ville: "",
      departement: "",
      quartier: "",
      chiffreAffaires: 0
    }]
  );
  const [localCompletedPayments, setLocalCompletedPayments] = useState<string[]>([]);

  // Synchroniser les états locaux avec les props
  useEffect(() => {
    console.log("IGSStatusSection - Initialisation des états avec les props");
    setLocalSoumisIGS(soumisIGS);
    setLocalAdherentCGA(adherentCGA);
    setLocalClasseIGS(classeIGS);
    setPatenteState(patente || { montant: '', quittance: '' });
    setAcompteJanvierState(acompteJanvier || { montant: '', quittance: '' });
    setAcompteFevrierState(acompteFevrier || { montant: '', quittance: '' });
    setLocalChiffreAffaires(chiffreAffairesAnnuel || 0);
    
    // Initialiser les établissements avec au moins un établissement par défaut
    if (etablissements && etablissements.length > 0) {
      setLocalEtablissements(etablissements);
    }
  }, [
    soumisIGS, 
    adherentCGA, 
    classeIGS, 
    patente, 
    acompteJanvier, 
    acompteFevrier, 
    chiffreAffairesAnnuel, 
    etablissements
  ]);

  // Handlers pour les changements de valeurs
  const onSoumisIGSChange = (checked: boolean) => {
    setLocalSoumisIGS(checked);
    onChange("igs.soumisIGS", checked);
  };

  const onAdherentCGAChange = (checked: boolean) => {
    setLocalAdherentCGA(checked);
    onChange("igs.adherentCGA", checked);
  };

  const onClasseIGSChange = (value: CGAClasse) => {
    setLocalClasseIGS(value);
    onChange("igs.classeIGS", value);
  };

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
  };

  const handleTotalChange = (total: number) => {
    handleChiffreAffairesChange(total);
  };

  const handleCompletedPaymentsChange = (payments: string[]) => {
    setLocalCompletedPayments(payments);
    onChange("igs.completedPayments", payments);
  };

  return {
    localSoumisIGS,
    localAdherentCGA,
    localClasseIGS,
    patenteState,
    acompteJanvierState,
    acompteFevrierState,
    localChiffreAffaires,
    localEtablissements,
    localCompletedPayments,
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
  };
}
