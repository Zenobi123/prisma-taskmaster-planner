
import { ImpotImpeRow, PrestationRow } from "@/hooks/facturation/useVueActivite";
import { Badge } from "@/components/ui/badge";
import { getUrgenceLevel, urgenceBadgeClass, urgenceBadgeText, EcheanceInfo } from "@/utils/echeancesFiscales";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

function urgenceBadge(row: ImpotImpeRow) {
  const info: EcheanceInfo = {
    date: row.echeance_date,
    label: row.echeance_label,
    joursRestants: row.joursRestants,
    enRetard: row.enRetard,
  };
  const level = getUrgenceLevel(info);
  const cls = urgenceBadgeClass(level);
  const text = urgenceBadgeText(info);
  return (
    <Badge className={`border text-xs font-semibold ${cls}`}>{text}</Badge>
  );
}

interface Props {
  impotsImpayes: ImpotImpeRow[];
  honorairesImpayes: PrestationRow[];
  prestationsNonRealisees: PrestationRow[];
}

const ResteAFaire = ({ impotsImpayes, honorairesImpayes, prestationsNonRealisees }: Props) => (
  <div className="space-y-6">
    {/* 4A – Impôts impayés */}
    <div>
      <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
        4A — Impôts impayés ({impotsImpayes.length})
      </p>
      {impotsImpayes.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">Aucun impôt impayé</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-red-100">
          <table className="w-full text-xs">
            <thead className="bg-red-50 border-b border-red-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-red-800">Client</th>
                <th className="text-left px-3 py-2 font-semibold text-red-800">Désignation</th>
                <th className="text-right px-3 py-2 font-semibold text-red-800">Montant Restant</th>
                <th className="text-center px-3 py-2 font-semibold text-red-800">Échéance</th>
                <th className="text-center px-3 py-2 font-semibold text-red-800">Statut</th>
              </tr>
            </thead>
            <tbody>
              {impotsImpayes.map((r, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-red-50/30">
                  <td className="px-3 py-2 font-medium text-gray-800">{r.client_nom}</td>
                  <td className="px-3 py-2 text-gray-700">{r.designation}</td>
                  <td className="px-3 py-2 text-right font-semibold text-red-700">{fmt(r.montant_reste)}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{r.echeance_label}</td>
                  <td className="px-3 py-2 text-center">{urgenceBadge(r)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* 4B – Honoraires impayés */}
    <div>
      <p className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
        4B — Honoraires impayés ({honorairesImpayes.length})
      </p>
      {honorairesImpayes.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">Aucun honoraire impayé</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-amber-100">
          <table className="w-full text-xs">
            <thead className="bg-amber-50 border-b border-amber-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-amber-800">Client</th>
                <th className="text-left px-3 py-2 font-semibold text-amber-800">Désignation</th>
                <th className="text-right px-3 py-2 font-semibold text-amber-800">Facturé</th>
                <th className="text-right px-3 py-2 font-semibold text-amber-800">Payé</th>
                <th className="text-right px-3 py-2 font-semibold text-amber-800">Reste</th>
              </tr>
            </thead>
            <tbody>
              {honorairesImpayes.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-amber-50/30">
                  <td className="px-3 py-2 font-medium text-gray-800">{r.client_nom}</td>
                  <td className="px-3 py-2 text-gray-700">{r.designation}</td>
                  <td className="px-3 py-2 text-right text-gray-600">{fmt(r.montant)}</td>
                  <td className="px-3 py-2 text-right text-emerald-700">{fmt(r.montant_paye)}</td>
                  <td className="px-3 py-2 text-right font-semibold text-amber-700">{fmt(r.montant_reste)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* 4C – Prestations non réalisées */}
    <div>
      <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
        <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
        4C — Prestations non réalisées ({prestationsNonRealisees.length})
      </p>
      {prestationsNonRealisees.length === 0 ? (
        <p className="text-xs text-gray-400 italic py-2">Toutes les prestations sont réalisées</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Client</th>
                <th className="text-left px-3 py-2 font-semibold text-gray-700">Désignation</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-700">Type</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-700">Montant</th>
                <th className="text-center px-3 py-2 font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {prestationsNonRealisees.map(r => (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2 font-medium text-gray-800">{r.client_nom}</td>
                  <td className="px-3 py-2 text-gray-700">{r.designation}</td>
                  <td className="px-3 py-2 text-center">
                    {r.type === "impot"
                      ? <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs">Impôt</Badge>
                      : <Badge className="bg-blue-50 text-blue-700 border border-blue-100 text-xs">Honoraire</Badge>}
                  </td>
                  <td className="px-3 py-2 text-right text-gray-700">{fmt(r.montant)}</td>
                  <td className="px-3 py-2 text-center">
                    {r.realisation === "En cours"
                      ? <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">En cours</Badge>
                      : <Badge className="bg-gray-100 text-gray-700 border border-gray-200 text-xs">À faire</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

export default ResteAFaire;
