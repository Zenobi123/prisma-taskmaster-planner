
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Facture } from "@/types/facture";

interface StatusSelectorProps {
  value: string;
  onChange: (value: Facture["status"] | "empty") => void; // Updated to handle "empty" value
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
          // Pass the value directly, including "empty" 
          onChange(value as Facture["status"] | "empty");
        }}
      >
        <SelectTrigger className="h-8 text-sm">
          <SelectValue placeholder="Sélectionner" />
        </SelectTrigger>
        <SelectContent>
          {includeEmpty && (
            <SelectItem value="empty">Tous les statuts</SelectItem>
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
