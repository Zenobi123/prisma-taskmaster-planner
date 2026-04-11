
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/fiscal/unpaidPatenteService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnpaidPatenteSummaryProps {
  onViewAllClick: () => void;
}

const UnpaidPatenteSummary = ({ onViewAllClick }: UnpaidPatenteSummaryProps) => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients-unpaid-patente-summary"],
    queryFn: getClientsWithUnpaidPatente,
    // Configurer le rafraîchissement automatique
    refetchInterval: 60000,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true
  });


  if (isLoading) {
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base sm:text-xl font-semibold text-neutral-800 flex items-center">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500 shrink-0" />
              Patentes impayées
            </h3>
            <div className="flex items-center mt-2 sm:mt-3 gap-3 sm:gap-4">
              <span className="text-3xl sm:text-4xl font-semibold text-red-600">{clients.length}</span>
              <div>
                <span className="px-2 sm:px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  À régulariser
                </span>
                <p className="text-neutral-500 mt-1 text-xs sm:text-sm">Clients assujettis</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 hover:bg-red-50 hover:text-red-700 shrink-0"
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
