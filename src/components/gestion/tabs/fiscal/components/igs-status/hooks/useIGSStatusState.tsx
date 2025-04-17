
import { useState, useEffect } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/types/client";

interface IGSStatusStateProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  chiffreAffairesAnnuel?: number;
  etablissements?: any[];
  completedPayments?: string[];
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
  completedPayments = [],
  onChange
}: IGSStatusStateProps) {
  const [localSoumisIGS, setLocalSoumisIGS] = useState(soumisIGS);
  const [localAdherentCGA, setLocalAdherentCGA] = useState(adherentCGA);
  const [localClasseIGS, setLocalClasseIGS] = useState<CGAClasse | undefined>(classeIGS);
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
  const [localChiffreAffaires, setLocalChiffreAffaires] = useState<number>(chiffreAffairesAnnuel);
  const [localEtablissements, setLocalEtablissements] = useState<any[]>(etablissements);
  const [localCompletedPayments, setLocalCompletedPayments] = useState<string[]>(completedPayments);

  // Mettre à jour les états locaux lorsque les props changent
  useEffect(() => {
    setLocalSoumisIGS(soumisIGS);
    setLocalAdherentCGA(adherentCGA);
    setLocalClasseIGS(classeIGS);
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
    setLocalChiffreAffaires(chiffreAffairesAnnuel);
    setLocalEtablissements(Array.isArray(etablissements) ? etablissements : []);
    setLocalCompletedPayments(Array.isArray(completedPayments) ? completedPayments : []);
  }, [soumisIGS, adherentCGA, classeIGS, patente, acompteJanvier, acompteFevrier, chiffreAffairesAnnuel, etablissements, completedPayments]);

  // Handler pour le changement de soumisIGS
  const onSoumisIGSChange = (checked: boolean) => {
    setLocalSoumisIGS(checked);
    onChange("igs.soumisIGS", checked);
  };

  // Handler pour le changement de adherentCGA
  const onAdherentCGAChange = (checked: boolean) => {
    setLocalAdherentCGA(checked);
    onChange("igs.adherentCGA", checked);
  };

  // Handler pour le changement de classeIGS
  const onClasseIGSChange = (value: CGAClasse) => {
    setLocalClasseIGS(value);
    onChange("igs.classeIGS", value);
  };

  // Handler pour le changement de patente
  const handlePatenteChange = (field: "montant" | "quittance", value: string) => {
    const updatedPatente = { ...patenteState, [field]: value };
    setPatenteState(updatedPatente);
    onChange("igs.patente", updatedPatente);
  };

  // Handler pour le changement de acompteJanvier
  const handleAcompteJanvierChange = (field: "montant" | "quittance", value: string) => {
    const updatedAcompte = { ...acompteJanvierState, [field]: value };
    setAcompteJanvierState(updatedAcompte);
    onChange("igs.acompteJanvier", updatedAcompte);
  };

  // Handler pour le changement de acompteFevrier
  const handleAcompteFevrierChange = (field: "montant" | "quittance", value: string) => {
    const updatedAcompte = { ...acompteFevrierState, [field]: value };
    setAcompteFevrierState(updatedAcompte);
    onChange("igs.acompteFevrier", updatedAcompte);
  };

  // Handler pour le changement de chiffre d'affaires
  const handleChiffreAffairesChange = (value: number) => {
    setLocalChiffreAffaires(value);
    onChange("igs.chiffreAffairesAnnuel", value);
  };

  // Handler pour le changement des établissements
  const handleEtablissementsChange = (etablissements: any[]) => {
    setLocalEtablissements(etablissements);
    onChange("igs.etablissements", etablissements);
  };

  // Handler pour le changement des paiements complétés
  const handleCompletedPaymentsChange = (payments: string[]) => {
    setLocalCompletedPayments(payments);
    onChange("igs.completedPayments", payments);
  };

  // Handler pour le montant total
  const handleTotalChange = (value: string) => {
    // Cette fonction est utilisée par l'ancien système, on la garde pour compatibilité
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
