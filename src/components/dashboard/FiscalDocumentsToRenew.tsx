
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
        const today = new Date();
        const tenDaysLater = new Date();
        tenDaysLater.setDate(today.getDate() + 10);
        
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
              regimefiscal
            )
          `)
          .eq('name', 'Attestation de Conformité Fiscale')
          .not('valid_until', 'is', null);

        if (error) {
          console.error("Error fetching fiscal documents:", error);
          throw new Error("Erreur lors du chargement des documents fiscaux");
        }

        const processedData = (data || [])
          .filter(doc => {
            const validUntil = doc.valid_until ? new Date(doc.valid_until) : null;
            return validUntil !== null && (validUntil < tenDaysLater || validUntil < today);
          });

        return processedData as FiscalDocumentDisplay[];
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

  const getDocumentStatus = (validUntil: string | null) => {
    if (!validUntil) return null;
    
    const now = new Date();
    const expiryDate = new Date(validUntil);
    
    if (expiryDate < now) {
      const daysSinceExpiry = Math.floor((now.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: 'expired',
        message: `Périmé depuis ${daysSinceExpiry} jour${daysSinceExpiry > 1 ? 's' : ''}`,
        date: expiryDate.toLocaleDateString()
      };
    } else {
      const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: 'expiring',
        message: `Expire dans ${daysUntilExpiry} jour${daysUntilExpiry > 1 ? 's' : ''}`,
        date: expiryDate.toLocaleDateString()
      };
    }
  };

  return (
    <div className="card mt-8">
      <h2 className="text-xl font-semibold text-neutral-800 mb-6">
        Documents fiscaux à renouveler
      </h2>
      
      {expiringDocuments && expiringDocuments.length > 0 ? (
        <div className="space-y-4">
          {expiringDocuments.map((doc) => {
            const status = getDocumentStatus(doc.valid_until);
            if (!status) return null;
            
            const clientInfo = doc.clients;
            const clientName = clientInfo?.type === 'physique' ? clientInfo.nom : clientInfo?.raisonsociale;
            
            return (
              <div key={doc.id} className="flex items-start p-3 border rounded-md bg-muted/30 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium">{doc.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {clientName || 'Client inconnu'} 
                    {clientInfo?.niu && <span className="ml-2">NIU: {clientInfo.niu}</span>}
                  </div>
                  <div className={`flex items-center text-sm mt-1 ${status.type === 'expired' ? 'text-destructive' : 'text-amber-600'}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{status.message} ({status.date})</span>
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
};

export default FiscalDocumentsToRenew;
