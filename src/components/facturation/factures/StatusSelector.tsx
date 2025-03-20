
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const StatusSelector = ({ value, onChange }: StatusSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Statut de paiement</Label>
      <Select 
        defaultValue={value}
        onValueChange={onChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en_attente">Non payé</SelectItem>
          <SelectItem value="partiellement_payée">Partiellement payé</SelectItem>
          <SelectItem value="payée">Payé</SelectItem>
          <SelectItem value="envoyée">Envoyée</SelectItem>
          <SelectItem value="annulée">Annulée</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
