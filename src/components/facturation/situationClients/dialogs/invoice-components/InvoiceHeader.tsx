
import { Facture } from "@/types/facture";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface InvoiceHeaderProps {
  invoice: Facture;
}

const InvoiceHeader = ({ invoice }: InvoiceHeaderProps) => {
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

  // Get client name safely
  const clientName = invoice.client?.nom || "Client";

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">FACTURE</h2>
        <p className="text-gray-500">
          <span className="font-semibold">N° {invoice.id}</span>
        </p>
      </div>
      
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Client</h3>
          <p className="text-gray-600">{clientName}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-800">Date / Échéance</h3>
          <p className="text-gray-600">
            {formatDate(invoice.date)} / {formatDate(invoice.echeance)}
          </p>
        </div>
      </div>
    </>
  );
};

export default InvoiceHeader;
