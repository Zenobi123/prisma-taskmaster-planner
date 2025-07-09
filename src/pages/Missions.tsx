import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import MissionFilters from "@/components/missions/MissionFilters";
import MissionList from "@/components/missions/MissionList";
import MissionPagination from "@/components/missions/MissionPagination";
import MissionHeader from "@/components/missions/MissionHeader";
import NewMissionDialog from "@/components/missions/NewMissionDialog";
import { VoiceControl } from "@/components/voice/VoiceControl";
import { VoiceHelpDialog } from "@/components/voice/VoiceHelpDialog";
import { useMissionFilter } from "@/hooks/useMissionFilter";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";
import { useIsMobile } from "@/hooks/use-mobile";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showNewMissionDialog, setShowNewMissionDialog] = useState(false);
  const itemsPerPage = 10;
  const isMobile = useIsMobile();

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

  // Voice commands hook
  const { handleVoiceCommand, showHelp, setShowHelp } = useVoiceCommands({
    onSearchChange: handleSearchChange,
    onStatusFilterChange: handleStatusFilterChange,
    onNewMission: () => setShowNewMissionDialog(true),
    onNextPage: handleNextPage,
    onPrevPage: handlePrevPage,
    onClearFilters: handleClearFilters,
    currentPage,
    totalPages
  });

  return (
    <div className={`container mx-auto ${isMobile ? 'px-4 py-4' : 'p-6'}`}>
      <MissionHeader />

      {/* Voice Control Section */}
      <div className={`mb-6 flex ${isMobile ? 'flex-col gap-4' : 'justify-between items-center'}`}>
        <VoiceControl 
          onCommand={handleVoiceCommand}
          className="flex-shrink-0"
        />
        <div className={`text-sm text-muted-foreground ${isMobile ? 'text-center' : ''}`}>
          Dites "aide" pour voir les commandes disponibles
        </div>
      </div>

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

      <VoiceHelpDialog 
        open={showHelp}
        onOpenChange={setShowHelp}
      />

      <NewMissionDialog 
        isOpen={showNewMissionDialog}
        onOpenChange={setShowNewMissionDialog}
        showTrigger={false}
      />
    </div>
  );
};

export default Missions;
