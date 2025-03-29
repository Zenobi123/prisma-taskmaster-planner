
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Printer, X, Eye } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Facture } from "@/types/facture";
import useFactureViewActions from "@/hooks/facturation/factureActions/useFactureViewActions";

interface InvoicePreviewDialogProps {
  invoice: Facture | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const InvoicePreviewDialog = ({ invoice, open, onOpenChange }: InvoicePreviewDialogProps) => {
  const { handleVoirFacture, handleTelechargerFacture } = useFactureViewActions();
  
  if (!invoice) return null;
  
  // Format the date nicely
  const formatDate = (dateString: string) => {
    try {
      return format(
        typeof dateString === 'string' && dateString.includes('-') 
          ? parseISO(dateString) 
          : new Date(dateString), 
        'dd MMMM yyyy', 
        { locale: fr }
      );
    } catch (error) {
      return dateString;
    }
  };
  
  // Print the invoice
  const handlePrintInvoice = () => {
    window.print();
  };
  
  // Handle download invoice in new tab
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
  
  // Calculate remaining amount
  const remainingAmount = Math.max(0, invoice.montant - (invoice.montant_paye || 0));
  
  // Status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "non_payée": return "Non payée";
      case "partiellement_payée": return "Partiellement payée";
      case "payée": return "Payée";
      case "en_retard": return "En retard";
      default: return status;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Aperçu de facture</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md p-6 bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">FACTURE</h2>
            <p className="text-gray-500">
              <span className="font-semibold">N° {invoice.id}</span>
            </p>
          </div>
          
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-800">Client</h3>
              <p className="text-gray-600">{invoice.client.nom}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-gray-800">Date / Échéance</h3>
              <p className="text-gray-600">
                {formatDate(invoice.date)} / {formatDate(invoice.echeance)}
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Prestations</h3>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left pb-2">Description</th>
                  <th className="text-right pb-2">Montant</th>
                </tr>
              </thead>
              <tbody>
                {invoice.prestations && invoice.prestations.length > 0 ? (
                  invoice.prestations.map((prestation, index) => (
                    <tr key={prestation.id || index} className="border-b border-gray-100">
                      <td className="py-2">{prestation.description}</td>
                      <td className="py-2 text-right">{formatMontant(prestation.montant)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="py-2 text-center text-gray-500">
                      Aucune prestation enregistrée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total</span>
              <span className="font-semibold">{formatMontant(invoice.montant)}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Montant payé</span>
              <span className="font-semibold text-green-600">{formatMontant(invoice.montant_paye || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Solde à payer</span>
              <span className="text-xl font-bold text-[#3C6255]">
                {formatMontant(remainingAmount)}
              </span>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">Statut</h3>
            <p className="text-gray-600 bg-gray-50 p-2 rounded">
              {getStatusText(invoice.status_paiement)}
            </p>
          </div>
          
          {invoice.notes && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-2 rounded">{invoice.notes}</p>
            </div>
          )}
          
          <div className="text-center text-sm text-gray-500 mt-6">
            Merci pour votre confiance.
          </div>
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
              <Eye className="h-4 w-4" /> Aperçu complet
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
