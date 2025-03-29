
import { FileText, CreditCard } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import InvoicesTable from "./InvoicesTable";
import PaymentsTable from "./PaymentsTable";
import { useClientDetails } from "./ClientDetailsContext";
import { useState } from "react";
import { Paiement } from "@/types/paiement";
import PaymentReceiptDialog from "../../paiements/dialog/PaymentReceiptDialog";

const ClientDetailsTabs = () => {
  const { clientDetails, onOpenApplyCreditDialog, onOpenReminderDialog } = useClientDetails();
  const [viewReceiptDialogOpen, setViewReceiptDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Paiement | null>(null);
  
  const availableCredits = clientDetails?.paiements.filter(p => p.est_credit && !p.facture_id) || [];

  const handleViewReceipt = (payment: any) => {
    // Créer un objet paiement correctement formaté avec le nom du client
    const clientId = payment.client_id || clientDetails?.id || "";
    
    setSelectedPayment({
      id: payment.id,
      facture_id: payment.facture_id || "",
      client_id: clientId,
      client: {
        id: clientId,
        nom: clientDetails?.nom || "Client"
      },
      date: payment.date,
      montant: payment.montant,
      mode: payment.mode,
      solde_restant: 0,
      est_credit: payment.est_credit || false,
      reference: payment.reference || "",
      notes: payment.notes || "",
      reference_transaction: payment.reference_transaction || ""
    });
    setViewReceiptDialogOpen(true);
  };

  return (
    <>
      <Tabs defaultValue="factures" className="mt-4">
        <TabsList className="mb-4">
          <TabsTrigger value="factures">
            <FileText className="h-4 w-4 mr-2" />
            Factures ({clientDetails?.factures?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="paiements">
            <CreditCard className="h-4 w-4 mr-2" />
            Paiements ({clientDetails?.paiements?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="factures">
          <InvoicesTable 
            invoices={clientDetails?.factures || []}
            availableCredits={availableCredits}
            onOpenApplyCreditDialog={onOpenApplyCreditDialog}
            onOpenReminderDialog={onOpenReminderDialog}
            clientName={clientDetails?.nom || "Client"}
          />
        </TabsContent>

        <TabsContent value="paiements">
          <PaymentsTable 
            payments={clientDetails?.paiements || []} 
            onViewReceipt={handleViewReceipt}
          />
        </TabsContent>
      </Tabs>
      
      <PaymentReceiptDialog
        paiement={selectedPayment}
        open={viewReceiptDialogOpen}
        onOpenChange={setViewReceiptDialogOpen}
      />
    </>
  );
};

export default ClientDetailsTabs;
