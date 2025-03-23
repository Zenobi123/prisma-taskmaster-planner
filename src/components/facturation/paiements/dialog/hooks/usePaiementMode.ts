
interface UsePaiementModeProps {
  setValue: any;
}

export const usePaiementMode = ({ setValue }: UsePaiementModeProps) => {
  const handleCreditChange = (checked: boolean) => {
    setValue("est_credit", checked);
    if (checked) {
      setValue("facture_id", "");
    }
  };

  const handleModeChange = (value: "espèces" | "virement" | "orange_money" | "mtn_money") => {
    setValue("mode", value);
  };

  return {
    handleCreditChange,
    handleModeChange
  };
};
