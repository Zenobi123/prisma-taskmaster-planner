
import { useState } from "react";
import { ObligationType, ObligationStatuses } from "../types";

const defaultObligations: ObligationStatuses = {
  patente: { assujetti: false, paye: false },
  igs: { assujetti: false, paye: false },
  bail: { assujetti: false, paye: false },
  taxeFonciere: { assujetti: false, paye: false },
  dsf: { assujetti: false, depose: false },
  darp: { assujetti: false, depose: false }
};

export const useObligationStatus = (initialStatuses: ObligationStatuses = defaultObligations) => {
  const [obligationStatuses, setObligationStatuses] = useState<ObligationStatuses>(initialStatuses);

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

  return {
    obligationStatuses,
    setObligationStatuses,
    handleStatusChange
  };
};
