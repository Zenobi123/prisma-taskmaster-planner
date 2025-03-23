
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
    
    // Simulation d'un PDF de reçu en utilisant la fonction generatePDF existante
    // Note: Dans une implémentation réelle, on utiliserait une fonction spécifique aux reçus
    const factureSimuleeData = {
      id: paiement.reference,
      client_id: paiement.client_id,
      client: {
        id: paiement.client_id,
        nom: paiement.client,
        adresse: "",
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
    } as Facture;
    
    generatePDF(factureSimuleeData);
  };
  
  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleVoirRecu
  };
};

export default useFactureViewActions;
