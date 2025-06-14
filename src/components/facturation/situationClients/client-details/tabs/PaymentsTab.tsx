
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useClientDetails } from "../ClientDetailsContext";
import { Paiement } from "@/types/facture"; // Changed to use a consistent type
import PaymentsTable from "../PaymentsTable";
import PaymentReceiptDialog from "../../../paiements/dialog/PaymentReceiptDialog";

const PaymentsTab = () => {
  const { clientDetails } = useClientDetails();
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [isPaymentReceiptDialogOpen, setIsPaymentReceiptDialogOpen] = useState(false);
  
  if (!clientDetails) return null;

  const handleViewReceipt = (payment: any) => {
    // This object is for the receipt dialog, we'll try to build it as best as we can.
    // The underlying type issue with @/types/paiement vs @/types/facture needs a deeper fix.
    const paiementForReceipt: any = {
      id: payment.id,
      facture_id: payment.facture_id || "",
      client_id: clientDetails.id || "",
      date: payment.date,
      montant: payment.montant,
      mode: payment.mode,
      reference: payment.reference,
      solde_restant: 0,
      est_credit: payment.est_credit,
      // Ajout de client pour correspondre au type Paiement du reçu
      client: {
        id: clientDetails.id,
        nom: clientDetails.nom,
        adresse: clientDetails.client?.adresse || '',
        telephone: clientDetails.client?.telephone || '',
        email: clientDetails.client?.email || '',
      }
    };
    
    setSelectedPaiement(paiementForReceipt);
    setIsPaymentReceiptDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un paiement
        </Button>
      </div>
      
      <PaymentsTable 
        payments={clientDetails.paiements}
        onViewReceipt={handleViewReceipt}
      />

      {selectedPaiement && (
        <PaymentReceiptDialog
          open={isPaymentReceiptDialogOpen}
          onOpenChange={setIsPaymentReceiptDialogOpen}
          paiement={selectedPaiement as any}
        />
      )}
    </div>
  );
};

export default PaymentsTab;
