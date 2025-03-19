
import { useState } from "react";
import { Facture, Prestation } from "@/types/facture";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FactureDetailsHeader } from "./factureDetails/FactureDetailsHeader";
import { ClientDateInfo } from "./factureDetails/ClientDateInfo";
import { PrestationsTable } from "./factureDetails/PrestationsTable";
import { NotesSection } from "./factureDetails/NotesSection";
import { FactureDetailsFooter } from "./factureDetails/FactureDetailsFooter";
import { Button } from "@/components/ui/button";
import { PlusCircle, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [editNotes, setEditNotes] = useState("");
  const [editPrestations, setEditPrestations] = useState<Prestation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  if (!selectedFacture) return null;

  const handleEnterEditMode = () => {
    setEditNotes(selectedFacture.notes || "");
    setEditPrestations([...selectedFacture.prestations]);
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab("details");
  };

  const handleSaveChanges = async () => {
    if (!selectedFacture) return;
    
    setIsLoading(true);
    
    // Calculer le nouveau montant total
    const montantTotal = editPrestations.reduce((sum, item) => {
      return sum + (item.montant || 0);
    }, 0);
    
    const updates: Partial<Facture> = {
      prestations: editPrestations,
      notes: editNotes,
      montant: montantTotal
    };
    
    const success = await onUpdateFacture(selectedFacture.id, updates);
    
    if (success) {
      setIsEditing(false);
      setActiveTab("details");
    }
    
    setIsLoading(false);
  };

  const handleAddPrestation = () => {
    setEditPrestations([...editPrestations, { description: "", montant: 0 }]);
  };

  const handleRemovePrestation = (index: number) => {
    setEditPrestations(editPrestations.filter((_, i) => i !== index));
  };

  const handlePrestationChange = (index: number, field: keyof Prestation, value: any) => {
    const newPrestations = [...editPrestations];
    
    if (field === 'montant' && typeof value === 'string') {
      // Convertir la chaîne en nombre, supprimer les caractères non numériques
      const numericValue = value.replace(/[^0-9]/g, "");
      newPrestations[index].montant = numericValue ? parseInt(numericValue, 10) : 0;
    } else {
      newPrestations[index][field] = value;
    }
    
    setEditPrestations(newPrestations);
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
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6 animate-fade-in">
                <ClientDateInfo selectedFacture={selectedFacture} />

                <PrestationsTable 
                  prestations={selectedFacture.prestations}
                  montantTotal={selectedFacture.montant}
                  formatMontant={formatMontant}
                />

                <NotesSection notes={selectedFacture.notes} />
              </div>
            </ScrollArea>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setShowDetails(false)}>
                Fermer
              </Button>
              
              {canEdit && (
                <Button onClick={handleEnterEditMode}>
                  Modifier
                </Button>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="edit" className="pt-4">
            <ScrollArea className="max-h-[60vh] pr-4">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Prestations</h3>
                    <div className="space-y-3">
                      {editPrestations.map((prestation, index) => (
                        <div key={index} className="flex gap-2 items-start">
                          <div className="flex-1">
                            <Input
                              placeholder="Description de la prestation"
                              value={prestation.description}
                              onChange={(e) => handlePrestationChange(index, 'description', e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <div className="w-1/4">
                            <Input
                              placeholder="Montant (FCFA)"
                              value={prestation.montant ? prestation.montant.toLocaleString() : ""}
                              onChange={(e) => handlePrestationChange(index, 'montant', e.target.value)}
                              className="w-full text-right"
                            />
                          </div>
                          {editPrestations.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-destructive"
                              onClick={() => handleRemovePrestation(index)}
                            >
                              &times;
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={handleAddPrestation}
                    >
                      <PlusCircle className="mr-1 h-4 w-4" />
                      Ajouter une prestation
                    </Button>
                    
                    <div className="flex justify-end mt-4">
                      <div className="w-1/4">
                        <div className="flex justify-between font-medium">
                          <span>Total:</span>
                          <span>
                            {editPrestations.reduce((acc, curr) => acc + (curr.montant || 0), 0).toLocaleString()} FCFA
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Notes ou informations supplémentaires..."
                      className="min-h-[100px] mt-1"
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleCancelEdit}>
                Annuler
              </Button>
              <Button 
                onClick={handleSaveChanges} 
                disabled={isLoading}
                className="flex gap-2"
              >
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Sauvegarder
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
