
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  CreditCard, 
  CircleCheck, 
  CircleX
} from "lucide-react";

interface PaiementInfoProps {
  modeReglement?: 'credit' | 'comptant';
  moyenPaiement?: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement';
  status: 'payée' | 'en_attente' | 'envoyée';
}

export const PaiementInfo = ({ modeReglement, moyenPaiement, status }: PaiementInfoProps) => {
  // Format the payment method display
  const getMoyenPaiementLabel = () => {
    switch (moyenPaiement) {
      case 'especes': return 'Espèces';
      case 'orange_money': return 'Orange Money';
      case 'mtn_mobile': return 'MTN Mobile Money';
      case 'virement': return 'Virement bancaire';
      default: return 'Non spécifié';
    }
  };

  return (
    <div className="border rounded-md p-4 bg-muted/20">
      <h3 className="font-medium text-base mb-3">Information de paiement</h3>
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium w-32">Mode de règlement:</span>
          <Badge 
            variant={modeReglement === 'comptant' ? 'default' : 'outline'} 
            className="font-normal flex items-center gap-1"
          >
            {modeReglement === 'comptant' ? (
              <>
                <DollarSign className="h-3.5 w-3.5" />
                Comptant
              </>
            ) : (
              <>
                <CreditCard className="h-3.5 w-3.5" />
                À crédit
              </>
            )}
          </Badge>
        </div>
        
        {modeReglement === 'comptant' && moyenPaiement && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-32">Moyen de paiement:</span>
            <span className="text-sm">{getMoyenPaiementLabel()}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-medium w-32">Statut de paiement:</span>
          <Badge 
            variant={status === 'payée' ? 'success' : status === 'envoyée' ? 'warning' : 'outline'} 
            className={`font-normal flex items-center gap-1 ${
              status === 'payée' 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : status === 'envoyée' 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                  : ''
            }`}
          >
            {status === 'payée' ? (
              <>
                <CircleCheck className="h-3.5 w-3.5" />
                Payée
              </>
            ) : status === 'envoyée' ? (
              <>
                <CircleX className="h-3.5 w-3.5" />
                Envoyée
              </>
            ) : (
              <>
                <CircleX className="h-3.5 w-3.5" />
                En attente
              </>
            )}
          </Badge>
        </div>
      </div>
    </div>
  );
};
