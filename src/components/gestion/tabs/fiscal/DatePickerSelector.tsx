
import React from "react";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface DatePickerSelectorProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DatePickerSelector: React.FC<DatePickerSelectorProps> = ({
  value,
  onChange,
  placeholder = "Sélectionner une date",
  className,
  disabled = false
}) => {
  // Détermine si la valeur est au format YYYY-MM-DD ou DD/MM/YYYY
  const isISOFormat = value && value.includes('-');
  
  // Parse la date en fonction du format
  let selectedDate: Date | undefined;
  if (value) {
    try {
      if (isISOFormat) {
        // Format YYYY-MM-DD
        selectedDate = new Date(value);
      } else {
        // Format DD/MM/YYYY 
        selectedDate = parse(value, 'dd/MM/yyyy', new Date());
      }
      
      // Vérification que la date est valide
      if (isNaN(selectedDate.getTime())) {
        selectedDate = undefined;
      }
    } catch (error) {
      console.error("Erreur lors du parsing de la date:", error, value);
      selectedDate = undefined;
    }
  }
  
  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // On stocke toujours en format YYYY-MM-DD pour la cohérence interne
      const formattedDate = format(date, "yyyy-MM-dd");
      console.log("DatePickerSelector - Date sélectionnée:", formattedDate);
      onChange(formattedDate);
    }
  };

  // Affiche la date au format français, quelle que soit la façon dont elle est stockée
  const displayDate = () => {
    if (!value) return null;
    
    try {
      const dateObj = selectedDate || new Date();
      return format(dateObj, "d MMMM yyyy", { locale: fr });
    } catch (error) {
      console.error("Erreur lors du formatage de la date pour l'affichage:", error);
      return value; // Fallback au format brut
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? displayDate() : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          initialFocus
          className="p-3 pointer-events-auto"
          locale={fr}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerSelector;
