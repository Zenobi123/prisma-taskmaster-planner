
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaiementDateSectionProps {
  date: Date;
  onDateChange: (date: Date | undefined) => void;
}

export const PaiementDateSection = ({
  date,
  onDateChange
}: PaiementDateSectionProps) => {
  return (
    <div className="grid gap-1">
      <Label htmlFor="date" className="text-xs font-medium">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
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
            onSelect={onDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
