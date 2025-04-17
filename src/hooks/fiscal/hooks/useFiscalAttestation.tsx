import { useState, useEffect } from "react";
import { calculateValidityEndDate, checkAttestationExpiration } from "../utils/dateUtils";

export const useFiscalAttestation = (initialCreationDate: string = "", initialShowInAlert: boolean = true) => {
  const [creationDate, setCreationDate] = useState<string>(initialCreationDate);
  const [validityEndDate, setValidityEndDate] = useState<string>("");
  const [showInAlert, setShowInAlert] = useState<boolean>(initialShowInAlert);

  // Calculate validity end date whenever creation date changes
  useEffect(() => {
    if (creationDate) {
      const endDate = calculateValidityEndDate(creationDate);
      setValidityEndDate(endDate);
    } else {
      setValidityEndDate("");
    }
  }, [creationDate]);

  useEffect(() => {
    if (creationDate && validityEndDate) {
      checkAttestationExpiration(creationDate, validityEndDate);
    }
  }, [creationDate, validityEndDate]);

  const handleToggleAlert = () => {
    setShowInAlert(prev => !prev);
  };

  return {
    creationDate,
    setCreationDate,
    validityEndDate,
    setValidityEndDate,
    showInAlert,
    handleToggleAlert
  };
};
