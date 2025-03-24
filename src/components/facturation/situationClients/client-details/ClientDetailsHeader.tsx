
import { Wallet } from "lucide-react";
import { formatMontant } from "@/utils/formatUtils";
import { ClientFinancialDetails } from "@/types/clientFinancial";
import { 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ClientDetailsHeaderProps {
  clientDetails: ClientFinancialDetails | null;
}

const ClientDetailsHeader = ({ clientDetails }: ClientDetailsHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>Détails financiers du client</DialogTitle>
      <DialogDescription>
        {clientDetails?.solde_disponible && clientDetails.solde_disponible > 0 ? (
          <Alert className="mt-2 bg-green-50 border-green-200">
            <AlertDescription className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-500" />
              Ce client dispose d'un solde positif de {formatMontant(clientDetails.solde_disponible)} 
              qui peut être utilisé pour ses factures.
            </AlertDescription>
          </Alert>
        ) : null}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ClientDetailsHeader;
