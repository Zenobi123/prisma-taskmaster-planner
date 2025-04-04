
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import UnpaidPatenteSummary from "../UnpaidPatenteSummary";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Utiliser le service pour récupérer les données
  const { data: clients = [] } = useQuery({
    queryKey: ["clients-unpaid-patente-section"],
    queryFn: getClientsWithUnpaidPatente,
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des patentes impayées */}
      <UnpaidPatenteSummary onViewAllClick={() => setIsDialogOpen(true)} />
      
      {/* Dialog pour la vue complète */}
      <UnpaidPatenteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default PatenteSection;
