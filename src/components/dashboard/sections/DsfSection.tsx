
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/fiscal/unfiledDsfService";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Utiliser le service spécialisé pour récupérer les données DSF
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unfiled-dsf-section"],
    queryFn: getClientsWithUnfiledDsf,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des DSF non déposées */}
      <UnfiledDsfSummary 
        clients={clients} 
        isLoading={isLoading} 
        onViewAllClick={() => setIsDialogOpen(true)} 
      />
      
      {/* Dialog pour la vue complète */}
      <UnfiledDsfDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default DsfSection;
