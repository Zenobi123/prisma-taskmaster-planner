import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { useClientDetails } from "../ClientDetailsContext";
import { Paiement } from "@/types/paiement";
import PaymentsTable from "../PaymentsTable";
import PaymentReceiptDialog from "../../../paiements/dialog/PaymentReceiptDialog";

const PaymentsTab = () => {
  const { clientDetails } = useClientDetails();
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [isPaymentReceiptDialogOpen, setIsPaymentReceiptDialogOpen] = useState(false);
  
  if (!clientDetails) return null;

  const handleViewReceipt = (payment: any) => {
    // Convert ClientPayment to Paiement for the receipt dialog
    const paiement: Paiement = {
      id: payment.id,
      facture_id: payment.facture_id || "",
      client_id: clientDetails.id || "",
      date: payment.date,
      montant: payment.montant,
      mode: payment.mode as any,
      reference: payment.reference,
      solde_restant: 0,
      est_credit: payment.est_credit,
      // Ajout de client pour correspondre au type Paiement du reçu
      client: {
        id: clientDetails.id,
        nom: clientDetails.nom,
        adresse: clientDetails.adresse,
        telephone: clientDetails.telephone,
        email: clientDetails.email,
      }
    };
    
    setSelectedPaiement(paiement);
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
          paiement={selectedPaiement}
        />
      )}
    </div>
  );
};

export default PaymentsTab;
