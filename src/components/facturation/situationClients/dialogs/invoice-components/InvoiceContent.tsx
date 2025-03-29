
import { Facture } from "@/types/facture";
import { formatMontant } from "@/utils/formatUtils";

interface InvoiceContentProps {
  invoice: Facture;
}

const InvoiceContent = ({ invoice }: InvoiceContentProps) => {
  // Calculate remaining amount
  const remainingAmount = Math.max(0, invoice.montant - (invoice.montant_paye || 0));

  return (
    <>
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Prestations</h3>
        <table className="w-full mb-4">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left pb-2">Description</th>
              <th className="text-right pb-2">Montant</th>
            </tr>
          </thead>
          <tbody>
            {invoice.prestations && invoice.prestations.length > 0 ? (
              invoice.prestations.map((prestation, index) => (
                <tr key={prestation.id || index} className="border-b border-gray-100">
                  <td className="py-2">{prestation.description}</td>
                  <td className="py-2 text-right">{formatMontant(prestation.montant)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-2 text-center text-gray-500">
                  Aucune prestation enregistrée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Total</span>
          <span className="font-semibold">{formatMontant(invoice.montant)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700">Montant payé</span>
          <span className="font-semibold text-green-600">{formatMontant(invoice.montant_paye || 0)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Solde à payer</span>
          <span className="text-xl font-bold text-[#3C6255]">
            {formatMontant(remainingAmount)}
          </span>
        </div>
      </div>
    </>
  );
};

export default InvoiceContent;
