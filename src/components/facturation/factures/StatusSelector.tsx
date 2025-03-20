
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
  label?: string;
}

const StatusSelector = ({ value, onChange, includeEmpty = false, label = "Statut de paiement" }: StatusSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="status" className="text-sm">{label}</Label>
      <Select 
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          {includeEmpty && (
            <SelectItem value="">Tous les statuts</SelectItem>
          )}
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
