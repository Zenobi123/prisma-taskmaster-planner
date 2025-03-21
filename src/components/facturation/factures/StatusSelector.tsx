
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Facture } from "@/types/facture";

interface StatusSelectorProps {
  value: string;
  onChange: (value: Facture["status"]) => void; // Ensure the onChange returns a properly typed value
  includeEmpty?: boolean;
  label?: string;
}

const StatusSelector = ({ value, onChange, includeEmpty = false, label = "Statut de paiement" }: StatusSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="status" className="text-sm">{label}</Label>
      <Select 
        value={value}
        onValueChange={(value) => {
          // Ensure the value is one of the allowed status types
          onChange(value as Facture["status"]);
        }}
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
