
import { useState } from "react";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
