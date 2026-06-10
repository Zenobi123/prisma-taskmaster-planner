
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Paiement, PrestationPayee } from "@/types/paiement";
import { generateReceiptPDF, formatClientForReceipt } from "@/utils/pdfUtils";
import { recalculerStatutPaiementFacture } from "@/services/factureServices/facturePaiementSyncService";

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


      // Générer une référence séquentielle: RECU-NNNN/YYYY (conforme à la spec)
      const currentYear = new Date().getFullYear();
      const { data: existingPaiements } = await supabase
        .from("paiements")
        .select("reference");

      let highest = 0;
      (existingPaiements || []).forEach((p: { reference?: string | null }) => {
        const m = p.reference?.match(/RECU-(\d{4})\/(\d{4})/);
        if (m && parseInt(m[2], 10) === currentYear) {
          const n = parseInt(m[1], 10);
          if (!isNaN(n) && n > highest) highest = n;
        }
      });
      const formattedNumber = String(highest + 1).padStart(4, "0");
      const paymentReference = `RECU-${formattedNumber}/${currentYear}`;

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


      const { data, error } = await supabase
        .from("paiements")
        .insert(paiementData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Le paiement fait évoluer l'état de la facture (partiellement payée / payée),
      // comme dans l'application de référence.
      await recalculerStatutPaiementFacture(paiementData.facture_id);

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

      // Fetch client details for receipt generation
      const { data: clientData } = await supabase
        .from("clients")
        .select("id, nom, raisonsociale, type, niu, adresse, contact")
        .eq("id", paiement.client_id)
        .single();

      // Create a payment object with client details for the receipt
      const paiementWithClient = {
        ...data,
        client: clientData || paiement.client
      };

      // Générer le reçu PDF
      generateReceiptFromPaiement(paiementWithClient as unknown as Paiement);

      return data;
    } catch (error) {
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

  const generateReceiptFromPaiement = (paiement: Paiement) => {
    try {
      
      // Format the client information for the receipt
      const formattedClient = formatClientForReceipt(paiement.client);
      
      // Create a payment object with properly formatted client
      const paiementForReceipt = {
        ...paiement,
        client: formattedClient
      };
      
      // Generate the PDF with automatic download option
      setTimeout(() => {
        generateReceiptPDF(paiementForReceipt, true);
      }, 500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de générer le reçu de paiement."
      });
    }
  };

  return {
    addPaiement,
    generateReceiptFromPaiement,
    isLoading
  };
};
