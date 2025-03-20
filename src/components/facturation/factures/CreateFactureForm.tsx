
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector";
import PrestationFields from "./PrestationFields";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ModePaiementSelector from "./ModePaiementSelector";
import ClientInfoDisplay from "./ClientInfoDisplay";
import TotalAmountDisplay from "./TotalAmountDisplay";
import { useFactureForm } from "@/hooks/useFactureForm";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface CreateFactureFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CreateFactureForm = ({ onSuccess, onCancel }: CreateFactureFormProps) => {
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
    selectedModePaiement,
    allClients,
    onSubmit
  } = useFactureForm(onSuccess);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <ClientSelector 
              clients={allClients}
              value={selectedClientId} 
              onChange={(value) => setValue("client_id", value)}
            />

            <ClientInfoDisplay client={selectedClient} />
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
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

            <StatusSelector 
              value={selectedStatus}
              onChange={(value) => setValue("status", value)}
            />
            
            <ModePaiementSelector
              value={selectedModePaiement}
              onChange={(value) => setValue("mode_paiement", value)}
            />
          </div>
        </div>

        <PrestationFields
          prestations={prestations}
          onPrestationsChange={setPrestations}
        />

        <div className="space-y-1">
          <Label htmlFor="notes" className="text-sm">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Notes supplémentaires pour cette facture..."
            className="min-h-[80px] text-sm"
            {...register("notes")}
          />
        </div>

        <TotalAmountDisplay amount={totalAmount} />
      </div>

      <DialogFooter className="pt-2 flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="gap-2"
        >
          <X size={16} /> Annuler
        </Button>
        <Button type="submit" className="bg-[#84A98C] hover:bg-[#6B8E74] text-white">
          Créer la facture
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateFactureForm;
