
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Facture } from "@/types/facture";
import { formatMontant, formatDate } from "./utils";

interface FacturePaiementsProps {
  facture: Facture;
}

export function FacturePaiements({ facture }: FacturePaiementsProps) {
  if (!facture.paiements || facture.paiements.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des paiements</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Mode</th>
              <th className="py-2 px-4 text-right">Montant</th>
              <th className="py-2 px-4 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {facture.paiements.map((paiement) => (
              <tr key={paiement.id} className="border-b">
                <td className="py-2 px-4">{formatDate(paiement.date)}</td>
                <td className="py-2 px-4 capitalize">{paiement.mode}</td>
                <td className="py-2 px-4 text-right">{formatMontant(paiement.montant)}</td>
                <td className="py-2 px-4">{paiement.notes || "-"}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2} className="py-2 px-4 text-right font-bold">Total payé</td>
              <td className="py-2 px-4 text-right font-bold">{formatMontant(facture.montant_paye || 0)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
