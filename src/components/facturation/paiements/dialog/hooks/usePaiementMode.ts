
import type { UseFormSetValue } from "react-hook-form";
import { PaiementFormData } from "../../types/PaiementFormTypes";

interface UsePaiementModeProps {
  setValue: UseFormSetValue<PaiementFormData>;
}

export const usePaiementMode = ({ setValue }: UsePaiementModeProps) => {
  const handleCreditChange = (checked: boolean) => {
    setValue("est_credit", checked);
    if (checked) {
      setValue("facture_id", "");
    }
  };

  const handleModeChange = (value: PaiementFormData["mode"]) => {
    setValue("mode", value);
  };

  return {
    handleCreditChange,
    handleModeChange
  };
};
