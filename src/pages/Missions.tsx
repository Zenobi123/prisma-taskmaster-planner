
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MissionCard from "@/components/missions/MissionCard";
import MissionFilters from "@/components/missions/MissionFilters";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import NewTaskDialog from "@/components/dashboard/NewTaskDialog";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const Missions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

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
        .order('created_at', { ascending: false }); // Ajout du tri par date de création

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
        createdAt: task.created_at // Ajout de la date de création pour pouvoir trier
      }));
    }
  });

  // Filtrer les missions par statut et recherche
  const filteredMissions = missions?.filter((mission) => {
    const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
    
    // Pour les missions terminées, ne garder que celles des 30 derniers jours
    if (mission.status === "termine") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const missionCreatedAt = new Date(mission.createdAt);
      
      return matchesSearch && matchesStatus && missionCreatedAt >= thirtyDaysAgo;
    }
    
    return matchesSearch && matchesStatus;
  }) || [];

  // Trier les missions par priorité de statut: en_cours, en_attente, en_retard, termine
  const sortedMissions = [...filteredMissions].sort((a, b) => {
    const statusPriority = {
      "en_cours": 1,
      "en_attente": 2, 
      "en_retard": 3,
      "termine": 4
    };
    
    const priorityA = statusPriority[a.status as keyof typeof statusPriority] || 99;
    const priorityB = statusPriority[b.status as keyof typeof statusPriority] || 99;
    
    return priorityA - priorityB;
  });

  // Pagination
  const totalPages = Math.ceil(sortedMissions.length / itemsPerPage);
  const currentItems = sortedMissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          <h1 className="text-2xl font-bold">Mission</h1>
          <p className="text-neutral-600 mt-1">
            Gérez les missions et leur suivi
          </p>
        </div>
        <NewTaskDialog />
      </div>

      <MissionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((mission) => (
              <MissionCard key={mission.id} mission={mission} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucune mission n'a été trouvée. Utilisez le bouton "Nouvelle tâche" pour en créer une.
            </div>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {currentPage > 1 && (
              <PaginationItem>
                <PaginationPrevious onClick={() => setCurrentPage(current => Math.max(1, current - 1))} />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationItem key={pageNumber}>
                  <PaginationLink 
                    isActive={currentPage === pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
            {currentPage < totalPages && (
              <PaginationItem>
                <PaginationNext onClick={() => setCurrentPage(current => Math.min(totalPages, current + 1))} />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default Missions;
