
import { Paiement } from "@/types/paiement";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface ReceiptHeaderProps {
  paiement: Paiement;
}

const ReceiptHeader = ({ paiement }: ReceiptHeaderProps) => {
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

  // Safe reference display
  const reference = paiement.reference || paiement.id;
  
  // Ensure client name is displayed correctly
  let clientName = "Client";
  if (paiement.client) {
    if (typeof paiement.client === 'object' && paiement.client !== null) {
      clientName = paiement.client.nom || "Client";
    } else if (typeof paiement.client === 'string') {
      clientName = paiement.client;
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">REÇU DE PAIEMENT</h2>
        <p className="text-gray-500">
          <span className="font-semibold">N° {reference}</span>
        </p>
      </div>
      
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-semibold text-gray-800">Client</h3>
          <p className="text-gray-600">{clientName}</p>
        </div>
        <div className="text-right">
          <h3 className="font-semibold text-gray-800">Date</h3>
          <p className="text-gray-600">{formatDate(paiement.date)}</p>
        </div>
      </div>
    </>
  );
};

export default ReceiptHeader;
