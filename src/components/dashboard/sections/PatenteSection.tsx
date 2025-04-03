
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UnpaidPatenteSummary from "../UnpaidPatenteSummary";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use stale time and caching to avoid flickering and freezing
  const { data: clients = [], refetch } = useQuery({
    queryKey: ["clients-unpaid-patente-summary"],
    queryFn: getClientsWithUnpaidPatente,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des patentes impayées */}
      <UnpaidPatenteSummary 
        onViewAllClick={() => setIsDialogOpen(true)} 
        clientsCount={clients.length}
      />
      
      {/* Dialog pour la vue complète */}
      <UnpaidPatenteDialog 
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

export default PatenteSection;
