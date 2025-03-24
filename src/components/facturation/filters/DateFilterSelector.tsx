
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateFilterSelectorProps {
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
}

const DateFilterSelector = ({ dateFilter, setDateFilter }: DateFilterSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="date" className="text-xs">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-8 text-sm",
              !dateFilter && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "dd/MM/yyyy", { locale: fr }) : <span>Toutes les dates</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={setDateFilter}
            initialFocus
            className="pointer-events-auto"
          />
          {dateFilter && (
            <div className="p-2 border-t border-gray-100 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDateFilter(null)}
                className="text-xs"
              >
                Réinitialiser
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilterSelector;
