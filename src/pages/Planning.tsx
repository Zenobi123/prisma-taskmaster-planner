
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlanning } from "@/hooks/usePlanning";
import { CollaboratorFilter } from "@/components/planning/CollaboratorFilter";
import { CalendarView } from "@/components/planning/CalendarView";
import { EventsList } from "@/components/planning/EventsList";
import PageLayout from "@/components/layout/PageLayout";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";

const Planning = () => {
  const { isAuthorized } = useAuthorization(
    ["admin", "comptable", "gestionnaire", "expert-comptable", "fiscaliste", "assistant"],
    "planning",
    { showToast: true }
  );
  const navigate = useNavigate();
  const planning = usePlanning();

  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="planning" />;
  }

  return (
    <PageLayout>
      <div className="px-4 py-4 sm:p-6 md:p-8">

      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="flex items-center gap-1 sm:gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-800 tracking-tight">Planning</h1>
          <p className="text-neutral-500 mt-1 text-xs sm:text-sm hidden sm:block">
            Consultez le calendrier des échéances et la charge de travail de l'équipe
          </p>
        </div>
        <CollaboratorFilter
          collaborateurs={planning.collaborateurs}
          value={planning.collaborateurFilter}
          onChange={planning.setCollaborateurFilter}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4 sm:gap-6">
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
