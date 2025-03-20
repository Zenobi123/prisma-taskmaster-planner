
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Facture } from "@/types/facture";
import { formatMontant } from "./utils";

interface FacturePrestationsProps {
  facture: Facture;
}

export function FacturePrestations({ facture }: FacturePrestationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prestations</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-right">Quantité</th>
              <th className="py-2 px-4 text-right">Prix unitaire</th>
              <th className="py-2 px-4 text-right">Taux</th>
              <th className="py-2 px-4 text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {facture.prestations.map((prestation, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-4">{prestation.description}</td>
                <td className="py-2 px-4 text-right">{prestation.quantite}</td>
                <td className="py-2 px-4 text-right">{formatMontant(prestation.montant)}</td>
                <td className="py-2 px-4 text-right">{prestation.taux ? `${prestation.taux}%` : "-"}</td>
                <td className="py-2 px-4 text-right">
                  {formatMontant(prestation.montant * (prestation.quantite || 1))}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="py-2 px-4 text-right font-bold">Total</td>
              <td className="py-2 px-4 text-right font-bold">{formatMontant(facture.montant)}</td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
