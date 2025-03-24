
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
          clients:client_id (nom, raisonsociale)
        `)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      // Format data to match Paiement type
      const formattedPaiements: Paiement[] = data.map(p => {
        // Parse elements_specifiques for type_paiement and prestations_payees
        let typePaiement = "total";
        let prestationsPayees: PrestationPayee[] = [];
        
        if (p.elements_specifiques) {
          if (typeof p.elements_specifiques === 'string') {
            try {
              const parsed = JSON.parse(p.elements_specifiques);
              typePaiement = parsed.type_paiement || "total";
              prestationsPayees = parsed.prestations_payees || [];
            } catch (e) {
              console.error("Error parsing elements_specifiques:", e);
            }
          } else if (typeof p.elements_specifiques === 'object') {
            // It's already an object, just extract the values - typed correctly for TypeScript
            const elemSpecObj = p.elements_specifiques as Record<string, any>;
            typePaiement = elemSpecObj.type_paiement || "total";
            prestationsPayees = (elemSpecObj.prestations_payees || []).map((pp: any) => ({
              id: pp.id,
              montant_modifie: pp.montant_modifie
            }));
          }
        }
        
        return {
          id: p.id,
          facture: p.facture_id || "",
          client: p.clients ? (p.clients.nom || p.clients.raisonsociale) : "",
          client_id: p.client_id,
          date: p.date,
          montant: p.montant,
          mode: p.mode as "espèces" | "virement" | "orange_money" | "mtn_money",
          solde_restant: p.solde_restant || 0,
          est_credit: p.est_credit || false,
          est_verifie: p.est_verifie || false,
          reference: p.reference || "",
          notes: p.notes || "",
          reference_transaction: p.reference_transaction || "",
          type_paiement: typePaiement as "total" | "partiel",
          prestations_payees: prestationsPayees
        };
      });
      
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
