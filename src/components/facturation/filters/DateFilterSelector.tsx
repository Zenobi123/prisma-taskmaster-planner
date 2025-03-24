
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DateFilterSelectorProps {
  dateFilter: Date | null;
  setDateFilter: (value: Date | null) => void;
}

const DateFilterSelector = ({ dateFilter, setDateFilter }: DateFilterSelectorProps) => {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="date" className="text-xs font-medium text-neutral-700">Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 text-sm border-neutral-300",
              !dateFilter && "text-neutral-500"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateFilter ? format(dateFilter, "dd/MM/yyyy", { locale: fr }) : <span>Toutes les dates</span>}
            {dateFilter && (
              <X 
                className="ml-auto h-4 w-4 text-neutral-500 hover:text-neutral-700" 
                onClick={(e) => {
                  e.stopPropagation();
                  setDateFilter(null);
                }}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 border-neutral-200" align="start">
          <Calendar
            mode="single"
            selected={dateFilter || undefined}
            onSelect={setDateFilter}
            initialFocus
            className="rounded-md border-0"
            classNames={{
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              day_today: "bg-neutral-100 text-neutral-900",
              nav_button: "text-neutral-600 hover:bg-neutral-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "flex justify-center py-2 relative items-center",
              head_cell: "text-neutral-500 font-normal text-xs",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilterSelector;
