
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector";
import PrestationFields from "./PrestationFields";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ModePaiementSelector from "./ModePaiementSelector";
import ClientInfoDisplay from "./ClientInfoDisplay";
import TotalAmountDisplay from "./TotalAmountDisplay";
import { useFactureForm } from "@/hooks/facturation/factureForm";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Facture } from "@/types/facture";
import { useEffect, useState } from "react";

interface CreateFactureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editMode?: boolean;
  factureToEdit?: Facture;
}

const CreateFactureForm = ({ 
  onSuccess, 
  onCancel, 
  editMode = false,
  factureToEdit
}: CreateFactureFormProps) => {
  const {
    handleSubmit,
    prestations,
    setPrestations,
    allClients,
    isLoadingClients,
    clientsError,
    initializeFormForEdit,
    clientId,
    setClientId,
    dateFacture,
    setDateFacture,
    dateEcheance,
    setDateEcheance,
    notes,
    setNotes,
    statutFacture,
    setStatutFacture,
    modePaiement,
    setModePaiement,
    getSelectedClient,
    toast
  } = useFactureForm();

  const [statusPaiement, setStatusPaiement] = useState("non_payée");
  
  useEffect(() => {
    if (editMode && factureToEdit) {
      initializeFormForEdit(factureToEdit);
    }
  }, [editMode, factureToEdit, initializeFormForEdit]);

  const selectedClient = getSelectedClient(clientId);

  const totalAmount = prestations.reduce((sum, prestation) => sum + (prestation.montant || 0), 0);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      client_id: clientId,
      date: dateFacture,
      echeance: dateEcheance,
      notes,
      status: statutFacture,
      status_paiement: statusPaiement,
      mode_paiement: modePaiement,
      prestations,
      montant: totalAmount
    };
    
    if (editMode && factureToEdit) {
      // Handle update logic here
      console.log("Updating facture:", formData);
    } else {
      handleSubmit(formData);
    }
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="space-y-2 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ClientSelector 
              clients={allClients}
              value={clientId} 
              onChange={setClientId}
              disabled={editMode}
              isLoading={isLoadingClients}
              error={clientsError}
            />

            <ClientInfoDisplay client={selectedClient} />
          </div>
          
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-2">
              <DatePickerField 
                label="Date d'émission"
                date={dateFacture ? new Date(dateFacture) : undefined}
                onSelect={(date) => setDateFacture(date ? date.toISOString().split('T')[0] : "")}
              />

              <DatePickerField 
                label="Date d'échéance"
                date={dateEcheance ? new Date(dateEcheance) : undefined}
                onSelect={(date) => setDateEcheance(date ? date.toISOString().split('T')[0] : "")}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <StatusSelector 
                value={statutFacture}
                onChange={setStatutFacture}
                type="document"
                label="Statut document"
              />
              
              <StatusSelector 
                value={statusPaiement}
                onChange={setStatusPaiement}
                type="paiement"
                label="Statut paiement"
              />
            </div>
            
            <ModePaiementSelector
              value={modePaiement}
              onChange={setModePaiement}
              label="Mode paiement"
            />
          </div>
        </div>

        <PrestationFields
          prestations={prestations}
          onPrestationsChange={setPrestations}
        />

        <div className="space-y-1">
          <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Notes supplémentaires pour cette facture..."
            className="min-h-[50px] text-xs"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <TotalAmountDisplay amount={totalAmount} />
      </div>

      <DialogFooter className="pt-1 flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="gap-2"
          size="sm"
        >
          <X size={16} /> Annuler
        </Button>
        <Button type="submit" className="bg-[#84A98C] hover:bg-[#6B8E74] text-white" size="sm">
          {editMode ? "Mettre à jour" : "Créer la facture"}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateFactureForm;
