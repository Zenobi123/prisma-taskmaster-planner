
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BadgeEuro, CalendarCheck, AlertTriangle } from "lucide-react";
import { 
  getIGSPaymentDeadlines, 
  calculatePaymentStatus,
  calculateQuarterlyPayment
} from "../utils/igsCalculations";

interface IGSPaymentDeadlinesProps {
  totalAmount: number | null;
  completedPayments: string[];
  onPaymentToggle: (paymentId: string, isChecked: boolean) => void;
  readOnly?: boolean;
}

export function IGSPaymentDeadlines({ 
  totalAmount, 
  completedPayments, 
  onPaymentToggle,
  readOnly = false
}: IGSPaymentDeadlinesProps) {
  const [paymentStatus, setPaymentStatus] = useState({ isUpToDate: true, message: "" });
  const deadlines = getIGSPaymentDeadlines();
  const quarterlyAmount = calculateQuarterlyPayment(totalAmount);
  
  useEffect(() => {
    setPaymentStatus(calculatePaymentStatus(completedPayments));
  }, [completedPayments]);

  if (totalAmount === null || quarterlyAmount === null) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-medium flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-blue-600" />
          Échéances de paiement
          <Badge variant={paymentStatus.isUpToDate ? "success" : "destructive"} className="ml-2">
            {paymentStatus.isUpToDate ? "À jour" : "En retard"}
          </Badge>
        </h4>
        
        {!paymentStatus.isUpToDate && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {paymentStatus.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {deadlines.map(deadline => (
          <div key={deadline.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
            <Checkbox 
              id={`payment-${deadline.id}`}
              checked={completedPayments.includes(deadline.id)}
              onCheckedChange={(checked) => {
                if (!readOnly) {
                  onPaymentToggle(deadline.id, checked === true);
                }
              }}
              disabled={readOnly}
            />
            <label 
              htmlFor={`payment-${deadline.id}`}
              className="text-sm flex-1 flex justify-between cursor-pointer"
            >
              <span>{deadline.label}</span>
              <span className="font-medium text-blue-700 flex items-center">
                <BadgeEuro className="h-3 w-3 mr-1" />
                {quarterlyAmount.toLocaleString()} FCFA
              </span>
            </label>
          </div>
        ))}
      </div>
      
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex justify-between items-center">
          <p className="text-sm text-blue-800">
            Payé: {completedPayments.length} sur 4 échéances
          </p>
          <p className="text-sm font-medium text-blue-800">
            {(quarterlyAmount * completedPayments.length).toLocaleString()} / {totalAmount.toLocaleString()} FCFA
          </p>
        </div>
      </div>
    </div>
  );
}
