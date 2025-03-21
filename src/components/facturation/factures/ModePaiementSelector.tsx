
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModePaiementSelectorProps {
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
  label?: string;
  disabled?: boolean;
}

const ModePaiementSelector = ({ 
  value, 
  onChange, 
  includeEmpty = false,
  label = "Mode de paiement",
  disabled = false
}: ModePaiementSelectorProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="h-9 text-sm">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        {includeEmpty && (
          <SelectItem value="">Tous les modes</SelectItem>
        )}
        <SelectItem value="virement">Virement bancaire</SelectItem>
        <SelectItem value="carte">Carte bancaire</SelectItem>
        <SelectItem value="cheque">Chèque</SelectItem>
        <SelectItem value="especes">Espèces</SelectItem>
        <SelectItem value="mobile_money">Mobile Money</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModePaiementSelector;
