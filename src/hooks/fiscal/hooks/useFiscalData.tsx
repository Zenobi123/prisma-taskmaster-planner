
import { useState, useEffect, useCallback } from "react";
import { ClientFiscalData } from "../types";
import { supabase } from "@/integrations/supabase/client";

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [isLoading, setIsLoading] = useState(true);

  const loadFiscalData = useCallback(async () => {
    if (!clientId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data: client, error } = await supabase
        .from("clients")
        .select("fiscal_data")
        .eq("id", clientId)
        .single();

      if (error) {
        console.error("Erreur lors du chargement des données fiscales:", error);
        setFiscalData(null);
        return;
      }

      if (client?.fiscal_data && typeof client.fiscal_data === 'object' && !Array.isArray(client.fiscal_data)) {
        const fiscalDataObj = client.fiscal_data as any;
        setFiscalData(fiscalDataObj as ClientFiscalData);
        if (fiscalDataObj.selectedYear) {
          setSelectedYear(fiscalDataObj.selectedYear);
        }
      } else {
        // Initialize with default data structure
        const defaultData: ClientFiscalData = {
          clientId,
          year: selectedYear,
          attestation: {
            creationDate: "",
            validityEndDate: "",
            showInAlert: true
          },
          obligations: {},
          hiddenFromDashboard: false,
          selectedYear: selectedYear
        };
        setFiscalData(defaultData);
      }
    } catch (error) {
      console.error("Exception lors du chargement des données fiscales:", error);
      setFiscalData(null);
    } finally {
      setIsLoading(false);
    }
  }, [clientId, selectedYear]);

  useEffect(() => {
    loadFiscalData();
  }, [loadFiscalData]);

  return {
    fiscalData,
    setFiscalData,
    isLoading,
    loadFiscalData,
    selectedYear,
    setSelectedYear
  };
};
