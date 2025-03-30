
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
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'}`}>
        <div>
          <h2 className="font-bold text-responsive-title">Reçu de Paiement</h2>
          <p className="text-muted-foreground text-responsive-xs">{paiement.reference}</p>
        </div>
        <div className={isMobile ? '' : 'text-right'}>
          <p className="font-semibold text-responsive-sm">Date</p>
          <p className="text-responsive-xs">{formattedDate}</p>
        </div>
      </div>
      
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'justify-between'} pt-2`}>
        <div>
          <p className="font-semibold text-responsive-sm">Client</p>
          <p className="text-responsive-xs">{clientName}</p>
          {clientAddress && typeof clientAddress === 'object' && (
            <p className="text-xs text-muted-foreground">
              {clientAddress.ville || clientAddress.quartier || ''}
            </p>
          )}
        </div>
        <div className={isMobile ? 'mt-2' : 'text-right'}>
          <p className="font-semibold text-responsive-sm">Mode de paiement</p>
          <p className="text-responsive-xs">{paiement.mode}</p>
        </div>
      </div>
    </div>
  );
};

export default ReceiptHeader;
