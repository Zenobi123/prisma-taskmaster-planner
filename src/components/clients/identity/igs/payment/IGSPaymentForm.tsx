
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface IGSPaymentFormProps {
  patente: IGSPayment;
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  handlePaymentChange: (
    field: 'patente' | 'acompteJanvier' | 'acompteFevrier',
    type: 'montant' | 'quittance',
    value: string
  ) => void;
}

export function IGSPaymentForm({
  patente,
  acompteJanvier,
  acompteFevrier,
  handlePaymentChange
}: IGSPaymentFormProps) {
  return (
    <>
      {/* Patente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem className="space-y-1">
          <Label className="flex items-center gap-1">
            Patente payée pour l'exercice (FCFA)
            <span className="text-xs text-muted-foreground italic ml-1">
              (vient en déduction de l'IGS si autorisée par l'administration fiscale)
            </span>
          </Label>
          <Input 
            type="number" 
            value={patente.montant}
            onChange={(e) => handlePaymentChange('patente', 'montant', e.target.value)}
            placeholder="Montant"
          />
        </FormItem>
        <FormItem>
          <Label>Numéro de quittance</Label>
          <Input 
            value={patente.quittance}
            onChange={(e) => handlePaymentChange('patente', 'quittance', e.target.value)}
            placeholder="Numéro de quittance"
          />
        </FormItem>
      </div>
    </>
  );
}
