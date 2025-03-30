
import { Paiement } from "@/types/paiement";
import { formatMontant } from "@/utils/formatUtils";
import ModePaiementBadge from "../../ModePaiementBadge";

interface ReceiptContentProps {
  paiement: Paiement;
}

const ReceiptContent = ({ paiement }: ReceiptContentProps) => {
  return (
    <>
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between mb-2 items-center">
          <span className="font-semibold text-gray-700">Méthode de paiement</span>
          <ModePaiementBadge mode={paiement.mode} />
        </div>
        
        {paiement.reference_transaction && (
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Référence transaction</span>
            <span className="text-gray-600">{paiement.reference_transaction}</span>
          </div>
        )}
        
        {paiement.facture && (
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Facture associée</span>
            <span className="text-gray-600">{paiement.facture}</span>
          </div>
        )}
        
        {paiement.est_credit && (
          <div className="flex justify-between mb-2">
            <span className="font-semibold text-gray-700">Type</span>
            <span className="text-gray-600">Crédit (Avance)</span>
          </div>
        )}
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Montant payé</span>
          <span className="text-xl font-bold text-[#3C6255]">
            {formatMontant(paiement.montant)}
          </span>
        </div>
      </div>
    </>
  );
};

export default ReceiptContent;
