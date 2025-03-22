
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";
import { generatePDF } from "@/utils/pdfUtils";

export const usePaiementActions = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addPaiement = async (paiement: Omit<Paiement, "id">) => {
    setIsLoading(true);
    try {
      // Adapter les données du formulaire au format de la table
      const paiementData = {
        client_id: paiement.client_id,
        facture_id: paiement.est_credit ? null : paiement.facture, // Utiliser null si c'est un crédit
        date: paiement.date,
        montant: paiement.montant,
        mode: paiement.mode,
        est_credit: paiement.est_credit || false,
        est_verifie: ["orange_money", "mtn_money"].includes(paiement.mode) ? false : true,
        reference: paiement.reference,
        reference_transaction: paiement.reference_transaction,
        notes: paiement.notes,
        solde_restant: paiement.solde_restant
      };

      const { data, error } = await supabase
        .from("paiements")
        .insert(paiementData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Paiement enregistré",
        description: `Le paiement a été enregistré avec succès.`,
      });

      // Générer le reçu PDF
      generatePaiementReceipt(data as unknown as Paiement);

      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ajouter le paiement. Veuillez réessayer.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePaiement = async (id: string, updates: Partial<Paiement>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("paiements")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Paiement mis à jour",
        description: `Le paiement a été mis à jour avec succès.`,
      });

      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le paiement. Veuillez réessayer.",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePaiement = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("paiements")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      toast({
        title: "Paiement supprimé",
        description: `Le paiement a été supprimé avec succès.`,
      });

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression du paiement:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le paiement. Veuillez réessayer.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const generatePaiementReceipt = (paiement: Paiement) => {
    // Cette fonction sera implémentée plus tard pour générer un reçu PDF
    console.log("Génération du reçu pour le paiement:", paiement.id);
    // Ici nous appellerons une fonction de génération de PDF
  };

  return {
    addPaiement,
    updatePaiement,
    deletePaiement,
    generatePaiementReceipt,
    isLoading
  };
};

export default usePaiementActions;
