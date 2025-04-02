
import { useState } from "react";
import UnpaidPatenteSummary from "../UnpaidPatenteSummary";
import UnpaidPatenteList from "../UnpaidPatenteList";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des patentes impayées */}
      <UnpaidPatenteSummary onViewAllClick={() => setIsDialogOpen(true)} />
      
      {/* Liste des clients avec patente impayée */}
      <UnpaidPatenteList />
      
      {/* Dialog pour la vue complète */}
      <UnpaidPatenteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default PatenteSection;
