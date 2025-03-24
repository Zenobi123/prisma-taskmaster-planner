
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldErrors } from "react-hook-form";
import { PaiementFormData } from "../types/PaiementFormTypes";
import { BanknoteIcon } from "lucide-react";

interface PaiementAmountSectionProps {
  register: any;
  errors: FieldErrors<PaiementFormData>;
}

export const PaiementAmountSection = ({
  register,
  errors
}: PaiementAmountSectionProps) => {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor="montant" className="text-xs font-medium flex items-center gap-1.5">
        <BanknoteIcon size={14} className="text-gray-500" />
        Montant (FCFA)
      </Label>
      <div className="relative">
        <Input
          id="montant"
          type="number"
          {...register("montant", { required: true, min: 1 })}
          className="h-9 text-sm pr-16 bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20"
          placeholder="0"
        />
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-xs font-medium text-gray-500 bg-gray-50 border-l border-gray-300 rounded-r-md">
          FCFA
        </div>
      </div>
      {errors.montant && (
        <p className="text-xs text-red-500 mt-1">Le montant est requis et doit être positif</p>
      )}
    </div>
  );
};
