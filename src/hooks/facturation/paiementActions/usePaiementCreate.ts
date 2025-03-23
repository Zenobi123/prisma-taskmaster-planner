
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement } from "@/types/paiement";
import { generatePDF } from "@/utils/pdfUtils";

export const usePaiementCreate = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addPaiement = async (paiement: Omit<Paiement, "id">) => {
    setIsLoading(true);
    try {
      // Format the elements_specifiques field for proper storage
      const elements_specifiques = {
        type_paiement: paiement.type_paiement || "total",
        prestations_payees: paiement.prestations_payees || []
      };

      // Générer une référence au format PAY-XXX 2025
      const currentYear = new Date().getFullYear();
      const randomString = Math.random().toString(36).substring(2, 5).toUpperCase();
      const paymentReference = `PAY-${randomString} ${currentYear}`;

      // Adapter les données du formulaire au format de la table
      const paiementData = {
        client_id: paiement.client_id,
        facture_id: paiement.est_credit ? null : paiement.facture, // Utiliser null si c'est un crédit
        date: paiement.date,
        montant: paiement.montant,
        mode: paiement.mode,
        est_credit: paiement.est_credit || false,
        est_verifie: ["orange_money", "mtn_money"].includes(paiement.mode) ? false : true,
        reference: paymentReference,
        reference_transaction: paiement.reference_transaction,
        notes: paiement.notes,
        solde_restant: paiement.solde_restant,
        elements_specifiques: elements_specifiques
      };

      console.log("Sending payment data:", paiementData);

      const { data, error } = await supabase
        .from("paiements")
        .insert(paiementData)
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("Payment saved successfully:", data);

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

  const generatePaiementReceipt = (paiement: Paiement) => {
    // Cette fonction sera implémentée plus tard pour générer un reçu PDF
    console.log("Génération du reçu pour le paiement:", paiement.id);
    // Ici nous appellerons une fonction de génération de PDF
  };

  return {
    addPaiement,
    generatePaiementReceipt,
    isLoading
  };
};
