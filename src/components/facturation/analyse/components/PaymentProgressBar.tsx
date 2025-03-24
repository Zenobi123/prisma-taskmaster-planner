
import { Progress } from "@/components/ui/progress";

interface PaymentProgressBarProps {
  pourcentagePaye: number;
}

export const PaymentProgressBar = ({ pourcentagePaye }: PaymentProgressBarProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progression du paiement</span>
        <span className="text-sm font-medium">{pourcentagePaye.toFixed(0)}%</span>
      </div>
      <Progress value={pourcentagePaye} className="h-2" />
    </div>
  );
};
