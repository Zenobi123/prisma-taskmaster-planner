
import { useState } from "react";
import { Facture, Paiement } from "@/types/facture";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const usePaiementsState = (
  factures: Facture[], 
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée') => void
) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPartialPaymentDialog, setShowPartialPaymentDialog] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("especes");
  const { toast } = useToast();

  // Factures non encore entièrement payées
  const facturesForPayment = factures.filter(f => f.status !== 'payée');
  
  // Filtrage selon recherche et statut
  const filteredFactures = facturesForPayment
    .filter(facture => 
      (searchTerm === "" || 
        facture.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (statusFilter === "all" || facture.status === statusFilter)
    );

  const handleOpenPaymentDialog = (facture: Facture) => {
    setSelectedFacture(facture);
    setPaymentMethod("especes");
    setShowPaymentDialog(true);
  };

  const handleOpenPartialPaymentDialog = (facture: Facture) => {
    setSelectedFacture(facture);
    setShowPartialPaymentDialog(true);
  };
  
  const handleRegisterPayment = async () => {
    if (!selectedFacture) return;
    
    try {
      const newPaiement = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        montant: selectedFacture.montant - (selectedFacture.montantPaye || 0),
        moyenPaiement: paymentMethod
      };
      
      const paiementsArray = selectedFacture.paiements ? 
        [...selectedFacture.paiements, newPaiement] : 
        [newPaiement];
      
      const { error } = await supabase
        .from('factures')
        .update({ 
          status: 'payée', 
          moyen_paiement: paymentMethod,
          montant_paye: selectedFacture.montant,
          paiements: paiementsArray
        })
        .eq('id', selectedFacture.id);
      
      if (error) throw error;
      
      onUpdateStatus(selectedFacture.id, 'payée');
      
      toast({
        title: "Paiement enregistré",
        description: `Le paiement de la facture ${selectedFacture.id} a été enregistré avec succès.`,
      });
      
      setShowPaymentDialog(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer le paiement.",
        variant: "destructive"
      });
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filteredFactures,
    showPaymentDialog,
    setShowPaymentDialog,
    showPartialPaymentDialog,
    setShowPartialPaymentDialog,
    selectedFacture,
    paymentMethod,
    setPaymentMethod,
    handleOpenPaymentDialog,
    handleOpenPartialPaymentDialog,
    handleRegisterPayment
  };
};
