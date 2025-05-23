
import { formatDate } from "@/utils/formatUtils";
import { Paiement } from "@/types/paiement";
import { Client } from "@/types/client";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReceiptHeaderProps {
  paiement: Paiement;
}

const ReceiptHeader = ({ paiement }: ReceiptHeaderProps) => {
  const formattedDate = formatDate(paiement.date);
  const isMobile = useIsMobile();
  
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
    <div className="flex flex-col space-y-3 sm:space-y-2 pb-4 border-b">
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between items-center'}`}>
        <div>
          <h2 className="font-bold text-xl sm:text-2xl">Reçu de Paiement</h2>
          <p className="text-muted-foreground text-xs sm:text-sm">{paiement.reference}</p>
        </div>
        <div className={isMobile ? 'mt-2' : 'text-right'}>
          <p className="font-semibold text-sm">Date</p>
          <p className="text-xs sm:text-sm">{formattedDate}</p>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'} pt-2`}>
        <div>
          <p className="font-semibold text-sm">Client</p>
          <p className="text-xs sm:text-sm">{clientName}</p>
          {clientAddress && typeof clientAddress === 'object' && (
            <p className="text-xs text-muted-foreground">
              {clientAddress.ville || clientAddress.quartier || ''}
            </p>
          )}
        </div>
        <div className={isMobile ? 'mt-2' : 'text-right'}>
          <p className="font-semibold text-sm">Mode de paiement</p>
          <p className="text-xs sm:text-sm">{paiement.mode}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;
