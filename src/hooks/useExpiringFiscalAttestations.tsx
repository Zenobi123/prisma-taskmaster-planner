
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { differenceInDays, isValid, parse } from "date-fns";
import { Json } from "@/integrations/supabase/types";

export interface FiscalAttestation {
  id: string;
  name: string;
  creationDate: string;
  expiryDate: string;
  daysRemaining: number;
  type: 'fiscal';
}

export const useExpiringFiscalAttestations = () => {
  return useQuery({
    queryKey: ["expiring-fiscal-attestations"],
    queryFn: async (): Promise<FiscalAttestation[]> => {
      console.log("Fetching clients with fiscal attestations...");
      
      // Get all clients
      const { data: clients, error } = await supabase
        .from("clients")
        .select("*")
        .filter("fiscal_data", "not.is", null);
      
      if (error) {
        console.error("Error fetching clients with fiscal data:", error);
        throw error;
      }
      
      // Filter and process clients with fiscal attestations
      const expiringAttestations: FiscalAttestation[] = [];
      
      clients.forEach((client: any) => {
        try {
          const fiscalData = client.fiscal_data;
          
          // Skip if hidden from dashboard
          if (fiscalData.hiddenFromDashboard === true) {
            return;
          }
          
          // Check if client has attestation data
          if (fiscalData && 
              fiscalData.attestation && 
              fiscalData.attestation.creationDate && 
              fiscalData.attestation.validityEndDate &&
              fiscalData.attestation.showInAlert !== false) {
                
            // Parse the expiry date
            const expiryDate = parse(fiscalData.attestation.validityEndDate, 'dd/MM/yyyy', new Date());
            
            if (isValid(expiryDate)) {
              const today = new Date();
              const daysRemaining = differenceInDays(expiryDate, today);
              
              // Add to the result array, regardless of days remaining
              expiringAttestations.push({
                id: client.id,
                name: client.type === 'physique' ? client.nom : client.raisonsociale,
                creationDate: fiscalData.attestation.creationDate,
                expiryDate: fiscalData.attestation.validityEndDate,
                daysRemaining,
                type: 'fiscal'
              });
            }
          }
        } catch (error) {
          console.error(`Error processing fiscal data for client ${client.id}:`, error);
        }
      });
      
      console.log("Expiring attestations found:", expiringAttestations);
      
      // Sort by days remaining (most urgent first)
      return expiringAttestations.sort((a, b) => a.daysRemaining - b.daysRemaining);
    },
    // Configurer la mise en cache et le rafraîchissement automatique
    staleTime: 2 * 60 * 1000,  // 2 minutes avant que les données soient considérées comme périmées
    gcTime: 10 * 60 * 1000,    // 10 minutes avant le nettoyage du cache
    refetchInterval: 60000,    // Rafraîchir toutes les 60 secondes
    refetchOnWindowFocus: true, // Rafraîchir quand l'utilisateur revient sur l'onglet
    refetchOnMount: true       // Rafraîchir à chaque montage du composant
  });
};
