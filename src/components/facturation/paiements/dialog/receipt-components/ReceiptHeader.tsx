
import { formatDate } from "@/utils/formatUtils";
import { Paiement } from "@/types/paiement";

interface ReceiptHeaderProps {
  paiement: Paiement;
}

const ReceiptHeader = ({ paiement }: ReceiptHeaderProps) => {
  const formattedDate = formatDate(paiement.date);
  const clientName = paiement.client?.nom || "Client";
  
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
          {paiement.client?.adresse && (
            <p className="text-sm text-muted-foreground">
              {paiement.client.adresse}
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
