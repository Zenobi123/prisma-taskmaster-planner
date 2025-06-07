
import { useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { invalidateClientsCache } from "@/services/clientService";

interface UseFiscalDataLoaderProps {
  selectedClient: Client;
  fiscalYear: string;
  setCreationDate: (date: string) => void;
  setValidityEndDate: (date: string) => void;
  setShowInAlert: (show: boolean) => void;
  setHiddenFromDashboard: (hidden: boolean) => void;
  setFiscalYear: (year: string) => void;
  setObligationStatuses: (statuses: ObligationStatuses | ((prev: ObligationStatuses) => ObligationStatuses)) => void;
  getDefaultObligationStatuses: () => ObligationStatuses;
}

export const useFiscalDataLoader = ({
  selectedClient,
  fiscalYear,
  setCreationDate,
  setValidityEndDate,
  setShowInAlert,
  setHiddenFromDashboard,
  setFiscalYear,
  setObligationStatuses,
  getDefaultObligationStatuses
}: UseFiscalDataLoaderProps) => {
  useEffect(() => {
    const loadFiscalData = async () => {
      if (!selectedClient?.id) return;
      
      try {
        console.log("Loading fiscal data for client:", selectedClient.id);
        
        // Invalider le cache pour s'assurer d'obtenir les données les plus récentes
        invalidateClientsCache();
        
        const { data: client, error } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();

        if (error) {
          console.error("Erreur lors du chargement des données fiscales:", error);
          // En cas d'erreur, appliquer les règles par défaut
          console.log("Applying default rules due to error");
          setObligationStatuses(getDefaultObligationStatuses());
          return;
        }

        // Toujours appliquer les règles par défaut en premier
        const defaultStatuses = getDefaultObligationStatuses();
        console.log("Applied default rules based on client profile");

        if (client?.fiscal_data && typeof client.fiscal_data === 'object') {
          const fiscalData = client.fiscal_data as any;
          console.log("Loaded fiscal data:", fiscalData);
          
          // Charger les données d'attestation
          if (fiscalData.attestation) {
            setCreationDate(fiscalData.attestation.creationDate || "2025-07-01");
            setValidityEndDate(fiscalData.attestation.validityEndDate || "");
            setShowInAlert(fiscalData.attestation.showInAlert !== false);
          }
          
          // Charger les paramètres de tableau de bord
          if (fiscalData.hiddenFromDashboard !== undefined) {
            setHiddenFromDashboard(!!fiscalData.hiddenFromDashboard);
          }
          
          // Charger l'année sélectionnée
          if (fiscalData.selectedYear) {
            setFiscalYear(fiscalData.selectedYear);
          }
          
          // Fusionner les obligations existantes avec les règles par défaut
          if (fiscalData.obligations && fiscalData.obligations[fiscalYear]) {
            console.log("Merging existing obligations with default rules for year:", fiscalYear);
            const existingObligations = fiscalData.obligations[fiscalYear];
            
            // Créer un objet fusionné : règles par défaut + données existantes
            const mergedObligations: ObligationStatuses = { ...defaultStatuses };
            
            // Pour chaque obligation, fusionner les données existantes avec les valeurs par défaut
            Object.keys(defaultStatuses).forEach(obligationType => {
              const existingObligation = existingObligations[obligationType];
              const defaultObligation = defaultStatuses[obligationType as keyof ObligationStatuses];
              
              if (existingObligation) {
                // Fusionner en gardant l'assujettissement par défaut mais les autres données existantes
                mergedObligations[obligationType as keyof ObligationStatuses] = {
                  ...defaultObligation,
                  ...existingObligation,
                  // Forcer l'assujettissement selon les règles par défaut
                  assujetti: defaultObligation.assujetti
                } as any;
                
                // Si les règles par défaut disent "non assujetti", forcer payee/depose à false
                if (!defaultObligation.assujetti) {
                  if ('payee' in mergedObligations[obligationType as keyof ObligationStatuses]) {
                    (mergedObligations[obligationType as keyof ObligationStatuses] as any).payee = false;
                  }
                  if ('depose' in mergedObligations[obligationType as keyof ObligationStatuses]) {
                    (mergedObligations[obligationType as keyof ObligationStatuses] as any).depose = false;
                  }
                }
              }
            });
            
            console.log("Merged obligations:", mergedObligations);
            setObligationStatuses(mergedObligations);
          } else {
            // Si aucune donnée n'existe pour cette année, utiliser les règles par défaut
            console.log("No existing data for year, using default rules");
            setObligationStatuses(defaultStatuses);
          }
        } else {
          // Si aucune donnée fiscale n'existe, utiliser les règles par défaut
          console.log("No fiscal data exists, using default rules");
          setObligationStatuses(defaultStatuses);
        }
      } catch (error) {
        console.error("Exception lors du chargement des données fiscales:", error);
        // En cas d'erreur, appliquer les règles par défaut
        console.log("Applying default rules due to exception");
        setObligationStatuses(getDefaultObligationStatuses());
      }
    };

    loadFiscalData();
  }, [selectedClient?.id, selectedClient?.regimefiscal, selectedClient?.type, selectedClient?.situationimmobiliere?.type, fiscalYear]);
};
