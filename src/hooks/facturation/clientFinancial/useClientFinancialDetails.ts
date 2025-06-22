
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ClientFinancialDetails } from "@/types/clientFinancial";
import { supabase } from "@/integrations/supabase/client";
import { isOverdue } from "@/services/factureServices/factureStatusService";

export const useClientFinancialDetails = () => {
  const { toast } = useToast();
  const [clientDetails, setClientDetails] = useState<ClientFinancialDetails | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClientDetails = async (clientId: string) => {
    try {
      setIsLoading(true);
      console.log("Récupération des détails financiers du client:", clientId);
      
      // First, get the client information
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (clientError) {
        throw new Error(clientError.message);
      }
      
      const { data: factures, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'envoyée');
        
      if (facturesError) {
        throw new Error(facturesError.message);
      }
      
      const factureIds = factures.map(f => f.id);
      
      const { data: paiements, error: paiementsError } = await supabase
        .from('paiements')
        .select('*')
        .in('facture_id', factureIds.length > 0 ? factureIds : ['none']);
        
      if (paiementsError) {
        throw new Error(paiementsError.message);
      }
      
      const { data: credits, error: creditsError } = await supabase
        .from('paiements')
        .select('*')
        .eq('client_id', clientId)
        .eq('est_credit', true);
        
      if (creditsError) {
        throw new Error(creditsError.message);
      }
      
      const allPaiements = [...paiements, ...(credits || [])];
      
      const facturesWithRemaining = factures.map(facture => {
        const facturePayments = paiements.filter(p => p.facture_id === facture.id);
        const totalPaye = facturePayments.reduce((sum, p) => sum + parseFloat(String(p.montant)), 0);
        const montantRestant = parseFloat(String(facture.montant)) - totalPaye;
        
        const isPastDue = isOverdue(facture.echeance, totalPaye, parseFloat(String(facture.montant)));
        const statusPaiement = isPastDue && totalPaye < parseFloat(String(facture.montant)) 
          ? "en_retard" 
          : facture.status_paiement;
        
        return {
          ...facture,
          montant_paye: totalPaye,
          montant_restant: montantRestant,
          status_paiement: statusPaiement
        };
      });
      
      const soldeDisponible = credits?.reduce((sum, credit) => {
        if (!credit.facture_id) {
          return sum + parseFloat(String(credit.montant));
        }
        return sum;
      }, 0) || 0;
      
      const details: ClientFinancialDetails = {
        id: clientData.id,
        nom: clientData.nom || clientData.raisonsociale,
        factures: facturesWithRemaining,
        paiements: allPaiements,
        solde_disponible: soldeDisponible,
        client: clientData // Add the full client data here
      };
      
      console.log("Détails financiers récupérés avec succès", details);
      setClientDetails(details);
      setSelectedClientId(clientId);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails financiers du client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les détails financiers du client",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    isLoading
  };
};
