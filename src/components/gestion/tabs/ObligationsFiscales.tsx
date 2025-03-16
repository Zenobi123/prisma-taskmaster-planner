
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { parse, isValid, format, addMonths, differenceInDays } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { FiscalAttestationSection } from "./fiscal/FiscalAttestationSection";
import { AnnualObligationsSection } from "./fiscal/AnnualObligationsSection";
import { Client } from "@/types/client";

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

interface ObligationsFiscalesProps {
  selectedClient: Client;
}

export function ObligationsFiscales({ selectedClient }: ObligationsFiscalesProps) {
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
        // Date format is DD/MM/YYYY
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (datePattern.test(creationDate)) {
          const parsedDate = parse(creationDate, 'dd/MM/yyyy', new Date());
          
          if (isValid(parsedDate)) {
            // Store with client ID to make it client-specific
            localStorage.setItem(`fiscalAttestationCreationDate_${selectedClient.id}`, creationDate);
            
            // Calculate end date - 3 months after creation date
            const endDate = addMonths(parsedDate, 3);
            
            // Format the end date as DD/MM/YYYY
            setValidityEndDate(format(endDate, 'dd/MM/yyyy'));
            
            const today = new Date();
            const daysUntilExpiration = differenceInDays(endDate, today);
            
            if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
              const clientName = selectedClient.type === "physique" 
                ? selectedClient.nom 
                : selectedClient.raisonsociale;
                
              toast({
                title: "Attention",
                description: `L'Attestation de Conformité Fiscale de ${clientName} expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`,
                variant: "destructive",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error calculating validity end date:", error);
      }
    }
  }, [creationDate, selectedClient]);

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
      
      // Store with client ID to make it client-specific
      localStorage.setItem(
        `fiscal${obligationType.charAt(0).toUpperCase() + obligationType.slice(1)}${statusType.charAt(0).toUpperCase() + statusType.slice(1)}_${selectedClient.id}`, 
        value.toString()
      );
      
      return newState;
    });
  };

  const handleSave = () => {
    // Save all data to localStorage with client ID to make it client-specific
    Object.keys(obligationStatuses).forEach((key) => {
      const obligationType = key as ObligationType;
      const obligation = obligationStatuses[obligationType];
      
      if ('paye' in obligation) {
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti_${selectedClient.id}`, 
          obligation.assujetti.toString()
        );
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye_${selectedClient.id}`, 
          obligation.paye.toString()
        );
      } else if ('depose' in obligation) {
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti_${selectedClient.id}`, 
          obligation.assujetti.toString()
        );
        localStorage.setItem(
          `fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose_${selectedClient.id}`, 
          obligation.depose.toString()
        );
      }
    });
    
    if (creationDate) {
      localStorage.setItem(`fiscalAttestationCreationDate_${selectedClient.id}`, creationDate);
    }
    
    // Show success toast
    toast({
      title: "Modifications enregistrées",
      description: "Les informations fiscales ont été mises à jour.",
      variant: "default",
    });
  };

  useEffect(() => {
    // Reset form when client changes
    const savedObligations: Partial<ObligationStatuses> = {};
    
    Object.keys(obligationStatuses).forEach((key) => {
      const obligationType = key as ObligationType;
      const obligation = obligationStatuses[obligationType];
      
      // Load client-specific data
      const savedAssujetti = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Assujetti_${selectedClient.id}`);
      
      if (savedAssujetti !== null) {
        if ('paye' in obligation) {
          const savedPaye = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Paye_${selectedClient.id}`);
          savedObligations[obligationType] = {
            assujetti: savedAssujetti === 'true',
            paye: savedPaye === 'true'
          } as any;
        } else if ('depose' in obligation) {
          const savedDepose = localStorage.getItem(`fiscal${key.charAt(0).toUpperCase() + key.slice(1)}Depose_${selectedClient.id}`);
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
    
    // Load client-specific creation date
    const savedCreationDate = localStorage.getItem(`fiscalAttestationCreationDate_${selectedClient.id}`);
    if (savedCreationDate) {
      setCreationDate(savedCreationDate);
    } else {
      // Reset if no saved data for this client
      setCreationDate("");
      setValidityEndDate("");
    }
  }, [selectedClient]);

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
          handleSave={handleSave}
        />
        
        <AnnualObligationsSection 
          obligationStatuses={obligationStatuses}
          handleStatusChange={handleStatusChange}
        />
      </CardContent>
    </Card>
  );
}
