
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getTasks } from "@/services/taskService";
import { getCollaborateurs } from "@/services/collaborateurService";
import { getClientsStats } from "@/services/clientStatsService";
import { UnpaidPatenteDialog } from "@/components/dashboard/UnpaidPatenteDialog";
import { UnpaidIgsDialog } from "@/components/dashboard/UnpaidIgsDialog";
import { UnfiledDarpDialog } from "@/components/dashboard/UnfiledDarpDialog";
import { NonCompliantDialog } from "@/components/dashboard/NonCompliantDialog";
import { getClientsSubjectToObligation } from "@/services/subjectClientsService";
import { FiscalStatsSection } from "./stats/FiscalStatsSection";
import { ClientStatsSection } from "./stats/ClientStatsSection";
import { ActivityStatsSection } from "./stats/ActivityStatsSection";
import { useTaskStats } from "./stats/hooks/useTaskStats";

const QuickStats = () => {
  const [showUnpaidPatenteDialog, setShowUnpaidPatenteDialog] = useState(false);
  const [showUnpaidIgsDialog, setShowUnpaidIgsDialog] = useState(false);
  const [showUnfiledDarpDialog, setShowUnfiledDarpDialog] = useState(false);
  const [showNonCompliantDialog, setShowNonCompliantDialog] = useState(false);

  const { data: tasks = [], isLoading: isTasksLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const { data: collaborateurs = [], isLoading: isCollaborateursLoading } = useQuery({
    queryKey: ["collaborateurs"],
    queryFn: getCollaborateurs,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const { data: clientStats, isLoading: isClientStatsLoading } = useQuery({
    queryKey: ["client-stats"],
    queryFn: getClientsStats,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const { data: subjectClients, isLoading: isSubjectClientsLoading } = useQuery({
    queryKey: ["subject-clients"],
    queryFn: getClientsSubjectToObligation,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  const { activeTasks, overdueTasks } = useTaskStats(tasks, isTasksLoading);


  return (
    <div className="grid grid-cols-1 gap-6">
      <FiscalStatsSection
        clientStats={clientStats}
        subjectClients={subjectClients}
        isClientStatsLoading={isClientStatsLoading}
        isSubjectClientsLoading={isSubjectClientsLoading}
        onUnfiledDarpClick={() => setShowUnfiledDarpDialog(true)}
        onUnpaidIgsClick={() => setShowUnpaidIgsDialog(true)}
        onNonCompliantClick={() => setShowNonCompliantDialog(true)}
      />

      <ClientStatsSection
        clientStats={clientStats}
        subjectClients={subjectClients}
        isClientStatsLoading={isClientStatsLoading}
        isSubjectClientsLoading={isSubjectClientsLoading}
        onUnpaidPatenteClick={() => setShowUnpaidPatenteDialog(true)}
      />

      <ActivityStatsSection
        clientStats={clientStats}
        overdueTasks={overdueTasks}
        activeTasks={activeTasks}
        isClientStatsLoading={isClientStatsLoading}
        isTasksLoading={isTasksLoading}
      />
      
      <UnpaidPatenteDialog 
        open={showUnpaidPatenteDialog} 
        onOpenChange={setShowUnpaidPatenteDialog} 
      />

      <UnpaidIgsDialog
        isOpen={showUnpaidIgsDialog}
        onClose={() => setShowUnpaidIgsDialog(false)}
        clients={[]}
      />

      <UnfiledDarpDialog
        open={showUnfiledDarpDialog}
        onOpenChange={setShowUnfiledDarpDialog}
      />

      <NonCompliantDialog
        open={showNonCompliantDialog}
        onOpenChange={setShowNonCompliantDialog}
      />
    </div>
  );
};

export default QuickStats;
