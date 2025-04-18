
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnfiledDsfSummaryProps {
  onViewAllClick: () => void;
}

const UnfiledDsfSummary = ({ onViewAllClick }: UnfiledDsfSummaryProps) => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ["clients-unfiled-dsf-summary"],
    queryFn: getClientsWithUnfiledDsf,
    // Configurer le rafraîchissement automatique avec des paramètres cohérents
    refetchInterval: 10000,        // Rafraîchissement toutes les 10 secondes
    refetchOnWindowFocus: true,    // Rafraîchissement quand la fenêtre reprend le focus
    staleTime: 5000,               // Données considérées comme périmées après 5 secondes
    gcTime: 30000                  // Nettoyage du cache après 30 secondes
  });

  console.log("UnfiledDsfSummary - Clients:", clients.length);
  console.log("UnfiledDsfSummary - isLoading:", isLoading);
  console.log("UnfiledDsfSummary - error:", error);
  console.log("UnfiledDsfSummary - Le composant est bien rendu");

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
    <Card className="bg-white shadow-md border-2 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              DSF non déposées
            </h3>
            <div className="flex items-center mt-3">
              <span className="text-4xl font-semibold text-blue-600">{clients.length}</span>
              <div className="ml-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  À régulariser
                </span>
                <p className="text-neutral-500 mt-1">Clients assujettis</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0 border-blue-300 hover:bg-blue-50 hover:text-blue-700" 
            onClick={onViewAllClick}
          >
            Voir tous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnfiledDsfSummary;
