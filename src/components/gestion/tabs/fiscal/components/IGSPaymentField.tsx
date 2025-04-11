
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";

interface IGSPaymentFieldProps {
  label: string;
  quittanceLabel?: string;
  payment: IGSPayment;
  onChange: (montant: string, quittance: string) => void;
}

export function IGSPaymentField({ 
  label, 
  quittanceLabel = "Numéro de quittance", 
  payment, 
  onChange 
}: IGSPaymentFieldProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormItem>
        <Label>{label}</Label>
        <Input 
          type="number" 
          value={payment.montant}
          onChange={(e) => onChange(e.target.value, payment.quittance)}
          placeholder="Montant"
        />
      </FormItem>
      <FormItem>
        <Label>{quittanceLabel}</Label>
        <Input 
          value={payment.quittance}
          onChange={(e) => onChange(payment.montant, e.target.value)}
          placeholder="Numéro de quittance"
        />
      </FormItem>
    </div>
  );
}
