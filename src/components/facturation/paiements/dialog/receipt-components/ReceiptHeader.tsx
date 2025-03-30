
import { formatDate } from "@/utils/formatUtils";
import { Paiement } from "@/types/paiement";
import { Client } from "@/types/client";

interface ReceiptHeaderProps {
  paiement: Paiement;
}

const ReceiptHeader = ({ paiement }: ReceiptHeaderProps) => {
  const formattedDate = formatDate(paiement.date);
  
  // Handle client as either a string or an object
  const getClientName = () => {
    if (typeof paiement.client === 'string') {
      return paiement.client;
    } else if (paiement.client && typeof paiement.client === 'object') {
      return paiement.client.nom || paiement.client.raisonsociale || "Client";
    }
    return "Client";
  };
  
  const getClientAddress = () => {
    if (typeof paiement.client === 'object' && paiement.client && paiement.client.adresse) {
      return paiement.client.adresse;
    }
    return null;
  };
  
  const clientName = getClientName();
  const clientAddress = getClientAddress();
  
  return (
    <div className="flex flex-col space-y-2 pb-4 border-b">
      <div className="flex justify-between">
        <div>
          <h2 className="font-bold text-xl">Reçu de Paiement</h2>
          <p className="text-muted-foreground text-sm">{paiement.reference}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Date</p>
          <p>{formattedDate}</p>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <div>
          <p className="font-semibold">Client</p>
          <p>{clientName}</p>
          {clientAddress && typeof clientAddress === 'object' && (
            <p className="text-sm text-muted-foreground">
              {clientAddress.ville || clientAddress.quartier || ''}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold">Mode de paiement</p>
          <p>{paiement.mode}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;
