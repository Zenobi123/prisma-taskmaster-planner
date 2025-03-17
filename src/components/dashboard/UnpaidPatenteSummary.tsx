
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnpaidPatenteSummaryProps {
  onViewAllClick: () => void;
}

const UnpaidPatenteSummary = ({ onViewAllClick }: UnpaidPatenteSummaryProps) => {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente-summary"],
    queryFn: getClientsWithUnpaidPatente,
  });

  console.log("UnpaidPatenteSummary - Clients:", clients.length);
  console.log("UnpaidPatenteSummary - isLoading:", isLoading);

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800">Patentes impayées</h3>
            <div className="flex items-center mt-3">
              <span className="text-4xl font-semibold text-emerald-600">{clients.length}</span>
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
            className="mt-4 md:mt-0" 
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
