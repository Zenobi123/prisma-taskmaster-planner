
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye } from "lucide-react";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import { useClientDetails } from "../ClientDetailsContext";
import InvoicesTable from "../InvoicesTable";
import InvoicePreviewDialog from "../../dialogs/InvoicePreviewDialog";

const InvoicesTab = () => {
  const { clientDetails } = useClientDetails();
  const [selectedInvoice, setSelectedInvoice] = useState<Facture | null>(null);
  const [isInvoicePreviewDialogOpen, setIsInvoicePreviewDialogOpen] = useState(false);
  
  if (!clientDetails) return null;

  // Find any available credits (paiements that are est_credit and have no facture_id)
  const availableCredits = clientDetails.paiements.filter(p => p.est_credit && !p.facture_id) || [];
  const clientName = clientDetails.id || "Client";

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="bg-[#3C6255] hover:bg-[#2B4B3E] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une facture
        </Button>
      </div>
      
      <InvoicesTable 
        invoices={clientDetails.factures}
        availableCredits={availableCredits}
        onOpenApplyCreditDialog={clientDetails.onOpenApplyCreditDialog}
        onOpenReminderDialog={clientDetails.onOpenReminderDialog}
        clientName={clientName}
      />

      {selectedInvoice && (
        <InvoicePreviewDialog
          open={isInvoicePreviewDialogOpen}
          onOpenChange={setIsInvoicePreviewDialogOpen}
          invoice={selectedInvoice}
        />
      )}
    </div>
  );
};

export default InvoicesTab;
