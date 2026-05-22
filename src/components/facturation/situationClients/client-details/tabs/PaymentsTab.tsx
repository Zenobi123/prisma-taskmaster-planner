
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useClientDetails } from "../client-details-context";
import { Paiement } from "@/types/paiement";
import type { ClientPayment } from "@/types/clientFinancial";
import PaymentsTable from "../PaymentsTable";
import PaymentReceiptDialog from "../../../paiements/dialog/PaymentReceiptDialog";

const PaymentsTab = () => {
  const { clientDetails } = useClientDetails();
  const [selectedPaiement, setSelectedPaiement] = useState<Paiement | null>(null);
  const [isPaymentReceiptDialogOpen, setIsPaymentReceiptDialogOpen] = useState(false);

  if (!clientDetails) return null;

  // Le reçu est toujours généré à partir du paiement (type autonome @/types/paiement).
  const handleViewReceipt = (payment: ClientPayment) => {
    const paiementForReceipt: Paiement = {
      id: payment.id,
      facture: payment.facture_id || "",
      client: clientDetails.nom || "",
      client_id: clientDetails.id || "",
      date: payment.date,
      montant: payment.montant,
      mode: payment.mode as Paiement["mode"],
      reference: payment.reference,
      solde_restant: 0,
      est_credit: payment.est_credit,
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
          paiement={selectedPaiement}
        />
      )}
    </div>
  );
};

export default PaymentsTab;
