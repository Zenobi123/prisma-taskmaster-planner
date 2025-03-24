
import { Facture } from "@/types/facture";
import { Paiement } from "@/types/paiement";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";

export const useFactureViewActions = () => {
  const { toast } = useToast();
  
  const handleVoirFacture = (facture: Facture) => {
    console.log("Aperçu de la facture:", facture.id);
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    console.log("Téléchargement de la facture:", facture.id);
    generatePDF(facture, true);
  };
  
  const handleVoirRecu = (paiement: Paiement) => {
    console.log("Aperçu du reçu de paiement:", paiement.id);
    toast({
      title: "Reçu de paiement",
      description: `Visualisation du reçu pour le paiement ${paiement.reference}`,
    });
    
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
      status: "envoyée", // Changed from "payée" to "envoyée" to match the expected enum values
      status_paiement: "payée", // Added the missing status_paiement property
      prestations: [{
        description: `Paiement par ${paiement.mode}`,
        montant: paiement.montant,
        quantite: 1
      }],
      notes: paiement.notes || `Reçu de paiement ${paiement.reference}`
    };
    
    // Afficher le PDF immédiatement
    setTimeout(() => {
      generatePDF(factureSimuleeData);
    }, 100);
  };
  
  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu
  };
};

export default useFactureViewActions;
