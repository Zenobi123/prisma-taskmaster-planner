
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X, Eye } from "lucide-react";
import { Facture } from "@/types/facture";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";
import InvoiceHeader from "./invoice-components/InvoiceHeader";
import InvoiceContent from "./invoice-components/InvoiceContent";
import InvoiceFooter from "./invoice-components/InvoiceFooter";

interface InvoicePreviewDialogProps {
  invoice: Facture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoicePreviewDialog = ({ invoice, open, onOpenChange }: InvoicePreviewDialogProps) => {
  const { handleVoirFacture, handleTelechargerFacture } = useFactureViewActions();
  
  if (!invoice) return null;
  
  // Print the invoice
  const handlePrintInvoice = () => {
    window.print();
  };
  
  // Handle view invoice in new tab
  const handleViewInvoiceInNewTab = () => {
    if (invoice) {
      handleVoirFacture(invoice);
    }
  };
  
  // Handle download invoice
  const handleDownloadInvoice = () => {
    if (invoice) {
      handleTelechargerFacture(invoice);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Aperçu de facture</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md p-6 bg-white">
          <InvoiceHeader invoice={invoice} />
          <InvoiceContent invoice={invoice} />
          <InvoiceFooter invoice={invoice} />
        </div>
        
        <DialogFooter className="flex gap-2 justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="gap-2"
          >
            <X className="h-4 w-4" /> Fermer
          </Button>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrintInvoice}
              className="gap-2"
            >
              <Printer className="h-4 w-4" /> Imprimer
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleViewInvoiceInNewTab}
              className="gap-2"
            >
              <Eye className="h-4 w-4" /> Aperçu
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleDownloadInvoice}
              className="gap-2 bg-[#3C6255] hover:bg-[#2B4B3E]"
            >
              <Download className="h-4 w-4" /> Télécharger
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewDialog;
