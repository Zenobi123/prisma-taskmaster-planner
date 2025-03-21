
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, Building, Smartphone, Wallet } from "lucide-react";

interface ModePaiementSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ModePaiementSelector = ({ value, onChange }: ModePaiementSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="modePaiement" className="text-sm">Mode de paiement</Label>
      <Select 
        defaultValue={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="espèces">
            <div className="flex items-center">
              <Banknote className="h-3 w-3 mr-1" />
              <span>Espèces</span>
            </div>
          </SelectItem>
          <SelectItem value="orange_money">
            <div className="flex items-center">
              <Smartphone className="h-3 w-3 mr-1" />
              <span>Orange Money</span>
            </div>
          </SelectItem>
          <SelectItem value="mtn_mobile_money">
            <div className="flex items-center">
              <Smartphone className="h-3 w-3 mr-1" />
              <span>MTN Mobile Money</span>
            </div>
          </SelectItem>
          <SelectItem value="virement">
            <div className="flex items-center">
              <Building className="h-3 w-3 mr-1" />
              <span>Virement</span>
            </div>
          </SelectItem>
          <SelectItem value="chèque">
            <div className="flex items-center">
              <CreditCard className="h-3 w-3 mr-1" />
              <span>Chèque</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ModePaiementSelector;
