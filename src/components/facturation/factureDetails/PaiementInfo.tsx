
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  CreditCard, 
  CircleCheck, 
  CircleX,
  AlertCircle
} from "lucide-react";

interface PaiementInfoProps {
  modeReglement?: 'credit' | 'comptant';
  moyenPaiement?: 'especes' | 'orange_money' | 'mtn_mobile' | 'virement';
  status: 'payée' | 'en_attente' | 'envoyée' | 'partiellement_payée';
  montantPaye?: number;
  montantTotal: number;
  formatMontant: (montant: number) => string;
}

export const PaiementInfo = ({ 
  modeReglement, 
  moyenPaiement, 
  status,
  montantPaye = 0,
  montantTotal,
  formatMontant
}: PaiementInfoProps) => {
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

  // Calculer le pourcentage de paiement
  const pourcentagePaye = montantTotal > 0 ? (montantPaye / montantTotal) * 100 : 0;

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
            variant={
              status === 'payée' 
                ? 'success' 
                : status === 'partiellement_payée'
                  ? 'default'
                  : status === 'envoyée' 
                    ? 'warning' 
                    : 'outline'
            } 
            className={`font-normal flex items-center gap-1 ${
              status === 'payée' 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : status === 'partiellement_payée'
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
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
            ) : status === 'partiellement_payée' ? (
              <>
                <AlertCircle className="h-3.5 w-3.5" />
                Partiellement payée
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

        {(status === 'partiellement_payée' || status === 'payée') && (
          <>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>{formatMontant(montantPaye)} payé sur {formatMontant(montantTotal)}</span>
                <span className="font-medium">{Math.round(pourcentagePaye)}%</span>
              </div>
              <Progress value={pourcentagePaye} className="h-2" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
