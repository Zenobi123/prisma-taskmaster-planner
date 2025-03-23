
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface CalendarViewProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  datesWithEvents: Date[];
}

export const CalendarView = ({ date, onDateChange, datesWithEvents }: CalendarViewProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-1">
      <Calendar
        mode="single"
        selected={date}
        onSelect={onDateChange}
        className="rounded-md scale-95 origin-top"
        components={{
          DayContent: (props) => (
            <div className="relative w-full h-full flex items-center justify-center">
              {props.date.getDate()}
              {datesWithEvents.some(eventDate => 
                eventDate.getDate() === props.date.getDate() &&
                eventDate.getMonth() === props.date.getMonth() &&
                eventDate.getFullYear() === props.date.getFullYear()
              ) && (
                <div className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full"></div>
              )}
            </div>
          ),
        }}
      />
      <div className="px-4 py-2 border-t mt-2">
        <div className="flex items-center text-sm text-gray-500 gap-2">
          <CalendarIcon className="w-4 h-4" />
          <span>
            {date ? date.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : 'Aucune date sélectionnée'}
          </span>
        </div>
      </div>
    </div>
  );
};
