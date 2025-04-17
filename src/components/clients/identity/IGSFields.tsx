
import { useState, useEffect } from "react";
import { CGAClasse } from "@/hooks/fiscal/types";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import {
  IGSToggleSection,
  IGSClassSelector,
  IGSAmountDisplay,
  IGSPaymentSection
} from "./igs";

interface IGSFieldsProps {
  soumisIGS?: boolean;
  adherentCGA?: boolean;
  classeIGS?: CGAClasse;
  patente?: IGSPayment;
  acompteJanvier?: IGSPayment;
  acompteFevrier?: IGSPayment;
  completedPayments?: string[];
  onChange: (name: string, value: any) => void;
  hidePayments?: boolean;
}

export function IGSFields({ 
  soumisIGS = false, 
  adherentCGA = false, 
  classeIGS,
  patente = { montant: '', quittance: '' },
  acompteJanvier = { montant: '', quittance: '' },
  acompteFevrier = { montant: '', quittance: '' },
  completedPayments = [],
  onChange,
  hidePayments = false
}: IGSFieldsProps) {
  return (
    <div className="space-y-4 mt-6 border-t pt-4">
      <IGSToggleSection 
        soumisIGS={soumisIGS}
        adherentCGA={adherentCGA}
        onChange={onChange}
      />

      {soumisIGS && (
        <>
          <IGSClassSelector 
            classeIGS={classeIGS}
            onChange={onChange}
          />

          <IGSAmountDisplay 
            soumisIGS={soumisIGS}
            classeIGS={classeIGS}
            adherentCGA={adherentCGA}
          />
          
          {!hidePayments && (
            <IGSPaymentSection
              soumisIGS={soumisIGS}
              adherentCGA={adherentCGA}
              classeIGS={classeIGS}
              patente={patente}
              acompteJanvier={acompteJanvier}
              acompteFevrier={acompteFevrier}
              completedPayments={completedPayments}
              onChange={onChange}
            />
          )}
        </>
      )}
    </div>
  );
}
