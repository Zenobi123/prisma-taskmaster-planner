
import { useMemo } from "react";

interface Mission {
  id: string;
  title: string;
  client: string;
  assignedTo: string;
  status: string;
  startDate: string;
  endDate: string;
  clientId: string;
  collaborateurId: string;
  createdAt: string;
}

export const useMissionFilter = (
  missions: Mission[] | undefined,
  searchTerm: string,
  statusFilter: string
) => {
  const filteredAndSortedMissions = useMemo(() => {
    // Filter missions
    const filtered = missions?.filter((mission) => {
      const matchesSearch = mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mission.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || mission.status === statusFilter;
      
      if (mission.status === "termine") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const missionCreatedAt = new Date(mission.createdAt);
        
        return matchesSearch && matchesStatus && missionCreatedAt >= thirtyDaysAgo;
      }
      
      return matchesSearch && matchesStatus;
    }) || [];

    // Sort missions by status priority
    return [...filtered].sort((a, b) => {
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
  }, [missions, searchTerm, statusFilter]);

  return filteredAndSortedMissions;
};
