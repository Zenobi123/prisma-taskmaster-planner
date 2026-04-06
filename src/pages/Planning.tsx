
import { usePlanning } from "@/hooks/usePlanning";
import { CollaboratorFilter } from "@/components/planning/CollaboratorFilter";
import { CalendarView } from "@/components/planning/CalendarView";
import { EventsList } from "@/components/planning/EventsList";
import PageLayout from "@/components/layout/PageLayout";

const Planning = () => {
  const planning = usePlanning();

  return (
    <PageLayout>
      <div className="p-8">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight">Planning</h1>
          <p className="text-neutral-500 mt-1 text-sm">
            Consultez le calendrier des échéances et la charge de travail de l'équipe
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

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
          <EventsList
            date={planning.date}
            events={planning.filteredEvents}
            isLoading={planning.isLoading}
            getEventBadge={planning.getEventBadge}
          />
        </div>
      </div>
      </div>
    </PageLayout>
  );
};

export default Planning;
