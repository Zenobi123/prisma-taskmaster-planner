
import { useState } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import {
  IGSPaymentAlerts,
  IGSPaymentForm,
  IGSReliquatDisplay,
  IGSPaymentToggle,
  useIGSPayment
} from "./payment";

interface IGSPaymentSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  onChange: (name: string, value: any) => void;
}

export function IGSPaymentSection({
  soumisIGS,
  adherentCGA,
  classeIGS,
  patente,
  acompteJanvier,
  acompteFevrier,
  onChange
}: IGSPaymentSectionProps) {
  const {
    patenteState,
    acompteJanvierState,
    acompteFevrierState,
    reliquat,
    showPayments,
    setShowPayments,
    handlePaymentChange,
    montantIGS
  } = useIGSPayment({
    soumisIGS,
    adherentCGA,
    classeIGS,
    patente,
    acompteJanvier,
    acompteFevrier,
    onChange
  });

  if (!soumisIGS || !montantIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {/* Toggle to activate payments and deductions */}
      <IGSPaymentToggle 
        showPayments={showPayments} 
        setShowPayments={setShowPayments} 
      />
      
      {showPayments && (
        <>
          <h4 className="font-medium">Paiements et déductions</h4>
          
          {/* Alerts for payment information */}
          <IGSPaymentAlerts />
          
          {/* Payment form for patente and advances */}
          <IGSPaymentForm
            patente={patenteState}
            acompteJanvier={acompteJanvierState}
            acompteFevrier={acompteFevrierState}
            handlePaymentChange={handlePaymentChange}
          />
          
          {/* Display of the IGS remainder to pay */}
          <IGSReliquatDisplay reliquat={reliquat} />
        </>
      )}
    </div>
  );
}
