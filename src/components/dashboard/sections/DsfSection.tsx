
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Utiliser le service pour récupérer les données
  const { data: clients = [] } = useQuery({
    queryKey: ["clients-unfiled-dsf-section"],
    queryFn: getClientsWithUnfiledDsf,
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des DSF non déposées */}
      <UnfiledDsfSummary onViewAllClick={() => setIsDialogOpen(true)} />
      
      {/* Dialog pour la vue complète */}
      <UnfiledDsfDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default DsfSection;
