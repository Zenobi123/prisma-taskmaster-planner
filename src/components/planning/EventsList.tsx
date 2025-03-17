
import { CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";

interface EventsListProps {
  date: Date | undefined;
  events: Event[];
  isLoading: boolean;
  getEventBadge: (type: string) => string | null;
}

export const EventsList = ({ date, events, isLoading, getEventBadge }: EventsListProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">
        Événements du {date?.toLocaleDateString('fr-FR', { 
          weekday: 'long',
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        })}
      </h2>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : events.length > 0 ? (
        events.map((event) => (
          <Card key={event.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.client}</p>
                <p className="text-sm text-gray-500">{event.collaborateur}</p>
                <p className="text-sm text-gray-500 mt-1">{event.time}</p>
              </div>
              <div>
                <Badge variant={getEventBadge(event.type) || undefined}>
                  {event.type === "mission" ? "Mission" : "Réunion"}
                </Badge>
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 border rounded-lg">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
          <p>Aucun événement trouvé pour cette date.</p>
          <p className="text-sm">Sélectionnez une autre date ou modifiez vos filtres.</p>
        </div>
      )}
    </div>
  );
};
