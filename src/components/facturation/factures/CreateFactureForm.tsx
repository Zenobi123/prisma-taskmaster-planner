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
import { Form } from "@/components/ui/form";
import { Facture } from "@/types/facture";
import { useEffect } from "react";

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
    setValue,
    watch,
    register,
    prestations,
    setPrestations,
    totalAmount,
    selectedClientId,
    selectedClient,
    selectedDate,
    selectedEcheance,
    selectedStatus,
    selectedStatusPaiement,
    selectedModePaiement,
    allClients,
    isLoadingClients,
    clientsError,
    onSubmit,
    initializeFormForEdit
  } = useFactureForm(onSuccess, editMode);
  
  useEffect(() => {
    if (editMode && factureToEdit) {
      initializeFormForEdit(factureToEdit);
    }
  }, [editMode, factureToEdit, initializeFormForEdit]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div className="space-y-2 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <ClientSelector 
              clients={allClients}
              value={selectedClientId} 
              onChange={(value) => setValue("client_id", value)}
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
                date={selectedDate}
                onSelect={(date) => setValue("date", date)}
              />

              <DatePickerField 
                label="Date d'échéance"
                date={selectedEcheance}
                onSelect={(date) => setValue("echeance", date)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <StatusSelector 
                value={selectedStatus}
                onChange={(value) => setValue("status", value)}
                type="document"
                label="Statut document"
              />
              
              <StatusSelector 
                value={selectedStatusPaiement}
                onChange={(value) => setValue("status_paiement", value)}
                type="paiement"
                label="Statut paiement"
              />
            </div>
            
            <ModePaiementSelector
              value={selectedModePaiement}
              onChange={(value) => setValue("mode_paiement", value)}
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
            {...register("notes")}
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
