import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DatePickerSelectorProps {
  date: string;
  onDateSelect: (date: string | null) => void;
  placeholder: string;
  label?: string;
}

const DatePickerSelector: React.FC<DatePickerSelectorProps> = ({
  date,
  onDateSelect,
  placeholder,
  label
}) => {
  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format the date as ISO string but only keep the date part
      onDateSelect(format(selectedDate, 'yyyy-MM-dd'));
    } else {
      onDateSelect(null);
    }
  };

  // Parse the date string to Date object if it exists
  const parsedDate = date ? new Date(date) : undefined;

  return (
    <div className="space-y-2">
      {label && <Label className="text-sm">{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(new Date(date), "dd MMMM yyyy", { locale: fr }) : <span>{placeholder}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={parsedDate}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerSelector;
