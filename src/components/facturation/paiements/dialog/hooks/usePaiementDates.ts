
import { useState } from "react";
import type { UseFormSetValue } from "react-hook-form";
import { PaiementFormData } from "../../types/PaiementFormTypes";

interface UsePaiementDatesProps {
  setValue: UseFormSetValue<PaiementFormData>;
}

export const usePaiementDates = ({ setValue }: UsePaiementDatesProps) => {
  const [date, setDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
      setValue("date", date);
    }
  };

  return {
    date,
    handleDateChange
  };
};
