
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement, PrestationPayee } from "@/types/paiement";
import { usePaiementActions } from "./facturation/paiementActions/usePaiementActions";

export const usePaiements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const paiementActions = usePaiementActions();

  useEffect(() => {
    fetchPaiements();
  }, []);

  const fetchPaiements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("paiements")
        .select(`
          *,
          clients:client_id (nom, raisonsociale),
          factures:facture_id (montant)
        `)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      console.log("Fetched paiements raw data:", data);

      // Format data to match Paiement type
      const formattedPaiements: Paiement[] = data.map(p => {
        // Parse elements_specifiques for type_paiement and prestations_payees
        let typePaiement = "total";
        let prestationsPayees: PrestationPayee[] = [];
        
        if (p.elements_specifiques) {
          try {
            // Ensure we properly parse if it's a string or handle if it's already an object
            const parsedElemSpec = typeof p.elements_specifiques === 'string' 
              ? JSON.parse(p.elements_specifiques) 
              : p.elements_specifiques;
              
            // Get type_paiement with fallback to "total"
            typePaiement = parsedElemSpec.type_paiement || "total";
            
            // Ensure prestations_payees is properly handled as an array with correct mapping
            if (Array.isArray(parsedElemSpec.prestations_payees)) {
              prestationsPayees = parsedElemSpec.prestations_payees.map((pp: any) => ({
                id: pp.id,
                montant_modifie: pp.montant_modifie !== undefined ? pp.montant_modifie : null
              }));
            }
            
            console.log("Processed elements_specifiques for payment", p.id, {
              typePaiement,
              prestationsPayees
            });
          } catch (e) {
            console.error("Error parsing elements_specifiques:", e, p.elements_specifiques);
          }
        }
        
        // Calculate solde_restant more accurately
        let soldeRestant = p.solde_restant || 0;
        
        // If this payment is associated with a facture, recalculate the solde_restant
        if (p.factures && !p.est_credit) {
          const factureMontant = parseFloat(p.factures.montant) || 0;
          
          // Get all payments for this invoice
          supabase
            .from("paiements")
            .select("montant")
            .eq("facture_id", p.facture_id)
            .then(({ data: paiementsData, error: paiementsError }) => {
              if (!paiementsError && paiementsData) {
                // Sum all payments for this invoice
                const totalPaiements = paiementsData.reduce(
                  (sum, payment) => sum + parseFloat(payment.montant), 
                  0
                );
                
                // Update the remaining balance
                soldeRestant = Math.max(0, factureMontant - totalPaiements);
                
                // Update this specific payment in the state
                setPaiements(currentPaiements => 
                  currentPaiements.map(currentP => 
                    currentP.id === p.id 
                      ? { ...currentP, solde_restant: soldeRestant } 
                      : currentP
                  )
                );
              }
            });
        }
        
        // Create the paiement object with all correctly parsed data
        const paiement = {
          id: p.id,
          facture: p.facture_id || "",
          client: p.clients ? (p.clients.nom || p.clients.raisonsociale) : "",
          client_id: p.client_id,
          date: p.date,
          montant: p.montant,
          mode: p.mode as "espèces" | "virement" | "orange_money" | "mtn_money",
          solde_restant: soldeRestant,
          est_credit: p.est_credit || false,
          est_verifie: p.est_verifie || false,
          reference: p.reference || "",
          notes: p.notes || "",
          reference_transaction: p.reference_transaction || "",
          type_paiement: typePaiement as "total" | "partiel",
          prestations_payees: prestationsPayees
        };
        
        return paiement;
      });
      
      console.log("Formatted paiements with calculated remaining balances:", formattedPaiements);
      setPaiements(formattedPaiements);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les paiements."
      });
    } finally {
      setLoading(false);
    }
  };

  const addPaiement = async (newPaiement: Omit<Paiement, "id">) => {
    const result = await paiementActions.addPaiement(newPaiement);
    if (result) {
      fetchPaiements(); // Refresh the list
    }
    return result;
  };

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    const result = await paiementActions.updatePaiement(id, updates);
    if (result) {
      fetchPaiements(); // Refresh the list
    }
    return result;
  };

  const deletePaiement = async (id: string) => {
    const success = await paiementActions.deletePaiement(id);
    if (success) {
      fetchPaiements(); // Refresh the list
    }
    return success;
  };

  // Filter paiements based on search term
  const filteredPaiements = paiements.filter(paiement => {
    if (!searchTerm) return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    return (
      paiement.client.toLowerCase().includes(searchTermLower) ||
      paiement.id.toLowerCase().includes(searchTermLower) ||
      paiement.facture.toLowerCase().includes(searchTermLower) ||
      paiement.reference.toLowerCase().includes(searchTermLower)
    );
  });

  return {
    searchTerm,
    setSearchTerm,
    filteredPaiements,
    loading,
    addPaiement,
    updatePaiement,
    deletePaiement,
    dialogOpen,
    setDialogOpen,
    refreshPaiements: fetchPaiements
  };
};

export default usePaiements;
