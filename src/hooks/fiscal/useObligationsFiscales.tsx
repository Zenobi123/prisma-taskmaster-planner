
import { useState, useEffect, useRef } from "react";
import { Client } from "@/types/client";
import { ObligationType, ObligationStatuses, ClientFiscalData } from "./types";
import { loadFiscalData, saveFiscalData } from "./services/fiscalDataService";
import { calculateValidityEndDate, checkAttestationExpiration } from "./utils/dateUtils";

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

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Load client's fiscal data from database
  useEffect(() => {
    async function fetchFiscalData() {
      if (!client || !client.id) return;
      
      setIsLoading(true);
      
      const fiscalData = await loadFiscalData(client);
      
      if (fiscalData && isMounted.current) {
        if (fiscalData.attestation) {
          setCreationDate(fiscalData.attestation.creationDate || "");
          setValidityEndDate(fiscalData.attestation.validityEndDate || "");
          setShowInAlert(fiscalData.attestation.showInAlert !== false);
        }
        
        if (fiscalData.obligations) {
          setObligationStatuses(fiscalData.obligations);
        }
      }
      
      if (isMounted.current) {
        setIsLoading(false);
      }
    }

    if (client && client.id) {
      fetchFiscalData();
    }
  }, [client]);

  // Calculate end date when creation date changes
  useEffect(() => {
    if (creationDate) {
      const newEndDate = calculateValidityEndDate(creationDate);
      if (newEndDate) {
        setValidityEndDate(newEndDate);
        checkAttestationExpiration(creationDate, newEndDate);
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
    const fiscalDataToSave: ClientFiscalData = {
      attestation: {
        creationDate,
        validityEndDate,
        showInAlert
      },
      obligations: obligationStatuses
    };

    await saveFiscalData(client, fiscalDataToSave);
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
