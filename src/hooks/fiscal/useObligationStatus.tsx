
import { useState, useEffect, useCallback } from "react";
import { ObligationStatuses } from "./types";
import { useToast } from "@/components/ui/use-toast";

export function useObligationStatus(fiscalData: any, isLoading: boolean) {
  const { toast } = useToast();
  
  // State for fiscal obligations - ensure all properties are initialized
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: false, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
    tva: { assujetti: false, paye: false },
    cnps: { assujetti: false, paye: false }
  });

  // Initialize obligations when fiscal data changes
  useEffect(() => {
    if (isLoading || !fiscalData) return;
    
    try {
      // Initialize obligations with default values for any missing properties
      if (fiscalData?.obligations) {
        const defaultObligations: ObligationStatuses = {
          patente: { assujetti: false, paye: false },
          bail: { assujetti: false, paye: false },
          taxeFonciere: { assujetti: false, paye: false },
          dsf: { assujetti: false, depose: false },
          darp: { assujetti: false, depose: false },
          tva: { assujetti: false, paye: false },
          cnps: { assujetti: false, paye: false }
        };
        
        // Merge existing obligations with defaults to ensure all properties exist
        setObligationStatuses({
          ...defaultObligations,
          ...fiscalData.obligations
        });
      }
    } catch (error) {
      console.error("Error initializing obligation statuses:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statuts d'obligation",
        variant: "destructive"
      });
    }
  }, [fiscalData, isLoading, toast]);
  
  // Handle obligation status changes
  const handleStatusChange = useCallback((
    obligationType: keyof ObligationStatuses,
    status: any
  ) => {
    setObligationStatuses(prev => ({
      ...prev,
      [obligationType]: status
    }));
  }, []);

  return { obligationStatuses, handleStatusChange };
}
