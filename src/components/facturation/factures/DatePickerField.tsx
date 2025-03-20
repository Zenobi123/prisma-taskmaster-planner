
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DatePickerFieldProps {
  label: string;
  date: Date;
  onSelect: (date: Date) => void;
}

const DatePickerField = ({ label, date, onSelect }: DatePickerFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>
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
            {date ? format(date, "dd MMMM yyyy", { locale: fr }) : <span>Sélectionner une date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(selectedDate) => selectedDate && onSelect(selectedDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerField;
