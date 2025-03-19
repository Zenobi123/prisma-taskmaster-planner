
import { useToast } from "@/components/ui/use-toast";

export const useInvoiceActions = () => {
  const { toast } = useToast();

  // Fonction pour imprimer une facture
  const handlePrintInvoice = (factureId: string) => {
    console.log(`Impression de la facture ${factureId}`);
    
    // Simuler l'impression
    toast({
      title: "Impression",
      description: `La facture ${factureId} a été envoyée à l'imprimante.`
    });
  };

  // Fonction pour télécharger une facture
  const handleDownloadInvoice = (factureId: string) => {
    console.log(`Téléchargement de la facture ${factureId}`);
    
    // Simuler le téléchargement
    toast({
      title: "Téléchargement",
      description: `La facture ${factureId} a été téléchargée.`
    });
  };

  return {
    handlePrintInvoice,
    handleDownloadInvoice
  };
};
