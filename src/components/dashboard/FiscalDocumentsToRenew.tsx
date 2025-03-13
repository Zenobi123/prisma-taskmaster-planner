import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
import type { FiscalDocumentDisplay } from "@/components/gestion/tabs/fiscale/types";

const FiscalDocumentsToRenew = () => {
  const { data: expiringDocuments, isLoading, error } = useQuery({
    queryKey: ["fiscal_documents_to_renew"],
    queryFn: async () => {
      try {
        // Get current date
        const now = new Date();
        
        // Calculate date 7 days from now
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(now.getDate() + 7);
        
        // Query to get documents for clients with externalized management and specific tax regimes
        const { data, error } = await supabase
          .from("fiscal_documents")
          .select(`
            *,
            clients!fiscal_documents_client_id_fkey (
              id, 
              niu, 
              nom, 
              raisonsociale, 
              type,
              gestionexternalisee,
              regimefiscal
            )
          `)
          .eq('document_type', 'ACF')
          .not('valid_until', 'is', null)
          .lt('valid_until', sevenDaysFromNow.toISOString());

        if (error) {
          console.error("Error fetching fiscal documents:", error);
          throw new Error("Erreur lors du chargement des documents fiscaux");
        }

        // Filter the results to only show documents for clients:
        // 1. With externalized management
        // 2. With 'simplifié' or 'réel' tax regime
        const filteredData = data.filter(doc => 
          doc.clients && 
          doc.clients.gestionexternalisee === true && 
          (doc.clients.regimefiscal === 'simplifie' || doc.clients.regimefiscal === 'reel')
        );

        // Return filtered data, or empty array if nothing found (no fallback data)
        return filteredData || [];
      } catch (err) {
        console.error("Error in fetchDocumentsToRenew:", err);
        throw new Error("Une erreur est survenue");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Documents fiscaux à renouveler
        </h2>
        <div className="animate-pulse">
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
          <div className="h-12 bg-neutral-100 rounded-md mb-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card mt-8">
        <h2 className="text-xl font-semibold text-neutral-800 mb-6">
          Documents fiscaux à renouveler
        </h2>
        <div className="p-4 text-destructive">
          {error instanceof Error ? error.message : "Erreur lors du chargement des documents fiscaux"}
        </div>
      </div>
    );
  }

  // Format date for display (DD/MM/YYYY)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Calculate days remaining until expiration
  const calculateDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day for accurate day calculation
    
    const expDate = new Date(expirationDate);
    expDate.setHours(0, 0, 0, 0);
    
    const differenceInTime = expDate.getTime() - today.getTime();
    return Math.ceil(differenceInTime / (1000 * 3600 * 24));
  };

  return (
    <div className="card mt-8">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Documents fiscaux à renouveler
      </h2>
      
      {expiringDocuments && expiringDocuments.length > 0 ? (
        <div className="space-y-4">
          {expiringDocuments.map((doc) => {
            const clientInfo = doc.clients;
            // Display correct client name based on client type
            const clientDisplayName = clientInfo?.type === 'physique' 
              ? clientInfo.nom 
              : clientInfo?.raisonsociale || 'Client';
            
            // Calculate days remaining and format expiration date
            const daysRemaining = calculateDaysRemaining(doc.valid_until);
            const formattedExpDate = formatDate(doc.valid_until);
            
            return (
              <div key={doc.id} className="flex items-start p-3 border rounded-md bg-muted/30 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium">Attestation de Conformité Fiscale</h3>
                  <div className="text-sm text-muted-foreground">
                    {clientDisplayName} 
                    <span className="ml-2">NIU: {clientInfo?.niu}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1 text-amber-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      {daysRemaining > 0 
                        ? `Expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} (${formattedExpDate})`
                        : `Expiré depuis ${Math.abs(daysRemaining)} jour${Math.abs(daysRemaining) > 1 ? 's' : ''} (${formattedExpDate})`
                      }
                    </span>
                  </div>
                </div>
                <Link to="/gestion" className="text-primary hover:underline text-sm">
                  Voir détails
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Aucun document fiscal à renouveler pour le moment.
        </div>
      )}
    </div>
  );
}

export default FiscalDocumentsToRenew;
