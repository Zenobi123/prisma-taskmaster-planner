
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import UnpaidPatenteSummary from "../UnpaidPatenteSummary";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  
  // Utiliser le service pour récupérer les données
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente-section"],
    queryFn: getClientsWithUnpaidPatente,
    refetchInterval: 30000, // Rafraîchir toutes les 30 secondes
    refetchOnWindowFocus: true,
  });
  
  // Mettre à jour le compteur lorsque les données changent
  useEffect(() => {
    if (!isLoading) {
      console.log(`PatenteSection - Nombre de clients avec IGS impayés: ${clients.length}`);
      setClientCount(clients.length);
    }
  }, [clients, isLoading]);

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des IGS impayés */}
      <UnpaidPatenteSummary 
        unpaidCount={clientCount} 
        isLoading={isLoading}
        onViewAllClick={() => setIsDialogOpen(true)} 
      />
      
      {/* Dialog pour la vue complète */}
      <UnpaidPatenteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default PatenteSection;
