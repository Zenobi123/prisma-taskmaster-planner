
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import MissionFilters from "@/components/missions/MissionFilters";
import MissionList from "@/components/missions/MissionList";
import MissionPagination from "@/components/missions/MissionPagination";
import MissionHeader from "@/components/missions/MissionHeader";
import { useMissionFilter } from "@/hooks/useMissionFilter";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: missions, isLoading } = useQuery({
    queryKey: ['missions'],
    queryFn: async () => {
      console.log("Fetching missions data...");
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
        console.error("Erreur lors de la récupération des missions:", error);
        throw error;
      }

      console.log("Tasks data:", tasksData);

      return tasksData.map(task => ({
        id: task.id,
        title: task.title,
        client: task.clients?.raisonsociale || task.clients?.nom || 'Client inconnu',
        assignedTo: task.collaborateurs ? `${task.collaborateurs.prenom} ${task.collaborateurs.nom}` : 'Non assigné',
        status: task.status,
        startDate: task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Non définie',
        endDate: task.end_date ? new Date(task.end_date).toLocaleDateString() : 'Non définie',
        clientId: task.client_id,
        collaborateurId: task.collaborateur_id,
        createdAt: task.created_at
      }));
    }
  });

  // Use the custom hook for filtering and sorting
  const filteredAndSortedMissions = useMissionFilter(missions, searchTerm, statusFilter);

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

  return (
    <div className="container mx-auto p-6">
      <MissionHeader />

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
  );
};

export default Missions;
