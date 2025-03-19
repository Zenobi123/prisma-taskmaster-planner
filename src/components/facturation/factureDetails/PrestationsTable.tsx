
import { Prestation } from "@/types/facture";

interface PrestationsTableProps {
  prestations: Prestation[];
  montantTotal: number;
  formatMontant: (montant: number) => string;
}

export const PrestationsTable = ({
  prestations,
  montantTotal,
  formatMontant,
}: PrestationsTableProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium text-neutral-500 mb-2">Détail des prestations</h3>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="p-2 text-left font-medium text-xs">Description</th>
              <th className="p-2 text-right font-medium text-xs">Quantité</th>
              <th className="p-2 text-right font-medium text-xs">Prix unitaire</th>
              <th className="p-2 text-right font-medium text-xs">Montant</th>
            </tr>
          </thead>
          <tbody>
            {prestations.map((prestation, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{prestation.description}</td>
                <td className="p-2 text-right">{prestation.quantite || 1}</td>
                <td className="p-2 text-right">
                  {prestation.prix_unitaire ? formatMontant(prestation.prix_unitaire) : formatMontant(prestation.montant)}
                </td>
                <td className="p-2 text-right">{formatMontant(prestation.montant)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/50">
            <tr>
              <td colSpan={3} className="p-2 font-medium text-right">Total</td>
              <td className="p-2 font-medium text-right">{formatMontant(montantTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
