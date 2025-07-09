
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanning } from "@/hooks/usePlanning";
import { CollaboratorFilter } from "@/components/planning/CollaboratorFilter";
import { CalendarView } from "@/components/planning/CalendarView";
import { EventsList } from "@/components/planning/EventsList";

const Planning = () => {
  const navigate = useNavigate();
  const planning = usePlanning();

  return (
    <div className="container mx-auto p-6">
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

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Planning</h1>
          <p className="text-neutral-600 mt-1">
            Consultez et gérez le planning des missions
          </p>
        </div>
        <CollaboratorFilter 
          collaborateurs={planning.collaborateurs}
          value={planning.collaborateurFilter}
          onChange={planning.setCollaborateurFilter}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
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
