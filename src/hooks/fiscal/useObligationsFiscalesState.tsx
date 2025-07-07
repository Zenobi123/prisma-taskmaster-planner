
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { supabase } from "@/integrations/supabase/client";

interface UseObligationsFiscalesStateProps {
  selectedClient: Client;
}

export const useObligationsFiscalesState = ({ selectedClient }: UseObligationsFiscalesStateProps) => {
  const [fiscalYear, setFiscalYear] = useState<string>(new Date().getFullYear().toString());
  const [creationDate, setCreationDate] = useState<string>("");
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(true);
  const [hiddenFromDashboard, setHiddenFromDashboard] = useState<boolean>(false);
  const [fiscalSituationCompliant, setFiscalSituationCompliant] = useState<boolean>(true);
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({});

  // Load fiscal data when client changes
  useEffect(() => {
    const loadFiscalData = async () => {
      if (!selectedClient?.id) return;

      try {
        const { data: client, error } = await supabase
          .from('clients')
          .select('fiscal_data')
          .eq('id', selectedClient.id)
          .single();

        if (error) {
          console.error("Error loading fiscal data:", error);
          return;
        }

        const fiscalData = client?.fiscal_data;
        if (fiscalData && typeof fiscalData === 'object' && !Array.isArray(fiscalData)) {
          // Load attestation data
          if (fiscalData.attestation && typeof fiscalData.attestation === 'object') {
            const attestation = fiscalData.attestation as any;
            setCreationDate(attestation.creationDate || "");
            setValidityEndDate(attestation.validityEndDate || "");
            setShowInAlert(attestation.showInAlert !== false);
            setFiscalSituationCompliant(attestation.fiscalSituationCompliant !== false);
          }

          // Load dashboard visibility
          setHiddenFromDashboard(fiscalData.hiddenFromDashboard === true);

          // Load selected year
          if (fiscalData.selectedYear && typeof fiscalData.selectedYear === 'string') {
            setFiscalYear(fiscalData.selectedYear);
          }

          // Load obligation statuses for current year
          if (fiscalData.obligations && typeof fiscalData.obligations === 'object' && fiscalData.obligations[fiscalYear]) {
            const yearObligations = fiscalData.obligations[fiscalYear];
            if (typeof yearObligations === 'object' && !Array.isArray(yearObligations)) {
              setObligationStatuses(yearObligations as ObligationStatuses);
            } else {
              setObligationStatuses({});
            }
          } else {
            setObligationStatuses({});
          }
        }
      } catch (error) {
        console.error("Error loading fiscal data:", error);
      }
    };

    loadFiscalData();
  }, [selectedClient?.id, fiscalYear]);

  return {
    fiscalYear,
    setFiscalYear,
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    setShowInAlert,
    hiddenFromDashboard,
    setHiddenFromDashboard,
    fiscalSituationCompliant,
    setFiscalSituationCompliant,
    obligationStatuses,
    setObligationStatuses
  };
};
