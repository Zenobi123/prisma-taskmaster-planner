
import { useState } from "react";
import { PrestationRow } from "@/hooks/facturation/useVueActivite";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));

type Filter = "Toutes" | "À faire" | "En cours" | "Effectué";

function realisationBadge(r: PrestationRow["realisation"]) {
  if (r === "Effectué") return <Badge className="bg-green-100 text-green-800 border border-green-200 text-xs">Effectué</Badge>;
  if (r === "En cours") return <Badge className="bg-blue-100 text-blue-800 border border-blue-200 text-xs">En cours</Badge>;
  return <Badge className="bg-gray-100 text-gray-700 border border-gray-200 text-xs">À faire</Badge>;
}

function typeBadge(type: PrestationRow["type"]) {
  return type === "impot"
    ? <Badge className="bg-red-50 text-red-700 border border-red-100 text-xs">Impôt</Badge>
    : <Badge className="bg-blue-50 text-blue-700 border border-blue-100 text-xs">Honoraire</Badge>;
}

interface Props {
  rows: PrestationRow[];
  totalPrestations: number;
  prestationsEffectuees: number;
}

const SuiviPrestations = ({ rows, totalPrestations, prestationsEffectuees }: Props) => {
  const [filter, setFilter] = useState<Filter>("Toutes");

  const filtered = filter === "Toutes" ? rows : rows.filter(r => r.realisation === filter);

  // Group by client
  const byClient = new Map<string, PrestationRow[]>();
  for (const r of filtered) {
    const arr = byClient.get(r.client_nom) || [];
    arr.push(r);
    byClient.set(r.client_nom, arr);
  }

  const pct = totalPrestations > 0 ? (prestationsEffectuees / totalPrestations) * 100 : 0;
  const FILTERS: Filter[] = ["Toutes", "À faire", "En cours", "Effectué"];

  return (
    <div className="space-y-3">
      {/* Filter + progress */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map(f => (
          <Button
            key={f}
            size="sm"
            variant={filter === f ? "default" : "outline"}
            className={`h-6 text-xs px-2 ${filter === f ? "bg-purple-600 text-white" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Avancement</span>
          <span>{prestationsEffectuees} / {totalPrestations} effectuées ({pct.toFixed(0)}%)</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gray-50 rounded-md p-2 border border-gray-100">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-gray-800">{totalPrestations}</p>
        </div>
        <div className="bg-green-50 rounded-md p-2 border border-green-100">
          <p className="text-xs text-green-600">Effectuées</p>
          <p className="font-bold text-green-800">{prestationsEffectuees}</p>
        </div>
        <div className="bg-orange-50 rounded-md p-2 border border-orange-100">
          <p className="text-xs text-orange-600">À faire / En cours</p>
          <p className="font-bold text-orange-800">{totalPrestations - prestationsEffectuees}</p>
        </div>
      </div>

      {/* Table grouped by client */}
      {byClient.size === 0 ? (
        <p className="text-center text-gray-400 text-sm py-4">Aucune prestation</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full text-xs">
            <thead className="bg-purple-50 border-b border-purple-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-purple-800">Facture</th>
                <th className="text-left px-3 py-2 font-semibold text-purple-800">Désignation</th>
                <th className="text-center px-3 py-2 font-semibold text-purple-800">Type</th>
                <th className="text-right px-3 py-2 font-semibold text-purple-800">Montant</th>
                <th className="text-center px-3 py-2 font-semibold text-purple-800">Réalisation</th>
              </tr>
            </thead>
            <tbody>
              {Array.from(byClient.entries()).map(([clientNom, clientRows]) => (
                <>
                  <tr key={`h-${clientNom}`} className="bg-purple-50/60">
                    <td colSpan={5} className="px-3 py-1.5 font-semibold text-purple-900 text-xs">
                      {clientNom} ({clientRows.length})
                    </td>
                  </tr>
                  {clientRows.map(r => (
                    <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-3 py-1.5 font-mono text-gray-500">{r.facture_numero}</td>
                      <td className="px-3 py-1.5 text-gray-800">{r.designation}</td>
                      <td className="px-3 py-1.5 text-center">{typeBadge(r.type)}</td>
                      <td className="px-3 py-1.5 text-right text-gray-700">{fmt(r.montant)}</td>
                      <td className="px-3 py-1.5 text-center">{realisationBadge(r.realisation)}</td>
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SuiviPrestations;
