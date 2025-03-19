
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormItem } from "@/components/ui/form";

interface ModeReglementFormProps {
  modeReglement: 'credit' | 'comptant';
  setModeReglement: (mode: 'credit' | 'comptant') => void;
  moyenPaiement: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement' | undefined;
  setMoyenPaiement: (moyen: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement' | undefined) => void;
}

export const ModeReglementForm = ({
  modeReglement,
  setModeReglement,
  moyenPaiement,
  setMoyenPaiement
}: ModeReglementFormProps) => {
  return (
    <div className="space-y-4 border rounded-md p-4">
      <h3 className="font-medium text-base mb-2">Mode de règlement</h3>
      
      <RadioGroup 
        value={modeReglement} 
        onValueChange={(value) => setModeReglement(value as 'credit' | 'comptant')}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="credit" id="credit" />
          <Label htmlFor="credit">À crédit</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="comptant" id="comptant" />
          <Label htmlFor="comptant">Comptant</Label>
        </div>
      </RadioGroup>
      
      {modeReglement === 'comptant' && (
        <div className="mt-4">
          <FormItem className="space-y-2">
            <Label htmlFor="moyenPaiement">Moyen de paiement</Label>
            <Select 
              value={moyenPaiement} 
              onValueChange={(value) => setMoyenPaiement(value as 'especes' | 'orange_money' | 'mtn_mobile' | 'virement')}
            >
              <SelectTrigger id="moyenPaiement" className="w-full">
                <SelectValue placeholder="Sélectionner un moyen de paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="especes">Espèces</SelectItem>
                <SelectItem value="orange_money">Orange Money</SelectItem>
                <SelectItem value="mtn_mobile">MTN Mobile Money</SelectItem>
                <SelectItem value="virement">Virement bancaire</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>
      )}
    </div>
  );
};
