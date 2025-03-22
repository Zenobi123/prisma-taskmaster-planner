
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface PaiementModeSectionProps {
  selectedMode: "espèces" | "virement" | "orange_money" | "mtn_money";
  onModeChange: (value: "espèces" | "virement" | "orange_money" | "mtn_money") => void;
  register: any;
}

export const PaiementModeSection = ({
  selectedMode,
  onModeChange,
  register
}: PaiementModeSectionProps) => {
  return (
    <>
      {/* Payment mode */}
      <div className="grid gap-1">
        <Label htmlFor="mode" className="text-xs font-medium">Mode de paiement</Label>
        <Select 
          onValueChange={(value: "espèces" | "virement" | "orange_money" | "mtn_money") => onModeChange(value)} 
          defaultValue="espèces"
          value={selectedMode}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Mode de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="espèces" className="text-xs">Espèces</SelectItem>
            <SelectItem value="virement" className="text-xs">Virement bancaire</SelectItem>
            <SelectItem value="orange_money" className="text-xs">Orange Money</SelectItem>
            <SelectItem value="mtn_money" className="text-xs">MTN Mobile Money</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transaction reference */}
      {["orange_money", "mtn_money"].includes(selectedMode) && (
        <div className="grid gap-1">
          <Label htmlFor="reference_transaction" className="text-xs font-medium">Référence transaction</Label>
          <Input
            id="reference_transaction"
            type="text"
            placeholder="Ex: OM-123456789"
            {...register("reference_transaction")}
            className="h-8 text-xs"
          />
        </div>
      )}
    </>
  );
};
