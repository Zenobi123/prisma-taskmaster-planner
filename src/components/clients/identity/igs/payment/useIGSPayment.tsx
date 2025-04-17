
import { useState, useEffect, useMemo } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import { calculateIGSAmount, calculateIGSReliquat } from "../utils/igsCalculations";

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
  const montantIGS = useMemo(() => 
    calculateIGSAmount(soumisIGS, classeIGS, adherentCGA),
  [soumisIGS, classeIGS, adherentCGA]);

  // Calculate IGS remainder
  useEffect(() => {
    const calculatedReliquat = calculateIGSReliquat(
      montantIGS,
      patenteState,
      acompteJanvierState,
      acompteFevrierState
    );
    setReliquat(calculatedReliquat);
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
