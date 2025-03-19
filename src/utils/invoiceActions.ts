
import { useToast } from "@/components/ui/use-toast";

export const useInvoiceActions = () => {
  const { toast } = useToast();
  
  const handlePrintInvoice = (factureId: string) => {
    toast({
      title: "Impression lancée",
      description: `Impression de la facture ${factureId} en cours...`,
    });
    // Logique d'impression à implémenter
  };

  const handleDownloadInvoice = (factureId: string) => {
    toast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${factureId}...`,
    });
    // Logique de téléchargement à implémenter
  };

  return {
    handlePrintInvoice,
    handleDownloadInvoice
  };
};
