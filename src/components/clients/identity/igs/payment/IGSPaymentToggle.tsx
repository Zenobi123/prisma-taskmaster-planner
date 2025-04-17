
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface IGSPaymentToggleProps {
  showPayments: boolean;
  setShowPayments: (show: boolean) => void;
}

export function IGSPaymentToggle({ showPayments, setShowPayments }: IGSPaymentToggleProps) {
  return (
    <div className="flex items-center space-x-2 pt-4">
      <Switch 
        id="showPayments" 
        checked={showPayments} 
        onCheckedChange={setShowPayments} 
      />
      <Label htmlFor="showPayments" className="font-medium">
        Activer les paiements et déductions
      </Label>
    </div>
  );
}
