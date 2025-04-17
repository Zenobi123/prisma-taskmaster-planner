
import { FormItem } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { IGSPayment } from "@/hooks/fiscal/types/igsTypes";

interface IGSPaymentFormProps {
  acompteJanvier: IGSPayment;
  acompteFevrier: IGSPayment;
  handlePaymentChange: (
    field: 'acompteJanvier' | 'acompteFevrier',
    type: 'montant' | 'quittance',
    value: string
  ) => void;
}

export function IGSPaymentForm({
  acompteJanvier,
  acompteFevrier,
  handlePaymentChange
}: IGSPaymentFormProps) {
  return null; // This component is now empty as the patente section is removed
}

