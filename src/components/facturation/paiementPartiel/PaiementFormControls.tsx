
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PaiementFormControlsProps {
  montantPaiement: number;
  moyenPaiement: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement';
  notes: string;
  setMontantPaiement: (montant: number) => void;
  setMoyenPaiement: (moyenPaiement: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement') => void;
  setNotes: (notes: string) => void;
  isReadOnly: boolean;
}

export const PaiementFormControls = ({
  montantPaiement,
  moyenPaiement,
  notes,
  setMontantPaiement,
  setMoyenPaiement,
  setNotes,
  isReadOnly
}: PaiementFormControlsProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="montant">Montant à payer</Label>
          <Input 
            id="montant" 
            type="number" 
            value={montantPaiement}
            onChange={(e) => setMontantPaiement(Number(e.target.value))}
            readOnly={isReadOnly}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="moyen-paiement">Moyen de paiement</Label>
          <Select 
            defaultValue={moyenPaiement} 
            onValueChange={(val: any) => setMoyenPaiement(val)}
          >
            <SelectTrigger id="moyen-paiement">
              <SelectValue placeholder="Sélectionnez un moyen de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="especes">Espèces</SelectItem>
              <SelectItem value="orange_money">Orange Money</SelectItem>
              <SelectItem value="mtn_mobile">MTN Mobile Money</SelectItem>
              <SelectItem value="virement">Virement bancaire</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optionnel)</Label>
        <Input
          id="notes"
          placeholder="Notes sur le paiement..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </>
  );
};
