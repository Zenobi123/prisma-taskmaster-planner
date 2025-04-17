
import { useState } from "react";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { CGAClasse } from "@/hooks/fiscal/types";
import {
  IGSPaymentAlerts,
  IGSPaymentForm,
  IGSReliquatDisplay,
  useIGSPayment
} from "./payment";

interface IGSPaymentSectionProps {
  soumisIGS: boolean;
  adherentCGA: boolean;
  classeIGS?: CGAClasse;
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  completedPayments?: string[];
  onChange: (name: string, value: any) => void;
}

export function IGSPaymentSection({
  soumisIGS,
  adherentCGA,
  classeIGS,
  patente,
  acompteJanvier,
  acompteFevrier,
  completedPayments = [],
  onChange
}: IGSPaymentSectionProps) {
  const {
    patenteState,
    acompteJanvierState,
    acompteFevrierState,
    reliquat,
    handlePaymentChange,
    montantIGS,
    completedPayments: paymentsList,
    handlePaymentToggle
  } = useIGSPayment({
    soumisIGS,
    adherentCGA,
    classeIGS,
    patente,
    acompteJanvier,
    acompteFevrier,
    completedPayments,
    onChange
  });

  if (!soumisIGS || !montantIGS) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-medium">Paiements et déductions</h4>
      
      <IGSPaymentAlerts />
      
      <IGSPaymentForm
        patente={patenteState}
        acompteJanvier={acompteJanvierState}
        acompteFevrier={acompteFevrierState}
        handlePaymentChange={handlePaymentChange}
      />
      
      <IGSReliquatDisplay reliquat={reliquat} />
    </div>
  );
}
