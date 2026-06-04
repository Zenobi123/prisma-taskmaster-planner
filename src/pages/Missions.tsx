import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import MissionFilters from "@/components/missions/MissionFilters";
import MissionList from "@/components/missions/MissionList";
import MissionPagination from "@/components/missions/MissionPagination";
import MissionHeader from "@/components/missions/MissionHeader";
import { useMissionFilter } from "@/hooks/useMissionFilter";
import PageLayout from "@/components/layout/PageLayout";
import { useAuthorization } from "@/hooks/useAuthorization";
import { CollaborateurUnauthorized } from "@/components/collaborateurs/CollaborateurUnauthorized";
import { useExercice } from "@/contexts/ExerciceContext";
import { ExerciceSelector, ExerciceReadOnlyBanner } from "@/components/exercice/ExerciceControls";

const Missions = () => {
  const { isAuthorized } = useAuthorization(
    ["admin", "comptable", "gestionnaire", "expert-comptable", "fiscaliste", "assistant"],
    "missions",
    { showToast: true }
  );
  const { isVisibleByYear, isConsultingClosed, getYearFromDate } = useExercice();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          *,
          clients!tasks_client_id_fkey (
            id,
            raisonsociale,
            nom,
            type
          ),
          collaborateurs!tasks_collaborateur_id_fkey (
            id,
            nom,
            prenom
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }


      return tasksData.map(task => ({
        id: task.id,
        title: task.title,
        client: task.clients?.raisonsociale || task.clients?.nom || 'Client inconnu',
        assignedTo: task.collaborateurs ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}` : 'Non assigné',
        status: task.status,
        startDate: task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Non définie',
        endDate: task.end_date ? new Date(task.end_date).toLocaleDateString() : 'Non définie',
        rawStartDate: task.start_date ?? null,
        rawEndDate: task.end_date ?? null,
        clientId: task.client_id,
        collaborateurId: task.collaborateur_id,
        createdAt: task.created_at,
        refYear: getYearFromDate(task.start_date || task.end_date || task.created_at)
      }));
    }
  });

  // Exercice comptable : masquer les missions des années clôturées (sauf consultation)
  const visibleMissions = useMemo(
    () => (missions ?? []).filter((mission) => isVisibleByYear(mission.refYear)),
    [missions, isVisibleByYear]
  );

  // Use the custom hook for filtering and sorting
  const filteredAndSortedMissions = useMissionFilter(
    visibleMissions,
    searchTerm,
    statusFilter,
    isConsultingClosed
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedMissions.length / itemsPerPage);
  const currentItems = filteredAndSortedMissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!isAuthorized) {
    return <CollaborateurUnauthorized module="missions" />;
  }

  return (
    <PageLayout>
      <div className="px-4 py-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <MissionHeader />
          <ExerciceSelector />
        </div>

        <ExerciceReadOnlyBanner className="mb-4" />

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-3 sm:p-6 mb-4 sm:mb-6">
          <MissionFilters
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
      />

      <MissionList 
        missions={currentItems} 
        isLoading={isLoading} 
      />

      <MissionPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
        </div>
      </div>
    </PageLayout>
  );
};

export default Missions;
