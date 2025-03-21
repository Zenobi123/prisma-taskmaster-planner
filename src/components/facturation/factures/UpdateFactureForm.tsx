
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Facture } from "@/types/facture";
import { useForm } from "react-hook-form";
import DatePickerField from "./DatePickerField";
import StatusSelector from "./StatusSelector";
import ModePaiementSelector from "./ModePaiementSelector";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface UpdateFactureFormProps {
  facture: Facture;
  onSuccess: (updatedData: Partial<Facture>) => void;
  onCancel: () => void;
}

const UpdateFactureForm = ({ facture, onSuccess, onCancel }: UpdateFactureFormProps) => {
  const [echeanceDate, setEcheanceDate] = useState<Date | null>(
    facture.echeance ? new Date(
      facture.echeance.split('/').reverse().join('-')
    ) : null
  );
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      status: facture.status,
      echeance: echeanceDate,
      notes: facture.notes || "",
      mode_paiement: facture.mode_paiement || "espèces"
    }
  });

  const selectedStatus = watch("status");
  const selectedModePaiement = watch("mode_paiement");
  const notes = watch("notes");

  const onSubmit = (data: any) => {
    let formattedEcheance = null;
    if (echeanceDate) {
      const day = echeanceDate.getDate().toString().padStart(2, '0');
      const month = (echeanceDate.getMonth() + 1).toString().padStart(2, '0');
      const year = echeanceDate.getFullYear();
      formattedEcheance = `${day}/${month}/${year}`;
    }

    const updatedData: Partial<Facture> = {
      status: data.status as Facture["status"], // Ensure correct typing
      echeance: formattedEcheance || facture.echeance,
      notes: data.notes,
      mode_paiement: data.mode_paiement
    };

    onSuccess(updatedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <StatusSelector 
            value={selectedStatus}
            onChange={(value) => setValue("status", value)}
          />
          
          <ModePaiementSelector
            value={selectedModePaiement}
            onChange={(value) => setValue("mode_paiement", value)}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="echeance" className="text-sm">Date d'échéance</Label>
          <DatePickerField 
            date={echeanceDate}
            onSelect={setEcheanceDate}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="notes" className="text-sm">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Notes supplémentaires pour cette facture..."
            className="min-h-[100px] text-sm"
            {...register("notes")}
          />
        </div>
      </div>

      <DialogFooter className="pt-2 flex justify-between">
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
          Enregistrer les modifications
        </Button>
      </DialogFooter>
    </form>
  );
};

export default UpdateFactureForm;
