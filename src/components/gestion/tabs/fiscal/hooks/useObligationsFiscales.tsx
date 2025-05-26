
import { useState, useEffect, useRef } from "react";
import { parse, isValid, format, addMonths, differenceInDays } from "date-fns";
import { toast } from "sonner";
import { ObligationType, ObligationStatuses, ClientFiscalData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { Json } from "@/integrations/supabase/types";

// Cache pour les données fiscales des clients
const fiscalDataCache = new Map<string, {data: any, timestamp: number}>();
// Durée de validité du cache en ms (1 minute)
const CACHE_DURATION = 60000;

export function useObligationsFiscales(client: Client) {
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const isMounted = useRef(true);
  
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({
    patente: { assujetti: true, paye: false },
    bail: { assujetti: false, paye: false },
    taxeFonciere: { assujetti: false, paye: false },
    dsf: { assujetti: true, depose: false },
    darp: { assujetti: false, depose: false }
  });

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load client's fiscal data from database
  useEffect(() => {
    async function loadFiscalData() {
      if (!client || !client.id) return;
      
      setIsLoading(true);
      
      // Vérifier le cache
      const now = Date.now();
      const cachedData = fiscalDataCache.get(client.id);
      
      if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
        console.log(`Utilisation du cache pour les données fiscales du client ${client.id}`);
        
        const fiscalData = cachedData.data as ClientFiscalData;
        
        if (fiscalData.attestation) {
          if (isMounted.current) {
            setCreationDate(fiscalData.attestation.creationDate || "");
            setValidityEndDate(fiscalData.attestation.validityEndDate || "");
            setShowInAlert(fiscalData.attestation.showInAlert !== false);
          }
        }
        
        if (fiscalData.obligations && isMounted.current) {
          setObligationStatuses(fiscalData.obligations);
        }
        
        if (isMounted.current) {
          setIsLoading(false);
        }
        return;
      }
      
      try {
        console.log(`Chargement des données fiscales pour le client ID: ${client.id}`);
        const { data: clientData, error } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", client.id)
          .single();

        if (error) {
          console.error("Error loading fiscal data:", error);
          return;
        }

        if (clientData && clientData.fiscal_data) {
          console.log("Fiscal data loaded:", clientData.fiscal_data);
          // Cast the JSON data to our ClientFiscalData type
          const fiscalData = clientData.fiscal_data as Json as unknown as ClientFiscalData;
          
          // Mettre à jour le cache
          fiscalDataCache.set(client.id, {
            data: fiscalData,
            timestamp: now
          });
          
          if (fiscalData.attestation && isMounted.current) {
            console.log("Attestation data found:", fiscalData.attestation);
            setCreationDate(fiscalData.attestation.creationDate || "");
            setValidityEndDate(fiscalData.attestation.validityEndDate || "");
            setShowInAlert(fiscalData.attestation.showInAlert !== false); // Si non défini, par défaut à true
          } else {
            console.log("No attestation data found for client");
          }
          
          if (fiscalData.obligations && isMounted.current) {
            setObligationStatuses(fiscalData.obligations);
          }
        } else {
          console.log("No fiscal data found for client");
        }
      } catch (error) {
        console.error("Error loading fiscal data:", error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    }

    if (client && client.id) {
      loadFiscalData();
    }
  }, [client]);

  // Calculate end date when creation date changes
  useEffect(() => {
    if (creationDate) {
      try {
        // Date format is DD/MM/YYYY
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        
        if (datePattern.test(creationDate)) {
          const parsedDate = parse(creationDate, 'dd/MM/yyyy', new Date());
          
          if (isValid(parsedDate)) {
            // Calculate end date - 3 months after creation date
            const endDate = addMonths(parsedDate, 3);
            
            // Format the end date as DD/MM/YYYY
            setValidityEndDate(format(endDate, 'dd/MM/yyyy'));
            
            const today = new Date();
            const daysUntilExpiration = differenceInDays(endDate, today);
            
            if (daysUntilExpiration <= 5 && daysUntilExpiration >= 0) {
              toast.warning(`L'Attestation de Conformité Fiscale expire dans ${daysUntilExpiration} jour${daysUntilExpiration > 1 ? 's' : ''}.`);
            } else if (daysUntilExpiration < 0) {
              toast.error(`L'Attestation de Conformité Fiscale est expirée depuis ${Math.abs(daysUntilExpiration)} jour${Math.abs(daysUntilExpiration) > 1 ? 's' : ''}.`);
            }
          } else {
            console.error("Invalid date format:", creationDate);
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
    setObligationStatuses(prev => ({
      ...prev,
      [obligationType]: {
        ...prev[obligationType],
        [statusType]: value
      }
    }));
  };

  const handleToggleAlert = (value: boolean) => {
    setShowInAlert(value);
  };

  const handleSave = async () => {
    if (!client || !client.id) {
      toast.error("Impossible d'enregistrer les données: client non sélectionné");
      return;
    }

    try {
      console.log(`Saving fiscal data for client ID: ${client.id}`);
      // Prepare the fiscal data in the format expected by our database
      const fiscalDataToSave: ClientFiscalData = {
        attestation: {
          creationDate,
          validityEndDate,
          showInAlert
        },
        obligations: obligationStatuses
      };

      console.log("Fiscal data to save:", fiscalDataToSave);

      // Mettre à jour le cache immédiatement pour une UX plus réactive
      fiscalDataCache.set(client.id, {
        data: fiscalDataToSave,
        timestamp: Date.now()
      });

      // Convert to Json type for database storage
      const { error } = await supabase
        .from("clients")
        .update({ fiscal_data: fiscalDataToSave as unknown as Json })
        .eq("id", client.id);

      if (error) {
        console.error("Error saving fiscal data:", error);
        toast.error("Erreur lors de l'enregistrement des données fiscales");
        return;
      }
      
      toast.success("Les informations fiscales ont été mises à jour.");
    } catch (error) {
      console.error("Error saving fiscal data:", error);
      toast.error("Erreur lors de l'enregistrement des données fiscales");
    }
  };

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    obligationStatuses,
    handleStatusChange,
    handleSave,
    isLoading,
    showInAlert,
    handleToggleAlert
  };
}
