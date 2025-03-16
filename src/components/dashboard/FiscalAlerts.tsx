
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FiscalAlert {
  type: string;
  title: string;
  description: string;
}

interface FiscalAlertsProps {
  alerts: FiscalAlert[];
}

const FiscalAlerts = ({ alerts }: FiscalAlertsProps) => {
  if (alerts.length === 0) return null;
  
  return (
    <div className="mb-6 space-y-2">
      {alerts.map((alert, index) => (
        <Alert key={index} variant="destructive" className="border-red-300 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-800">{alert.title}</AlertTitle>
          <AlertDescription className="text-red-700">
            {alert.description}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default FiscalAlerts;
