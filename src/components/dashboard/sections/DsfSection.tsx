
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use stale time and caching to avoid flickering and freezing
  const { data: clients = [], refetch } = useQuery({
    queryKey: ["clients-unfiled-dsf-summary"],
    queryFn: getClientsWithUnfiledDsf,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des DSF non déposées */}
      <UnfiledDsfSummary 
        onViewAllClick={() => setIsDialogOpen(true)} 
        clientsCount={clients.length}
      />
      
      {/* Dialog pour la vue complète */}
      <UnfiledDsfDialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          // Refresh data when dialog closes
          if (!open) {
            refetch();
          }
        }} 
      />
    </div>
  );
};

export default DsfSection;
