
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import ClientSelector from "./ClientSelector";
import PrestationFields from "./PrestationFields";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ClientInfoDisplay from "./ClientInfoDisplay";
import TotalAmountDisplay from "./TotalAmountDisplay";
import { useFactureForm } from "@/hooks/useFactureForm";

interface CreateFactureFormProps {
  onSuccess: () => void;
}

const CreateFactureForm = ({ onSuccess }: CreateFactureFormProps) => {
  const {
    handleSubmit,
    setValue,
    prestations,
    setPrestations,
    totalAmount,
    selectedClientId,
    selectedClient,
    selectedDate,
    selectedEcheance,
    selectedStatus,
    allClients,
    onSubmit
  } = useFactureForm(onSuccess);

  console.log("Rendering CreateFactureForm", { totalAmount, selectedClientId });
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <ClientSelector 
          clients={allClients}
          value={selectedClientId} 
          onChange={(value) => setValue("client_id", value)}
        />

        <ClientInfoDisplay client={selectedClient} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <PrestationFields
          prestations={prestations}
          onPrestationsChange={setPrestations}
        />

        <TotalAmountDisplay amount={totalAmount} />
      </div>

      <DialogFooter>
        <Button type="submit" className="bg-[#84A98C] hover:bg-[#6B8E74] text-white">
          Créer la facture
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateFactureForm;
