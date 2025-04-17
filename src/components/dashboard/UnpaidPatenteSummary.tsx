
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnpaidPatenteSummaryProps {
  onViewAllClick: () => void;
  unpaidCount?: number;
  isLoading?: boolean;
}

const UnpaidPatenteSummary = ({ onViewAllClick, unpaidCount, isLoading }: UnpaidPatenteSummaryProps) => {
  // Use the internal query only if unpaidCount is not provided as a prop
  const { 
    data: clients = [], 
    isLoading: internalLoading, 
    error 
  } = useQuery({
    queryKey: ["clients-unpaid-patente-summary"],
    queryFn: getClientsWithUnpaidPatente,
    // Only fetch if unpaidCount is not provided
    enabled: unpaidCount === undefined,
    // Configure auto-refresh
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  // Use either the passed count or the fetched count
  const displayCount = unpaidCount !== undefined ? unpaidCount : clients.length;
  const showLoading = isLoading !== undefined ? isLoading : internalLoading;

  console.log("UnpaidPatenteSummary - Clients:", displayCount);
  console.log("UnpaidPatenteSummary - isLoading:", showLoading);
  console.log("UnpaidPatenteSummary - error:", error);
  console.log("UnpaidPatenteSummary - Le composant est bien rendu");

  if (showLoading) {
    return (
      <Card className="bg-white shadow-md">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-md border-2 border-red-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
              IGS impayés
            </h3>
            <div className="flex items-center mt-3">
              <span className="text-4xl font-semibold text-red-600">{displayCount}</span>
              <div className="ml-4">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  À régulariser
                </span>
                <p className="text-neutral-500 mt-1">Clients assujettis</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-red-300 hover:bg-red-50 hover:text-red-700" 
            onClick={onViewAllClick}
          >
            Voir tous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnpaidPatenteSummary;
