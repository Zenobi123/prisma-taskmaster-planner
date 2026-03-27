
import { ClientActiviteRow, RecuRow } from "@/hooks/facturation/useVueActivite";
import { Badge } from "@/components/ui/badge";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));
const fmtDate = (d: string) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—";

function statutBadge(row: ClientActiviteRow) {
  if (row.totalReste <= 0) return <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">Soldé</Badge>;
  if (row.totalPaye > 0) return <Badge className="bg-amber-100 text-amber-800 border border-amber-200 text-xs">Partiel</Badge>;
  return <Badge className="bg-red-100 text-red-800 border border-red-200 text-xs">Impayé</Badge>;
}

interface Props {
  clientsRows: ClientActiviteRow[];
  recusRows: RecuRow[];
  totalPaye: number;
  totalReste: number;
  tauxRecouvrement: number;
}

const SituationPaiements = ({ clientsRows, recusRows, totalPaye, totalReste, tauxRecouvrement }: Props) => (
  <div className="space-y-4">
    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
        <p className="text-xs text-emerald-600 font-medium">Total Payé</p>
        <p className="text-base font-bold text-emerald-800 mt-0.5">{fmt(totalPaye)} F CFA</p>
      </div>
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
        <p className="text-xs text-orange-600 font-medium">Total Impayé</p>
        <p className="text-base font-bold text-orange-800 mt-0.5">{fmt(totalReste)} F CFA</p>
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center">
        <p className="text-xs text-indigo-600 font-medium">Taux Recouvrement</p>
        <p className="text-base font-bold text-indigo-800 mt-0.5">{tauxRecouvrement.toFixed(1)}%</p>
      </div>
    </div>

    {/* Table A – by client */}
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-2">Par client</p>
      <div className="overflow-x-auto rounded-md border border-gray-100">
        <table className="w-full text-xs">
          <thead className="bg-green-50 border-b border-green-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-green-800">Client</th>
              <th className="text-right px-3 py-2 font-semibold text-green-800">Facturé</th>
              <th className="text-right px-3 py-2 font-semibold text-green-800">Payé</th>
              <th className="text-right px-3 py-2 font-semibold text-green-800">Reste</th>
              <th className="text-right px-3 py-2 font-semibold text-green-800">Taux</th>
              <th className="text-center px-3 py-2 font-semibold text-green-800">Statut</th>
            </tr>
          </thead>
          <tbody>
            {clientsRows.map(r => (
              <tr key={r.client_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-3 py-2 font-medium text-gray-800">{r.client_nom}</td>
                <td className="px-3 py-2 text-right text-gray-700">{fmt(r.totalCA)}</td>
                <td className="px-3 py-2 text-right text-emerald-700">{fmt(r.totalPaye)}</td>
                <td className="px-3 py-2 text-right text-orange-700">{fmt(r.totalReste)}</td>
                <td className="px-3 py-2 text-right text-gray-600">{r.tauxRecouvrement.toFixed(0)}%</td>
                <td className="px-3 py-2 text-center">{statutBadge(r)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    {/* Table B – reçus */}
    {recusRows.length > 0 && (
      <div>
        <p className="text-xs font-semibold text-gray-700 mb-2">Reçus de paiement</p>
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full text-xs">
            <thead className="bg-green-50 border-b border-green-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-green-800">Date</th>
                <th className="text-left px-3 py-2 font-semibold text-green-800">N° Reçu</th>
                <th className="text-left px-3 py-2 font-semibold text-green-800">Client</th>
                <th className="text-right px-3 py-2 font-semibold text-green-800">Impôts</th>
                <th className="text-right px-3 py-2 font-semibold text-green-800">Honoraires</th>
                <th className="text-right px-3 py-2 font-semibold text-green-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {recusRows.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2 text-gray-600">{fmtDate(r.date)}</td>
                  <td className="px-3 py-2 font-mono text-gray-500">{r.reference}</td>
                  <td className="px-3 py-2 text-gray-800">{r.client_nom}</td>
                  <td className="px-3 py-2 text-right text-red-700">{fmt(r.montant_impots)}</td>
                  <td className="px-3 py-2 text-right text-green-700">{fmt(r.montant_honoraires)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-800">{fmt(r.montant)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

export default SituationPaiements;
