
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ClientFinancialSummary, ClientFinancialDetails } from "@/types/clientFinancial";

export const useClientFinancial = () => {
  const { toast } = useToast();
  const [clientsSummary, setClientsSummary] = useState<ClientFinancialSummary[]>([]);
  const [chartData, setChartData] = useState<{ name: string; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clientDetails, setClientDetails] = useState<ClientFinancialDetails | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  // Fonction pour récupérer la liste des clients avec leur situation financière
  const fetchClientsFinancialData = async () => {
    try {
      setIsLoading(true);
      console.log("Récupération des données financières des clients...");
      
      // Requête pour récupérer tous les clients
      const { data: clients, error: clientsError } = await supabase
        .from('clients')
        .select('*');
        
      if (clientsError) {
        throw new Error(clientsError.message);
      }
      
      // Résultats pour le graphique
      const statusGroups: Record<string, number> = {
        "À jour": 0,
        "Partiellement payé": 0,
        "En retard": 0
      };

      // Récupérer toutes les données des factures ENVOYÉES
      const { data: factures, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('status', 'envoyée');

      if (facturesError) {
        throw new Error(facturesError.message);
      }
      
      // Récupérer tous les paiements
      const { data: paiements, error: paiementsError } = await supabase
        .from('paiements')
        .select('*');
        
      if (paiementsError) {
        throw new Error(paiementsError.message);
      }

      // Organiser les factures et paiements par client
      const clientsData: Record<string, {
        factures: any[];
        paiements: any[];
        facturesMontant: number;
        paiementsMontant: number;
      }> = {};

      // Initialiser les données des clients
      clients.forEach((client) => {
        clientsData[client.id] = {
          factures: [],
          paiements: [],
          facturesMontant: 0,
          paiementsMontant: 0
        };
      });

      // Ajouter les factures aux clients
      factures.forEach((facture) => {
        if (clientsData[facture.client_id]) {
          clientsData[facture.client_id].factures.push(facture);
          clientsData[facture.client_id].facturesMontant += parseFloat(facture.montant);
        }
      });

      // Ajouter les paiements aux clients
      paiements.forEach((paiement) => {
        // Trouver à quel client appartient ce paiement
        const factureClientId = factures.find((f) => f.id === paiement.facture_id)?.client_id;
        
        if (factureClientId && clientsData[factureClientId]) {
          clientsData[factureClientId].paiements.push(paiement);
          clientsData[factureClientId].paiementsMontant += parseFloat(paiement.montant);
        }
      });

      // Préparer les données de résumé financier pour chaque client
      const summaryData: ClientFinancialSummary[] = clients.map((client) => {
        const clientData = clientsData[client.id] || { facturesMontant: 0, paiementsMontant: 0, factures: [] };
        
        // Ne considérer que les clients ayant des factures
        if (clientData.factures.length === 0) {
          return {
            id: client.id,
            nom: client.type === 'physique' ? client.nom : client.raisonsociale,
            facturesMontant: 0,
            paiementsMontant: 0,
            solde: 0,
            status: "àjour"
          };
        }
        
        const solde = clientData.paiementsMontant - clientData.facturesMontant;
        let status = "àjour";
        
        // Déterminer le statut financier du client
        if (solde < 0) {
          // Vérifier s'il y a des factures en retard
          const unpaidInvoices = clientData.factures.filter(
            (f) => new Date(f.echeance) < new Date() && 
                  (f.montant_paye === 0 || f.montant_paye < f.montant)
          );
          
          if (unpaidInvoices.length > 0) {
            status = "retard";
            statusGroups["En retard"]++;
          } else if (clientData.paiementsMontant > 0) {
            status = "partiel";
            statusGroups["Partiellement payé"]++;
          } else {
            status = "retard";
            statusGroups["En retard"]++;
          }
        } else {
          statusGroups["À jour"]++;
        }
        
        return {
          id: client.id,
          nom: client.type === 'physique' ? client.nom : client.raisonsociale,
          facturesMontant: clientData.facturesMontant,
          paiementsMontant: clientData.paiementsMontant,
          solde,
          status
        };
      }).filter(client => client.facturesMontant > 0); // Ne conserver que les clients ayant des factures

      // Préparer les données pour le graphique
      const chartData = Object.entries(statusGroups).map(([name, total]) => ({
        name,
        total
      }));

      console.log("Données des clients récupérées avec succès", {
        clients: summaryData.length,
        chartData
      });
      
      setClientsSummary(summaryData);
      setChartData(chartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données financières des clients:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les données financières des clients",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch client financial details
  const fetchClientDetails = async (clientId: string) => {
    try {
      setIsLoading(true);
      console.log("Récupération des détails financiers du client:", clientId);
      
      // Récupérer toutes les factures du client
      const { data: factures, error: facturesError } = await supabase
        .from('factures')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'envoyée');
        
      if (facturesError) {
        throw new Error(facturesError.message);
      }
      
      // Récupérer tous les paiements liés aux factures du client
      const factureIds = factures.map(f => f.id);
      
      const { data: paiements, error: paiementsError } = await supabase
        .from('paiements')
        .select('*')
        .in('facture_id', factureIds.length > 0 ? factureIds : ['none']);
        
      if (paiementsError) {
        throw new Error(paiementsError.message);
      }
      
      // Récupérer les crédits (paiements en avance) du client
      const { data: credits, error: creditsError } = await supabase
        .from('paiements')
        .select('*')
        .eq('client_id', clientId)
        .eq('est_credit', true);
        
      if (creditsError) {
        throw new Error(creditsError.message);
      }
      
      // Combiner tous les paiements (factures et crédits)
      const allPaiements = [...paiements, ...(credits || [])];
      
      // Calculer le montant restant pour chaque facture
      const facturesWithRemaining = factures.map(facture => {
        const facturePayments = paiements.filter(p => p.facture_id === facture.id);
        const totalPaye = facturePayments.reduce((sum, p) => sum + parseFloat(p.montant), 0);
        const montantRestant = parseFloat(facture.montant) - totalPaye;
        
        return {
          ...facture,
          montant_paye: totalPaye,
          montant_restant: montantRestant
        };
      });
      
      // Calculer le solde disponible (crédits non utilisés)
      const soldeDisponible = credits?.reduce((sum, credit) => {
        // N'inclure que les crédits qui ne sont pas liés à une facture
        if (!credit.facture_id) {
          return sum + parseFloat(credit.montant);
        }
        return sum;
      }, 0) || 0;
      
      const clientDetails: ClientFinancialDetails = {
        id: clientId,
        factures: facturesWithRemaining,
        paiements: allPaiements,
        solde_disponible: soldeDisponible
      };
      
      console.log("Détails financiers récupérés avec succès", clientDetails);
      setClientDetails(clientDetails);
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

  // Fonction pour appliquer un crédit à une facture
  const handleApplyCreditToInvoice = async (invoiceId: string, creditId: string, amount: number) => {
    try {
      console.log("Application d'un crédit à une facture:", { invoiceId, creditId, amount });
      
      const { error } = await supabase
        .functions
        .invoke('apply-credit', {
          body: { 
            invoiceId,
            creditId,
            amount
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le crédit a été appliqué à la facture",
      });
      
      // Rafraîchir les données
      if (selectedClientId) {
        await fetchClientDetails(selectedClientId);
      }
      await fetchClientsFinancialData();
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'application du crédit:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'appliquer le crédit à la facture",
        variant: "destructive",
      });
      return false;
    }
  };

  // Fonction pour créer un rappel de paiement
  const handleCreateReminder = async (invoiceId: string, method: 'email' | 'sms' | 'both') => {
    try {
      console.log("Création d'un rappel de paiement:", { invoiceId, method });
      
      const { error } = await supabase
        .functions
        .invoke('send-payment-reminders', {
          body: { 
            invoiceId,
            method
          }
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Succès",
        description: "Le rappel de paiement a été envoyé",
      });
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la création du rappel:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le rappel de paiement",
        variant: "destructive",
      });
      return false;
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchClientsFinancialData();
  }, []);

  return {
    clientsSummary,
    isLoading,
    chartData,
    clientDetails,
    selectedClientId,
    setSelectedClientId,
    fetchClientDetails,
    handleApplyCreditToInvoice,
    handleCreateReminder
  };
};

export default useClientFinancial;
