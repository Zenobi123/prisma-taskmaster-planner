import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { parse, isValid, format, addMonths, differenceInDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";

export type ObligationType = "patente" | "bail" | "taxeFonciere" | "dsf" | "darp";

export interface TaxObligationStatus {
  assujetti: boolean;
  paye: boolean;
}

export interface DeclarationObligationStatus {
  assujetti: boolean;
  depose: boolean;
}

export type ObligationStatus = TaxObligationStatus | DeclarationObligationStatus;

export type ObligationStatuses = {
  patente: TaxObligationStatus;
  bail: TaxObligationStatus;
  taxeFonciere: TaxObligationStatus;
  dsf: DeclarationObligationStatus;
  darp: DeclarationObligationStatus;
};

export function ObligationsFiscales() {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: true, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: true, depose: false },
    darp: { assujetti: false, depose: false }
  });

  useEffect(() => {
    if (creationDate) {
      try {
        const parsedDate = parse(creationDate, 'dd/MM/yy', new Date());
        if (isValid(parsedDate)) {
          localStorage.setItem('fiscalAttestationCreationDate', creationDate);
          
          const endDate = addMonths(parsedDate, 3);
          
          setValidityEndDate(format(endDate, 'dd/MM/yy'));
          
          const today = new Date();
          const daysUntilExpiration = differenceInDays(endDate, today);
          
          if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
            toast({
              title: "Attention",
              description: `L'Attestation de Conformité Fiscale expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`,
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error calculating validity end date:", error);
      }
    }
  }, [creationDate]);

  const handleStatusChange = (
    obligationType: ObligationType, 
    statusType: "assujetti" | "paye" | "depose", 
    value: boolean
  ) => {
    setObligationStatuses(prev => {
      const newState = {
        ...prev,
        [obligationType]: {
          ...prev[obligationType],
          [statusType]: value
        }
      };
      
      localStorage.setItem(
        `fiscal${obligationType.charAt(0).toUpperCase() + obligationType.slice(1)}${statusType.charAt(0).toUpperCase() + statusType.slice(1)}`, 
        value.toString()
      );
      
      return newState;
    });
  };

  useEffect(() => {
    const savedObligations: Partial<ObligationStatuses> = {};
    
    Object.keys(obligationStatuses).forEach((key) => {
      const obligationType = key as ObligationType;
      const obligation = obligationStatuses[obligationType];
      
      const savedAssujetti = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti`);
      
      if (savedAssujetti !== null) {
        if ('paye' in obligation) {
          const savedPaye = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye`);
          savedObligations[obligationType] = {
            assujetti: savedAssujetti === 'true',
            paye: savedPaye === 'true'
          } as any;
        } else if ('depose' in obligation) {
          const savedDepose = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose`);
          savedObligations[obligationType] = {
            assujetti: savedAssujetti === 'true',
            depose: savedDepose === 'true'
          } as any;
        }
      }
    });
    
    if (Object.keys(savedObligations).length > 0) {
      setObligationStatuses(prev => ({
        ...prev,
        ...savedObligations
      }));
    }
    
    const savedCreationDate = localStorage.getItem('fiscalAttestationCreationDate');
    if (savedCreationDate) {
      setCreationDate(savedCreationDate);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Obligations fiscales</CardTitle>
        <CardDescription>
          Suivi des obligations fiscales de l'entreprise
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FiscalAttestationSection 
          creationDate={creationDate}
          validityEndDate={validityEndDate}
          setCreationDate={setCreationDate}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
}
