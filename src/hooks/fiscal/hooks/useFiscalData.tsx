
import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ClientFiscalData, ObligationStatuses } from "../types";

export const useFiscalData = (clientId: string) => {
  const [fiscalData, setFiscalData] = useState<ClientFiscalData | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  // Fetch fiscal data for the selected client
  const fetchFiscalData = useCallback(async () => {
    try {
      if (!clientId) return null;

      const { data, error } = await supabase
        .from("clients")
        .select("fiscal_data")
        .eq("id", clientId)
        .single();

      if (error) throw error;
      
      // Initialize fiscal data with default values if not exist
      let clientFiscalData: ClientFiscalData = data?.fiscal_data || {
        attestation: {
          creationDate: null,
          validityEndDate: null,
          showInAlert: true
        },
        obligations: getDefaultObligationStatuses(),
        hiddenFromDashboard: false,
        selectedYear
      };
      
      // Ensure the year is tracked in the fiscal data
      if (typeof clientFiscalData === 'object') {
        clientFiscalData.selectedYear = selectedYear;
      }
      
      setFiscalData(clientFiscalData as ClientFiscalData);
      return clientFiscalData;
    } catch (err) {
      console.error("Error fetching fiscal data:", err);
      return null;
    }
  }, [clientId, selectedYear]);

  // Update a specific field in the fiscal data
  const updateFiscalDataField = useCallback((field: string, value: any) => {
    setFiscalData((prevData) => {
      if (!prevData) return null;
      
      // Create a deep clone to avoid reference issues
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Handle nested fields with dot notation
      if (field.includes('.')) {
        const parts = field.split('.');
        let current = newData;
        
        // Navigate to the nested object
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        
        // Set the value
        current[parts[parts.length - 1]] = value;
      } else {
        newData[field] = value;
      }
      
      return newData;
    });
  }, []);

  // Initialize fiscal data on mount and when clientId changes
  useEffect(() => {
    if (clientId) {
      fetchFiscalData();
    }
  }, [clientId, fetchFiscalData]);

  return {
    fiscalData,
    selectedYear,
    setSelectedYear,
    fetchFiscalData,
    updateFiscalDataField
  };
};

// Helper function to create default obligation statuses
function getDefaultObligationStatuses(): ObligationStatuses {
  return {
    igs: { assujetti: false, paye: false },
    patente: { assujetti: false, paye: false },
    dsf: { assujetti: false, depose: false },
    darp: { assujetti: false, depose: false },
    iba: { assujetti: false, paye: false },
    baic: { assujetti: false, paye: false },
    ibnc: { assujetti: false, paye: false },
    ircm: { assujetti: false, paye: false },
    irf: { assujetti: false, paye: false },
    its: { assujetti: false, paye: false },
    licence: { assujetti: false, depose: false },
    precompte: { assujetti: false, paye: false },
    taxeSejour: { assujetti: false, paye: false },
    baillCommercial: { assujetti: false, paye: false }
  };
}

export default useFiscalData;
