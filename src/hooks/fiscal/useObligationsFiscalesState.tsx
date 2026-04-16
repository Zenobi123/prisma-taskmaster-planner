
import { useState, useEffect } from "react";
import { Client } from "@/types/client";
import { ObligationStatuses } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useDefaultObligationRules } from "./useDefaultObligationRules";

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
  const [registrationDate, setRegistrationDate] = useState<string>("");
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>({} as ObligationStatuses);

  const { getDefaultObligationStatuses } = useDefaultObligationRules(selectedClient);

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

          // Load registration attestation data
          if (fiscalData.registrationAttestation && typeof fiscalData.registrationAttestation === 'object') {
            const regAttestation = fiscalData.registrationAttestation as any;
            setRegistrationDate(regAttestation.registrationDate || "");
          }

          // Load dashboard visibility
          setHiddenFromDashboard(fiscalData.hiddenFromDashboard === true);

          // Load obligation statuses for current year
          if (fiscalData.obligations && typeof fiscalData.obligations === 'object' && fiscalData.obligations[fiscalYear]) {
            const yearObligations = fiscalData.obligations[fiscalYear];
            if (typeof yearObligations === 'object' && !Array.isArray(yearObligations)) {
              // Merge saved data with defaults to ensure all obligation keys exist
              const defaults = getDefaultObligationStatuses();
              const merged = { ...defaults };
              for (const key of Object.keys(yearObligations)) {
                if (key in merged) {
                  merged[key as keyof ObligationStatuses] = {
                    ...merged[key as keyof ObligationStatuses],
                    ...(yearObligations as any)[key]
                  } as any;
                }
              }
              setObligationStatuses(merged);
            } else {
              setObligationStatuses(getDefaultObligationStatuses());
            }
          } else {
            // No data for this year: initialize with defaults based on client profile
            setObligationStatuses(getDefaultObligationStatuses());
          }
        } else {
          // No fiscal data at all: initialize with defaults
          setObligationStatuses(getDefaultObligationStatuses());
        }
      } catch (error) {
        // On error, still show defaults so the UI is usable
        setObligationStatuses(getDefaultObligationStatuses());
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
    registrationDate,
    setRegistrationDate,
    obligationStatuses,
    setObligationStatuses
  };
};
