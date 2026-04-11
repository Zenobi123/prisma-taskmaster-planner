
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/fiscal/unpaidPatenteService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente-section"],
    queryFn: getClientsWithUnpaidPatente,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000
  });

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
      <Card className="bg-white shadow-md border-2 border-red-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-xl font-semibold text-neutral-800 flex items-center">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-red-500 shrink-0" />
                Patentes non payées
              </h3>
              <div className="flex items-center mt-2 sm:mt-3">
                <span className="text-3xl sm:text-4xl font-semibold text-red-600">{clients.length}</span>
                <div className="ml-3 sm:ml-4">
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
              onClick={() => setIsDialogOpen(true)}
            >
              Voir tous
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <UnpaidPatenteDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default PatenteSection;
