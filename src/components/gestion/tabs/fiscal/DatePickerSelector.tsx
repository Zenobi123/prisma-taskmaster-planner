
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parse, isValid } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DatePickerSelectorProps {
  date: string;
  onChange: (date: string) => void;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  id?: string;
  error?: boolean;
}

const DatePickerSelector = ({
  date,
  onChange,
  label,
  placeholder = "JJ/MM/AAAA",
  readOnly = false,
  className = "",
  id,
  error = false
}: DatePickerSelectorProps) => {
  const [open, setOpen] = useState(false);
  
  // Parse string date to Date object
  const parsedDate = date 
    ? parse(date, "dd/MM/yyyy", new Date()) 
    : undefined;
  
  // Only use the parsedDate if it's valid
  const selectedDate = isValid(parsedDate) ? parsedDate : undefined;
  
  // Handle date selection from calendar
  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const formattedDate = format(newDate, "dd/MM/yyyy", { locale: fr });
      onChange(formattedDate);
    }
    setOpen(false);
  };
  
  // Handle direct input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[#336755]">
        {label}
      </Label>
      <div className="relative">
        <Popover open={open && !readOnly} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                id={id}
                placeholder={placeholder}
                value={date}
                onChange={handleInputChange}
                onClick={() => !readOnly && setOpen(true)}
                readOnly={readOnly}
                className={cn(
                  "pl-10",
                  error ? "border-red-500" : readOnly ? "bg-[#E8FDF5] border-[#A8C1AE]" : "border-[#A8C1AE]",
                  className
                )}
              />
              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-[#84A98C]" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 border-[#A8C1AE]" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              initialFocus
              locale={fr}
              className="rounded-md border-0 pointer-events-auto"
              classNames={{
                day_selected: "bg-[#84A98C] text-white hover:bg-[#6B9080] hover:text-white",
                day_today: "bg-[#E8FDF5] text-[#336755]",
                nav_button: "text-[#84A98C] hover:bg-[#E8FDF5]",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                caption: "flex justify-center py-2 relative items-center",
                head_cell: "text-[#336755] font-normal text-xs",
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePickerSelector;
