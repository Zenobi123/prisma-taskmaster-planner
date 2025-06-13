
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsWithUnfiledDsf } from "@/services/unfiledDsfService";
import UnfiledDsfSummary from "../UnfiledDsfSummary";
import { UnfiledDsfDialog } from "../UnfiledDsfDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle } from "lucide-react";

const DsfSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Utiliser le service spécialisé pour récupérer les données DSF
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients-unfiled-dsf-section"],
    queryFn: getClientsWithUnfiledDsf,
    refetchInterval: 10000,        // Rafraîchissement toutes les 10 secondes
    refetchOnWindowFocus: true,    // Rafraîchissement quand la fenêtre reprend le focus
    staleTime: 5000,               // Données considérées comme périmées après 5 secondes
    gcTime: 30000                  // Nettoyage du cache après 30 secondes
  });

  return (
    <div className="p-4 space-y-6">
      {/* Résumé des DSF non déposées avec fonctionnalité "À régulariser" */}
      <Card className="bg-white shadow-md border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-neutral-800 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                DSF non déposées
                {clients.length > 0 && (
                  <span className="ml-3 inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    À régulariser
                  </span>
                )}
              </h3>
              <div className="flex items-center mt-3">
                <span className="text-4xl font-semibold text-blue-600">{clients.length}</span>
                <div className="ml-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {clients.length > 0 ? "À régulariser" : "À jour"}
                  </span>
                  <p className="text-neutral-500 mt-1">Clients assujettis</p>
                </div>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 border-blue-300 hover:bg-blue-50 hover:text-blue-700" 
              onClick={() => setIsDialogOpen(true)}
            >
              Voir tous
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog pour la vue complète */}
      <UnfiledDsfDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
    </div>
  );
};

export default DsfSection;
