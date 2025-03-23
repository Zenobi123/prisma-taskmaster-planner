
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useRef } from "react";

interface PaiementDateSectionProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const PaiementDateSection = ({
  date,
  onDateChange
}: PaiementDateSectionProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onDateChange(selectedDate);
      // Close the popover after selection by simulating a click on the trigger button
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.click();
        }
      }, 100);
    }
  };
  
  return (
    <div className="grid gap-1">
      <Label htmlFor="date" className="text-xs font-medium">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className="h-8 w-full justify-start text-left font-normal text-xs"
          >
            <CalendarIcon className="mr-2 h-3 w-3" />
            {date ? format(date, "P", { locale: fr }) : "Sélectionner une date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
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
