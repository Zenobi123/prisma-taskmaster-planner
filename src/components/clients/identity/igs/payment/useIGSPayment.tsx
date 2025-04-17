
import { useState, useEffect, useMemo } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import { igsClassesInfo } from "../IGSClassSelector";

interface UseIGSPaymentProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onChange: (name: string, value: any) => void;
}

export function useIGSPayment({
  soumisIGS,
  adherentCGA,
  classeIGS,
  patente,
  acompteJanvier,
  acompteFevrier,
  onChange
}: UseIGSPaymentProps) {
  const [patenteState, setPatenteState] = useState<IGSPayment>(patente);
  const [acompteJanvierState, setAcompteJanvierState] = useState<IGSPayment>(acompteJanvier);
  const [acompteFevrierState, setAcompteFevrierState] = useState<IGSPayment>(acompteFevrier);
  const [reliquat, setReliquat] = useState<number | null>(null);
  const [showPayments, setShowPayments] = useState(false);

  // Initialize states with props when they change
  useEffect(() => {
    setPatenteState(patente);
    setAcompteJanvierState(acompteJanvier);
    setAcompteFevrierState(acompteFevrier);
  }, [patente, acompteJanvier, acompteFevrier]);

  // Calculate IGS amount based on class
  const montantIGS = useMemo(() => {
    if (soumisIGS && classeIGS && igsClassesInfo[classeIGS]) {
      let baseAmount = igsClassesInfo[classeIGS].montant;
      
      // Apply 50% reduction if CGA member
      if (adherentCGA) {
        baseAmount = baseAmount * 0.5;
      }
      
      return baseAmount;
    }
    return null;
  }, [soumisIGS, classeIGS, adherentCGA]);

  // Calculate IGS remainder
  useEffect(() => {
    if (montantIGS !== null) {
      const patenteValue = parseFloat(patenteState.montant) || 0;
      const janvierValue = parseFloat(acompteJanvierState.montant) || 0;
      const fevrierValue = parseFloat(acompteFevrierState.montant) || 0;
      
      const reliquatValue = montantIGS - patenteValue - janvierValue - fevrierValue;
      setReliquat(reliquatValue > 0 ? reliquatValue : 0);
    } else {
      setReliquat(null);
    }
  }, [montantIGS, patenteState.montant, acompteJanvierState.montant, acompteFevrierState.montant]);

  // Handle payment value changes
  const handlePaymentChange = (
    field: 'patente' | 'acompteJanvier' | 'acompteFevrier',
    type: 'montant' | 'quittance',
    value: string
  ) => {
    let updatedPayment: IGSPayment;
    
    switch (field) {
      case 'patente':
        updatedPayment = { ...patenteState, [type]: value };
        setPatenteState(updatedPayment);
        onChange("igs.patente", updatedPayment);
        break;
      case 'acompteJanvier':
        updatedPayment = { ...acompteJanvierState, [type]: value };
        setAcompteJanvierState(updatedPayment);
        onChange("igs.acompteJanvier", updatedPayment);
        break;
      case 'acompteFevrier':
        updatedPayment = { ...acompteFevrierState, [type]: value };
        setAcompteFevrierState(updatedPayment);
        onChange("igs.acompteFevrier", updatedPayment);
        break;
    }
  };

  return {
    patenteState,
    acompteJanvierState,
    acompteFevrierState,
    reliquat,
    showPayments,
    setShowPayments,
    handlePaymentChange,
    montantIGS
  };
}
