
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Utiliser le service pour récupérer les données avec les mêmes paramètres que les autres sections
  const { data: clients = [] } = useQuery({
    queryKey: ["clients-unfiled-dsf-section"],
    queryFn: getClientsWithUnfiledDsf,
    refetchInterval: 10000,        // Rafraîchissement toutes les 10 secondes
    refetchOnWindowFocus: true,    // Rafraîchissement quand la fenêtre reprend le focus
    staleTime: 5000,               // Données considérées comme périmées après 5 secondes
    gcTime: 30000                  // Nettoyage du cache après 30 secondes
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
