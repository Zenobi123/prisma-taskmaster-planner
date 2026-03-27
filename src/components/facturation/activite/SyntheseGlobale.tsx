
import { ClientActiviteRow } from "@/hooks/facturation/useVueActivite";
import { Badge } from "@/components/ui/badge";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

interface Props {
  rows: ClientActiviteRow[];
}

const SyntheseGlobale = ({ rows }: Props) => {
  const totCA = rows.reduce((s, r) => s + r.totalCA, 0);
  const totImpots = rows.reduce((s, r) => s + r.totalImpots, 0);
  const totHono = rows.reduce((s, r) => s + r.totalHonoraires, 0);
  const totFact = rows.reduce((s, r) => s + r.nbFactures, 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
          {rows.length} client{rows.length > 1 ? "s" : ""}
        </Badge>
      </div>
      <div className="overflow-x-auto rounded-md border border-gray-100">
        <table className="w-full text-xs">
          <thead className="bg-blue-50 border-b border-blue-100">
            <tr>
              <th className="text-left px-3 py-2 font-semibold text-blue-800">Client</th>
              <th className="text-right px-3 py-2 font-semibold text-blue-800">Nb Factures</th>
              <th className="text-right px-3 py-2 font-semibold text-blue-800">Impôts</th>
              <th className="text-right px-3 py-2 font-semibold text-blue-800">Honoraires</th>
              <th className="text-right px-3 py-2 font-semibold text-blue-800">Total CA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.client_id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-3 py-2 font-medium text-gray-800">{r.client_nom}</td>
                <td className="px-3 py-2 text-right text-gray-600">{r.nbFactures}</td>
                <td className="px-3 py-2 text-right text-red-700">{fmt(r.totalImpots)}</td>
                <td className="px-3 py-2 text-right text-green-700">{fmt(r.totalHonoraires)}</td>
                <td className="px-3 py-2 text-right font-semibold text-blue-800">{fmt(r.totalCA)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-blue-50 border-t-2 border-blue-200">
            <tr>
              <td className="px-3 py-2 font-bold text-blue-900">Total</td>
              <td className="px-3 py-2 text-right font-bold text-blue-900">{totFact}</td>
              <td className="px-3 py-2 text-right font-bold text-red-800">{fmt(totImpots)}</td>
              <td className="px-3 py-2 text-right font-bold text-green-800">{fmt(totHono)}</td>
              <td className="px-3 py-2 text-right font-bold text-blue-900">{fmt(totCA)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default SyntheseGlobale;
