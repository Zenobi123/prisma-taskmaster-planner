
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { FormField, FormFieldProps } from "./FormField";
import { cn } from "@/lib/utils";

export interface DateFieldProps extends Omit<FormFieldProps, "children"> {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  placeholder = "JJ/MM/AAAA",
  required,
  disabled,
  error,
  description,
  className,
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
}: DateFieldProps) {
  // Convert string date to Date object for the calendar
  const parseDate = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parsedDate = parse(dateString, dateFormat, new Date());
    return isValid(parsedDate) ? parsedDate : undefined;
  };

  const selectedDate = parseDate(value);

  // Handle calendar selection
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, dateFormat, { locale: fr }));
    }
  };

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      description={description}
      className={className}
    >
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={cn("w-full", error && "border-red-500")}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10 p-0"
              disabled={disabled}
            >
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              initialFocus
              fromDate={minDate}
              toDate={maxDate}
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </FormField>
  );
}
