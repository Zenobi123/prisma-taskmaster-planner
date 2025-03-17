
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FiscalAlert {
  type: string;
  title: string;
  description: string;
  clientId?: string;
}

interface FiscalAlertsProps {
  alerts: FiscalAlert[];
}

const FiscalAlerts = ({ alerts }: FiscalAlertsProps) => {
  const navigate = useNavigate();

  const handleViewDetails = (clientId?: string) => {
    if (clientId) {
      navigate(`/gestion?client=${clientId}&tab=obligations-fiscales`);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
          Alertes Fiscales
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive" className="border-red-300 bg-red-50">
                <div className="flex justify-between items-start">
                  <div>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">{alert.title}</AlertTitle>
                    <AlertDescription className="text-red-700">
                      {alert.description}
                    </AlertDescription>
                  </div>
                  {alert.clientId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-2 mt-1 text-xs border-red-400 hover:bg-red-100"
                      onClick={() => handleViewDetails(alert.clientId)}
                    >
                      Voir détails
                    </Button>
                  )}
                </div>
              </Alert>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-neutral-500">
            Aucune alerte fiscale pour le moment
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FiscalAlerts;
