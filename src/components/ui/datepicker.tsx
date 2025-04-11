
import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

interface DatePickerSingleProps {
  mode: "single";
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
}

interface DatePickerRangeProps {
  mode: "range";
  selected?: DateRange;
  onSelect: (date: DateRange | undefined) => void;
  disabled?: (date: Date) => boolean;
}

type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

export function DatePicker(props: DatePickerProps) {
  if (props.mode === "single") {
    return (
      <Calendar
        mode="single"
        selected={props.selected as Date}
        onSelect={props.onSelect as (date: Date | undefined) => void}
        disabled={props.disabled}
        locale={fr}
      />
    );
  } else {
    return (
      <Calendar
        mode="range"
        selected={props.selected as DateRange}
        onSelect={props.onSelect as (range: DateRange | undefined) => void}
        disabled={props.disabled}
        locale={fr}
      />
    );
  }
}
