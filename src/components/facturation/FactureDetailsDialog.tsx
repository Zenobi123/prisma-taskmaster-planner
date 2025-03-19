
import { useState } from "react";
import { Facture } from "@/types/facture";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FactureDetailsHeader } from "./factureDetails/FactureDetailsHeader";
import { FactureDetailsContent } from "./factureDetails/FactureDetailsContent";
import { FactureEditForm } from "./factureDetails/FactureEditForm";

interface FactureDetailsDialogProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  selectedFacture: Facture | null;
  formatMontant: (montant: number) => string;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateFacture: (id: string, updates: Partial<Facture>) => Promise<boolean>;
}

export const FactureDetailsDialog = ({
  showDetails,
  setShowDetails,
  selectedFacture,
  formatMontant,
  onPrintInvoice,
  onDownloadInvoice,
  onUpdateFacture,
}: FactureDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  if (!selectedFacture) return null;

  const handleEnterEditMode = () => {
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab("details");
  };

  const handleSaveChanges = async (updates: Partial<Facture>) => {
    if (!selectedFacture) return;
    
    setIsLoading(true);
    
    const success = await onUpdateFacture(selectedFacture.id, updates);
    
    if (success) {
      setIsEditing(false);
      setActiveTab("details");
    }
    
    setIsLoading(false);
  };

  const canEdit = selectedFacture.status !== "payée";

  return (
    <Dialog open={showDetails} onOpenChange={setShowDetails}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <FactureDetailsHeader 
          selectedFacture={selectedFacture}
          onPrintInvoice={onPrintInvoice}
          onDownloadInvoice={onDownloadInvoice}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="edit" disabled={!canEdit || !isEditing}>Modifier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <FactureDetailsContent
              selectedFacture={selectedFacture}
              formatMontant={formatMontant}
              canEdit={canEdit}
              onEnterEditMode={handleEnterEditMode}
              onClose={() => setShowDetails(false)}
            />
          </TabsContent>
          
          <TabsContent value="edit" className="pt-4">
            <FactureEditForm
              selectedFacture={selectedFacture}
              onCancel={handleCancelEdit}
              onSave={handleSaveChanges}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
