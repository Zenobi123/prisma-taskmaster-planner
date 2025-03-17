
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { FiscalAlert } from "@/hooks/fiscal/types";

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

  // Filter alerts to display: expired ones first, then ones expiring soon
  const expiredAlerts = alerts.filter(alert => alert.description.includes('expirée'));
  const expiringAlerts = alerts.filter(alert => !alert.description.includes('expirée'));
  
  // Combine them with expired ones shown first
  const sortedAlerts = [...expiredAlerts, ...expiringAlerts];

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
            Alertes Fiscales
          </div>
          {alerts.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {alerts.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAlerts.length > 0 ? (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {sortedAlerts.map((alert, index) => {
              const isExpired = alert.description.includes('expirée');
              return (
                <Alert 
                  key={index} 
                  variant="destructive" 
                  className={isExpired 
                    ? "border-red-300 bg-red-50" 
                    : "border-amber-300 bg-amber-50"
                  }
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {isExpired ? (
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                      ) : (
                        <Info className="h-4 w-4 text-amber-600" />
                      )}
                      <div>
                        <AlertTitle className={isExpired ? "text-red-800" : "text-amber-800"}>
                          {alert.title}
                          <Bell className="inline-block ml-2 h-3 w-3" title="Notification activée" />
                        </AlertTitle>
                        <AlertDescription className={isExpired ? "text-red-700" : "text-amber-700"}>
                          {alert.description}
                        </AlertDescription>
                      </div>
                    </div>
                    {alert.clientId && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`ml-2 mt-1 text-xs ${isExpired 
                          ? "border-red-400 hover:bg-red-100" 
                          : "border-amber-400 hover:bg-amber-100"
                        }`}
                        onClick={() => handleViewDetails(alert.clientId)}
                      >
                        Voir détails
                      </Button>
                    )}
                  </div>
                </Alert>
              );
            })}
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
