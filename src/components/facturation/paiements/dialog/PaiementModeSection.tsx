
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PaiementFormData } from "../types/PaiementFormTypes";
import { CreditCard, Banknote, Hash, SmartphoneNfc } from "lucide-react";

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
    <div className="space-y-4">
      <div className="grid gap-1.5 bg-gray-50 p-2.5 rounded-md border border-gray-100">
        <div className="flex items-center justify-between">
          <Label htmlFor="est_credit" className="text-sm font-medium text-gray-700">
            Crédit client
          </Label>
          <Switch
            id="est_credit"
            checked={est_credit}
            onCheckedChange={onCreditChange}
            className="data-[state=checked]:bg-primary"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Activez pour enregistrer un crédit sans facture associée
        </p>
      </div>

      <div className="grid gap-2">
        <Label className="text-xs font-medium mb-1">Mode de paiement</Label>
        <RadioGroup 
          value={selectedMode}
          onValueChange={(value: "espèces" | "virement" | "orange_money" | "mtn_money") => onModeChange(value)}
          className="grid grid-cols-2 gap-3"
        >
          <div className="bg-white hover:bg-gray-50 transition-colors rounded-md border border-gray-200 p-2.5 cursor-pointer flex items-center space-x-2">
            <RadioGroupItem value="espèces" id="especes" className="h-4 w-4 text-primary border-gray-400" />
            <Label htmlFor="especes" className="text-sm cursor-pointer flex items-center gap-2">
              <Banknote size={16} className="text-gray-500" />
              Espèces
            </Label>
          </div>
          <div className="bg-white hover:bg-gray-50 transition-colors rounded-md border border-gray-200 p-2.5 cursor-pointer flex items-center space-x-2">
            <RadioGroupItem value="virement" id="virement" className="h-4 w-4 text-primary border-gray-400" />
            <Label htmlFor="virement" className="text-sm cursor-pointer flex items-center gap-2">
              <CreditCard size={16} className="text-gray-500" />
              Virement
            </Label>
          </div>
          <div className="bg-white hover:bg-gray-50 transition-colors rounded-md border border-gray-200 p-2.5 cursor-pointer flex items-center space-x-2">
            <RadioGroupItem value="orange_money" id="orange_money" className="h-4 w-4 text-primary border-gray-400" />
            <Label htmlFor="orange_money" className="text-sm cursor-pointer flex items-center gap-2">
              <SmartphoneNfc size={16} className="text-orange-500" />
              Orange Money
            </Label>
          </div>
          <div className="bg-white hover:bg-gray-50 transition-colors rounded-md border border-gray-200 p-2.5 cursor-pointer flex items-center space-x-2">
            <RadioGroupItem value="mtn_money" id="mtn_money" className="h-4 w-4 text-primary border-gray-400" />
            <Label htmlFor="mtn_money" className="text-sm cursor-pointer flex items-center gap-2">
              <SmartphoneNfc size={16} className="text-yellow-500" />
              MTN Money
            </Label>
          </div>
        </RadioGroup>
      </div>

      {selectedMode !== "espèces" && (
        <div className="grid gap-1.5 mt-1 bg-gray-50 p-2.5 rounded-md border border-gray-100">
          <Label htmlFor="reference_transaction" className="text-xs font-medium flex items-center gap-1.5">
            <Hash size={14} className="text-gray-500" />
            Référence de transaction
          </Label>
          <Input
            id="reference_transaction"
            className="h-9 text-sm bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20"
            placeholder="Numéro de transaction"
            {...register("reference_transaction")}
          />
          {errors.reference_transaction && (
            <p className="text-xs text-red-500">{errors.reference_transaction.message}</p>
          )}
        </div>
      )}
    </div>
  );
};
