
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PaiementFormData } from "../types/PaiementFormTypes";

interface PaiementModeSectionProps {
  est_credit: boolean;
  selectedMode: "espèces" | "virement" | "orange_money" | "mtn_money";
  onCreditChange: (checked: boolean) => void;
  onModeChange: (value: "espèces" | "virement" | "orange_money" | "mtn_money") => void;
  register: UseFormRegister<PaiementFormData>;
  errors: FieldErrors<PaiementFormData>;
}

export const PaiementModeSection = ({
  est_credit,
  selectedMode,
  onCreditChange,
  onModeChange,
  register,
  errors
}: PaiementModeSectionProps) => {
  return (
    <>
      <div className="grid gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="est_credit" className="text-xs font-medium">
            Crédit client?
          </Label>
          <Switch
            id="est_credit"
            checked={est_credit}
            onCheckedChange={onCreditChange}
          />
        </div>
        <p className="text-xs text-gray-500">
          Activez pour enregistrer un crédit sans facture associée
        </p>
      </div>

      <div className="grid gap-1">
        <Label className="text-xs font-medium">Mode de paiement</Label>
        <RadioGroup 
          value={selectedMode}
          onValueChange={(value: "espèces" | "virement" | "orange_money" | "mtn_money") => onModeChange(value)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="espèces" id="especes" className="h-4 w-4" />
            <Label htmlFor="especes" className="text-xs cursor-pointer">Espèces</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="virement" id="virement" className="h-4 w-4" />
            <Label htmlFor="virement" className="text-xs cursor-pointer">Virement</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="orange_money" id="orange_money" className="h-4 w-4" />
            <Label htmlFor="orange_money" className="text-xs cursor-pointer">Orange Money</Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem value="mtn_money" id="mtn_money" className="h-4 w-4" />
            <Label htmlFor="mtn_money" className="text-xs cursor-pointer">MTN Money</Label>
          </div>
        </RadioGroup>
      </div>

      {selectedMode !== "espèces" && (
        <div className="grid gap-1">
          <Label htmlFor="reference_transaction" className="text-xs font-medium">
            Référence de transaction
          </Label>
          <Input
            id="reference_transaction"
            className="h-8 text-xs"
            placeholder="Numéro de transaction"
            {...register("reference_transaction")}
          />
          {errors.reference_transaction && (
            <p className="text-xs text-red-500">{errors.reference_transaction.message}</p>
          )}
        </div>
      )}
    </>
  );
};
