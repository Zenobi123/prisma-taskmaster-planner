
import { useState } from "react";

interface UsePaiementDatesProps {
  setValue: any;
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
