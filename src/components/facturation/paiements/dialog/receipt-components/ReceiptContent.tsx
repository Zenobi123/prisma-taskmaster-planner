
import { Paiement } from "@/types/paiement";
import { formatMontant } from "@/utils/formatUtils";
import { montantEnLettres } from "@/utils/numberToWords";
import ModePaiementBadge from "../../ModePaiementBadge";

interface ReceiptContentProps {
  paiement: Paiement;
}

const ReceiptContent = ({ paiement }: ReceiptContentProps) => {
  const pmt = paiement as any;
  const montantImpots = pmt.montant_impots as number | undefined;
  const montantHonoraires = pmt.montant_honoraires as number | undefined;
  const hasVentilation = montantImpots || montantHonoraires;

  return (
    <>
      <div className="border-t border-gray-200 pt-4 mb-4">
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

      <div className="border-t border-b border-gray-200 py-4 mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-lg font-bold text-gray-800">Montant payé</span>
          <span className="text-xl font-bold text-[#3C6255]">
            {formatMontant(paiement.montant)}
          </span>
        </div>
        <p className="text-xs text-gray-500 italic">
          {montantEnLettres(paiement.montant)}
        </p>
      </div>

      {hasVentilation && (
        <div className="bg-gray-50 rounded-md p-3 mb-4 border border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-2">Ventilation</p>
          {montantImpots ? (
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Impôts &amp; taxes</span>
              <span className="font-medium text-orange-700">{formatMontant(montantImpots)}</span>
            </div>
          ) : null}
          {montantHonoraires ? (
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Honoraires</span>
              <span className="font-medium text-blue-700">{formatMontant(montantHonoraires)}</span>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default ReceiptContent;
