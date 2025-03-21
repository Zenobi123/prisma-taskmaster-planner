
import { Facture } from "@/types/facture";
import { generatePDF } from "@/utils/pdfUtils";
import { useToast } from "@/components/ui/use-toast";

export const useFactureActions = () => {
  const { toast } = useToast();

  const handleVoirFacture = (facture: Facture) => {
    generatePDF(facture);
  };

  const handleTelechargerFacture = (facture: Facture) => {
    generatePDF(facture, true);
  };

  const handleModifierFacture = (facture: Facture, updatedData: Partial<Facture>) => {
    // In a real application, this would call an API
    // For now we'll just show a toast notification
    toast({
      title: "Facture modifiée",
      description: `La facture ${facture.id} a été mise à jour.`,
    });
    
    // Create a properly typed updated facture
    const updated: Facture = {
      ...facture,
      ...updatedData,
      updated_at: new Date().toISOString(),
      // Ensure status is properly typed
      status: (updatedData.status || facture.status) as Facture["status"]
    };
    
    return updated;
  };

  const handleAnnulerFacture = (facture: Facture) => {
    // In a real application, this would call an API
    // For now we'll just show a toast notification
    toast({
      title: "Facture annulée",
      description: `La facture ${facture.id} a été annulée.`,
    });
    
    // Return a properly typed canceled facture
    return {
      ...facture,
      status: "annulée" as const,
      updated_at: new Date().toISOString()
    };
  };

  const addFacture = (factures: Facture[], facture: Facture): Facture[] => {
    return [facture, ...factures];
  };

  const updateFacture = (factures: Facture[], updatedFacture: Facture): Facture[] => {
    return factures.map(facture => 
      facture.id === updatedFacture.id ? updatedFacture : facture
    );
  };

  return {
    handleVoirFacture,
    handleTelechargerFacture,
    handleModifierFacture,
    handleAnnulerFacture,
    addFacture,
    updateFacture
  };
};
