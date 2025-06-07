
import { useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { supabase } from "@/integrations/supabase/client";

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
        const { data: client, error } = await supabase
          .from("clients")
          .select("fiscal_data")
          .eq("id", selectedClient.id)
          .single();

        if (error) {
          console.error("Erreur lors du chargement des données fiscales:", error);
          return;
        }

        if (client?.fiscal_data && typeof client.fiscal_data === 'object') {
          const fiscalData = client.fiscal_data as any;
          
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
          
          // Charger les obligations pour l'année courante
          if (fiscalData.obligations && fiscalData.obligations[fiscalYear]) {
            console.log("Loading existing obligations for year:", fiscalYear);
            const yearObligations = fiscalData.obligations[fiscalYear];
            setObligationStatuses(prev => ({
              ...prev,
              ...yearObligations
            }));
          } else {
            // Si aucune donnée n'existe pour cette année, appliquer les règles par défaut
            console.log("No existing data for year, applying default rules");
            setObligationStatuses(getDefaultObligationStatuses());
          }
        } else {
          // Si aucune donnée fiscale n'existe, appliquer les règles par défaut
          console.log("No fiscal data exists, applying default rules");
          setObligationStatuses(getDefaultObligationStatuses());
        }
      } catch (error) {
        console.error("Exception lors du chargement des données fiscales:", error);
        // En cas d'erreur, appliquer les règles par défaut
        setObligationStatuses(getDefaultObligationStatuses());
      }
    };

    loadFiscalData();
  }, [selectedClient?.id, fiscalYear]);
};
