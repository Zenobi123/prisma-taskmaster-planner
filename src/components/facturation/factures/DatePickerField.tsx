
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface DatePickerFieldProps {
  label: string;
  date: Date;
  onSelect: (date: Date) => void;
}

const DatePickerField = ({ label, date, onSelect }: DatePickerFieldProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onSelect(selectedDate);
      // Close the popover after selection by simulating a click on the trigger button
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }, 100);
    }
  };
  
  return (
    <div className="space-y-1">
      <Label htmlFor={label} className="text-xs font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-7 text-xs",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-1 h-3 w-3" />
            {date ? format(date, "dd/MM/yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            className="pointer-events-auto scale-90 origin-top"
            locale={fr}
            weekStartsOn={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
