import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";

export const usePaiements = () => {
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const transformPaiementFromDb = (paiement: any): Paiement => {
    return {
      id: paiement.id,
      client: paiement.client,
      client_id: paiement.client_id,
      facture: paiement.facture || "",
      date: paiement.date,
      montant: paiement.montant,
      mode: paiement.mode,
      reference: paiement.reference,
      reference_transaction: paiement.reference_transaction || "",
      solde_restant: paiement.solde_restant || 0,
      est_credit: paiement.est_credit || false,
      notes: paiement.notes || "",
      type_paiement: paiement.type_paiement || "total",
      prestations_payees: paiement.prestations_payees || []
    };
  };

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
          clients(
            nom,
            raisonsociale
          )
        `)
        .order('date', { ascending: false });

      if (error) throw error;

      // Transform the data to ensure all required fields are present
      const transformedData = data.map(transformPaiementFromDb);
      setPaiements(transformedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching paiements:", error);
      setLoading(false);
    }
  };

  const addPaiement = async (paiement: Omit<Paiement, "id">) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("paiements")
        .insert([paiement])
        .select()
        .single();

      if (error) throw error;

      fetchPaiements();

      toast({
        title: "Paiement ajouté",
        description: `Le paiement pour ${paiement.client} a été ajouté avec succès.`,
      });

      return data;
    } catch (error) {
      console.error("Error adding paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le paiement. Veuillez réessayer.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("paiements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;

      fetchPaiements();

      toast({
        title: "Paiement mis à jour",
        description: `Le paiement a été mis à jour avec succès.`,
      });

      return data;
    } catch (error) {
      console.error("Error updating paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement. Veuillez réessayer.",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deletePaiement = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("paiements")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      fetchPaiements();

      toast({
        title: "Paiement supprimé",
        description: `Le paiement a été supprimé avec succès.`,
      });

      return true;
    } catch (error) {
      console.error("Error deleting paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le paiement. Veuillez réessayer.",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const filteredPaiements = paiements.filter(paiement =>
    paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    paiements,
    searchTerm,
    setSearchTerm,
    filteredPaiements,
    loading,
    addPaiement,
    updatePaiement,
    deletePaiement,
    dialogOpen,
    setDialogOpen
  };
};
