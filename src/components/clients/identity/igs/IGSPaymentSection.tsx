
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
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  completedPayments?: string[];
  onChange: (name: string, value: any) => void;
}

export function IGSPaymentSection({
  soumisIGS,
  adherentCGA,
  classeIGS,
  acompteJanvier,
  acompteFevrier,
  completedPayments = [],
  onChange
}: IGSPaymentSectionProps) {
  const {
    acompteJanvierState,
    acompteFevrierState,
    reliquat,
    handlePaymentChange,
    montantIGS,
    completedPayments: paymentsList,
  } = useIGSPayment({
    soumisIGS,
    adherentCGA,
    classeIGS,
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
      <h4 className="font-medium">Suivi des paiements</h4>
      
      <IGSPaymentAlerts />
      
      <IGSPaymentForm
        acompteJanvier={acompteJanvierState}
        acompteFevrier={acompteFevrierState}
        handlePaymentChange={handlePaymentChange}
      />
      
      <IGSReliquatDisplay reliquat={reliquat} />
    </div>
  );
}
