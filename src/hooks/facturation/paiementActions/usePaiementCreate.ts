
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement, PrestationPayee } from "@/types/paiement";
import { generatePDF } from "@/utils/pdfUtils";
import { Facture } from "@/types/facture";

export const usePaiementCreate = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const addPaiement = async (paiement: Omit<Paiement, "id">) => {
    setIsLoading(true);
    try {
      // Format prestations_payees for proper JSON storage
      const prestationsPayeesFormatted = paiement.prestations_payees ? 
        paiement.prestations_payees.map(p => ({
          id: p.id,
          montant_modifie: p.montant_modifie
        })) : [];

      // Créer un objet éléments spécifiques correctement formaté pour JSON
      const elements_specifiques = {
        type_paiement: paiement.type_paiement || "total",
        prestations_payees: prestationsPayeesFormatted
      };

      console.log("Creating payment with elements_specifiques:", elements_specifiques);

      // Générer une référence au format PAY-XXX YYYY
      const currentYear = new Date().getFullYear();
      
      // Générer un nombre entre 001 et 999
      const randomNumber = Math.floor(Math.random() * 999) + 1;
      const formattedNumber = randomNumber.toString().padStart(3, '0');
      
      const paymentReference = `PAY-${formattedNumber} ${currentYear}`;

      // Calculate solde_restant for the payment
      let soldeRestant = 0;
      
      if (!paiement.est_credit && paiement.facture) {
        // Get the invoice details
        const { data: factureData, error: factureError } = await supabase
          .from("factures")
          .select("montant, montant_paye")
          .eq("id", paiement.facture)
          .single();
          
        if (!factureError && factureData) {
          // Calculate remaining balance after this payment
          const factureMontant = parseFloat(factureData.montant.toString());
          const montantPayeAvant = parseFloat(factureData.montant_paye?.toString() || '0');
          const montantPayeApres = montantPayeAvant + parseFloat(paiement.montant.toString());
          
          soldeRestant = Math.max(0, factureMontant - montantPayeApres);
          console.log("Calculated solde_restant:", {
            factureMontant,
            montantPayeAvant,
            montantPayeApres,
            soldeRestant
          });
        }
      }

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
        solde_restant: soldeRestant,
        elements_specifiques: JSON.stringify(elements_specifiques) // Ensure we stringify the object for proper storage
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
        variant: "default"
      });

      // Générer le reçu PDF automatiquement
      toast({
        title: "Génération du reçu",
        description: `Le reçu de paiement est en cours de génération...`,
        variant: "default"
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
    // Création d'un objet facture simulée pour générer le reçu de paiement
    const factureSimuleeData: Facture = {
      id: paiement.reference || "",
      client_id: paiement.client_id,
      client: {
        id: paiement.client_id,
        nom: paiement.client || "Client",
        adresse: "Adresse du client",
        telephone: "",
        email: ""
      },
      date: paiement.date,
      echeance: paiement.date,
      montant: paiement.montant,
      status: "envoyée",
      status_paiement: "payée",
      prestations: [{
        description: `Paiement par ${paiement.mode}`,
        montant: paiement.montant,
        quantite: 1
      }],
      notes: paiement.notes || `Reçu de paiement ${paiement.reference}`
    };
    
    // Générer le PDF avec l'option de téléchargement automatique
    setTimeout(() => {
      generatePDF(factureSimuleeData, true);
    }, 100);
  };

  return {
    addPaiement,
    generatePaiementReceipt,
    isLoading
  };
};
