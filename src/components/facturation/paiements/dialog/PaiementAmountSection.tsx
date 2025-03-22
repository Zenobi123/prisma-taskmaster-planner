
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldErrors } from "react-hook-form";
import { PaiementFormData } from "../types/PaiementFormTypes";

interface PaiementAmountSectionProps {
  register: any;
  errors: FieldErrors<PaiementFormData>;
}

export const PaiementAmountSection = ({
  register,
  errors
}: PaiementAmountSectionProps) => {
  return (
    <div className="grid gap-1">
      <Label htmlFor="montant" className="text-xs font-medium">Montant (FCFA)</Label>
      <Input
        id="montant"
        type="number"
        {...register("montant", { required: true, min: 1 })}
        className="h-8 text-xs"
      />
      {errors.montant && (
        <p className="text-xs text-red-500">Le montant est requis et doit être positif</p>
      )}
    </div>
  );
};
