
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanning } from "@/hooks/usePlanning";
import { CollaboratorFilter } from "@/components/planning/CollaboratorFilter";
import { CalendarView } from "@/components/planning/CalendarView";
import { EventsList } from "@/components/planning/EventsList";
import { useIsMobile } from "@/hooks/use-mobile";

const Planning = () => {
  const navigate = useNavigate();
  const planning = usePlanning();
  const isMobile = useIsMobile();

  return (
    <div className={`container mx-auto ${isMobile ? 'px-4 py-4' : 'p-6'}`}>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'} mb-6`}>
        <div>
          <h1 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>Planning</h1>
          <p className={`text-neutral-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
            Consultez et gérez le planning des missions
          </p>
        </div>
        <CollaboratorFilter 
          collaborateurs={planning.collaborateurs}
          value={planning.collaborateurFilter}
          onChange={planning.setCollaborateurFilter}
        />
      </div>

      <div className={`grid gap-6 ${
        isMobile 
          ? 'grid-cols-1' 
          : 'grid-cols-1 md:grid-cols-[300px_1fr]'
      }`}>
        <CalendarView 
          date={planning.date}
          onDateChange={planning.setDate}
          datesWithEvents={planning.datesWithEvents}
        />

        <EventsList 
          date={planning.date}
          events={planning.filteredEvents}
          isLoading={planning.isLoading}
          getEventBadge={planning.getEventBadge}
        />
      </div>
    </div>
  );
};

export default Planning;
