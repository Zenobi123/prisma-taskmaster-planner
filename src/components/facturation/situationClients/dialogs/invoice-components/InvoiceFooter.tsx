
import { Facture } from "@/types/facture";
import InvoiceStatusBadge from "../../client-details/invoice-table/InvoiceStatusBadge";

interface InvoiceFooterProps {
  invoice: Facture;
}

const InvoiceFooter = ({ invoice }: InvoiceFooterProps) => {
  return (
    <>
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-1">Statut</h3>
        <div className="text-gray-600 bg-gray-50 p-2 rounded flex items-center">
          <InvoiceStatusBadge status={invoice.status_paiement} />
        </div>
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
    </>
  );
};

export default InvoiceFooter;
