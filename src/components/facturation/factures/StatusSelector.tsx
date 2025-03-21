
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface StatusSelectorProps {
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
  label?: string;
  type?: "document" | "paiement";
}

const StatusSelector = ({ 
  value, 
  onChange, 
  includeEmpty = false, 
  label, 
  type = "document" 
}: StatusSelectorProps) => {
  const documentLabel = "Statut du document";
  const paiementLabel = "Statut de paiement";
  
  const finalLabel = label || (type === "document" ? documentLabel : paiementLabel);
  
  return (
    <div className="space-y-1">
      <Label htmlFor="status" className="text-sm">{finalLabel}</Label>
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
          
          {type === "document" ? (
            // Options pour le statut du document
            <>
              <SelectItem value="brouillon">Brouillon</SelectItem>
              <SelectItem value="envoyée">Envoyée</SelectItem>
              <SelectItem value="annulée">Annulée</SelectItem>
            </>
          ) : (
            // Options pour le statut de paiement
            <>
              <SelectItem value="non_payée">Non payé</SelectItem>
              <SelectItem value="partiellement_payée">Partiellement payé</SelectItem>
              <SelectItem value="payée">Payé</SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusSelector;
