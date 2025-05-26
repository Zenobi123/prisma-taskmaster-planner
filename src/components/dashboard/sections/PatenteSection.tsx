
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnpaidPatente } from "@/services/unpaidPatenteService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { UnpaidPatenteDialog } from "../UnpaidPatenteDialog";

const PatenteSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unpaid-patente-section"],
    queryFn: getClientsWithUnpaidPatente,
    refetchInterval: 10000,
    refetchOnWindowFocus: true
  });

  return (
    <div className="p-4 space-y-6">
      <Card className="bg-white shadow-md border-2 border-red-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Patentes non payées
              </h3>
              <div className="flex items-center mt-3">
                <span className="text-4xl font-semibold text-red-600">{clients.length}</span>
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
