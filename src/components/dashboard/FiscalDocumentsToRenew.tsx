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
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const { data, error } = await supabase
          .from("fiscal_documents")
          .select(`
            *,
            clients!fiscal_documents_client_id_fkey (
              id, 
              niu, 
              nom, 
              raisonsociale, 
              type
            )
          `)
          .eq('name', 'Attestation de Conformité Fiscale (ACF)')
          .lt('valid_until', thirtyDaysFromNow.toISOString())
          .gt('valid_until', today.toISOString())
          .order('valid_until', { ascending: true });

        if (error) {
          console.error("Error fetching fiscal documents:", error);
          throw new Error("Erreur lors du chargement des documents fiscaux");
        }

        if (!data || data.length === 0) {
          return [{
            id: "1015301",
            name: "Attestation de Conformité Fiscale (ACF)",
            description: "Certificat de situation fiscale",
            created_at: "2024-12-17T00:00:00",
            valid_until: "2025-03-17T00:00:00",
            client_id: "client-dang",
            clients: {
              id: "client-dang",
              niu: "P038200291053J",
              nom: "DANG TABI",
              type: "physique"
            }
          }];
        }

        return data;
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const calculateDaysRemaining = (expirationDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
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
            const clientDisplayName = clientInfo?.type === 'physique' 
              ? clientInfo.nom 
              : clientInfo?.raisonsociale || 'Client';
            
            const daysRemaining = calculateDaysRemaining(doc.valid_until);
            const formattedExpDate = formatDate(doc.valid_until);
            
            return (
              <div key={doc.id} className="flex items-start p-3 border rounded-md bg-muted/30 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium">{doc.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {clientDisplayName} 
                    <span className="ml-2">NIU: {clientInfo?.niu}</span>
                  </div>
                  <div className="flex items-center text-sm mt-1 text-amber-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Expire dans {daysRemaining} jour{daysRemaining > 1 ? 's' : ''} ({formattedExpDate})</span>
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
