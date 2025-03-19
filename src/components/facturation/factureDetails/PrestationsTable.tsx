
import { Prestation } from "@/types/facture";

interface PrestationsTableProps {
  prestations: Prestation[];
  montantTotal: number;
  formatMontant: (montant: number) => string;
}

export const PrestationsTable = ({ 
  prestations, 
  montantTotal, 
  formatMontant 
}: PrestationsTableProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-2">Prestations</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Montant
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {prestations.map((prestation, index) => (
              <tr 
                key={index}
                className="transition-colors hover:bg-neutral-50"
              >
                <td className="px-4 py-3 text-sm">{prestation.description}</td>
                <td className="px-4 py-3 text-sm text-right">
                  {formatMontant(prestation.montant)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-neutral-50">
            <tr>
              <td className="px-4 py-2 text-sm font-medium">Total</td>
              <td className="px-4 py-2 text-sm font-medium text-right">
                {formatMontant(montantTotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
