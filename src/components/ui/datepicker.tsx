
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerProps {
  mode: "single" | "range";
  selected?: Date | DateRange | undefined;
  onSelect: (date: Date | DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ mode, selected, onSelect, disabled }: DatePickerProps) {
  return (
    <Calendar
      mode={mode}
      selected={selected}
      onSelect={onSelect}
      disabled={disabled}
      locale={fr}
    />
  );
}
