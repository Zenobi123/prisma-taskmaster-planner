
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock } from "lucide-react";
import {
  getEcheanceForImpot,
  getUrgenceLevel,
  urgenceBadgeClass,
  urgenceBadgeText,
  EcheanceInfo,
} from "@/utils/echeancesFiscales";

interface ObligationRow {
  client_id: string;
  client_nom: string;
  designation: string;
  montant_reste: number;
  echeance: EcheanceInfo;
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(Math.round(n));
const currentYear = new Date().getFullYear();

const inferPrestationType = (description: string | null | undefined): "impot" | "honoraire" => {
  const text = (description || "").toLowerCase();
  const taxKeywords = ["impot", "impôt", "tva", "is", "irpp", "patente", "cnps", "fiscal"];
  return taxKeywords.some((keyword) => text.includes(keyword)) ? "impot" : "honoraire";
};

const fetchObligations = async (): Promise<ObligationRow[]> => {
  // Fetch factures with their prestations and client info
  const { data: factures, error: fErr } = await supabase
    .from("factures")
    .select("id, montant, montant_paye, client_id, date, status")
    .eq("status", "envoyée");
  if (fErr) throw fErr;

  const { data: clients, error: cErr } = await supabase
    .from("clients")
    .select("id, nom, raisonsociale, type");
  if (cErr) throw cErr;

  const { data: prestations, error: prErr } = await supabase
    .from("prestations")
    .select("id, facture_id, description, montant");
  if (prErr) throw prErr;

  const clientMap = new Map<string, string>();
  for (const c of clients || []) {
    clientMap.set(c.id, c.type === "morale" ? (c.raisonsociale || c.nom) : c.nom);
  }

  const factureMap = new Map(
    (factures || []).map(f => [f.id, f])
  );

  const rows: ObligationRow[] = [];

  for (const pr of prestations || []) {
    const prestationType = inferPrestationType(pr.description);
    if (prestationType !== "impot") continue;

    const facture = factureMap.get(pr.facture_id);
    if (!facture) continue;

    const factureMontant = Number(facture.montant) || 0;
    const facturePaye = Number(facture.montant_paye) || 0;
    const prTotal = Number(pr.montant) || 0;

    // Proportional estimation of paid amount for this prestation
    const montantPaye = factureMontant > 0 ? (prTotal / factureMontant) * facturePaye : 0;
    const montantReste = Math.max(0, prTotal - montantPaye);

    if (montantReste <= 0) continue;

    const year = facture.date ? parseInt(facture.date.substring(0, 4)) : currentYear;
    const designation = pr.description || "—";
    const echeance = getEcheanceForImpot(designation, year);

    rows.push({
      client_id: facture.client_id,
      client_nom: clientMap.get(facture.client_id) || "—",
      designation,
      montant_reste: montantReste,
      echeance,
    });
  }

  // Sort by urgency (overdue first, then closest)
  return rows.sort((a, b) => a.echeance.joursRestants - b.echeance.joursRestants);
};

const RapportEcheances = () => {
  const { data: obligations = [], isLoading } = useQuery({
    queryKey: ["rapportEcheances"],
    queryFn: fetchObligations,
    staleTime: 60000,
  });

  const overdueCount = obligations.filter(o => o.echeance.enRetard).length;
  const urgentCount = obligations.filter(
    o => !o.echeance.enRetard && o.echeance.joursRestants <= 15
  ).length;

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#84A98C]" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="flex flex-wrap gap-2">
        {overdueCount > 0 && (
          <Badge className="bg-red-100 text-red-700 border border-red-200 text-xs gap-1">
            <AlertTriangle className="w-3 h-3" />
            {overdueCount} en retard
          </Badge>
        )}
        {urgentCount > 0 && (
          <Badge className="bg-orange-100 text-orange-700 border border-orange-200 text-xs gap-1">
            <Clock className="w-3 h-3" />
            {urgentCount} urgent{urgentCount > 1 ? "s" : ""}
          </Badge>
        )}
        {obligations.length === 0 && (
          <p className="text-xs text-gray-400 italic">Aucune obligation fiscale impayée</p>
        )}
      </div>

      {obligations.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-gray-100">
          <table className="w-full text-xs">
            <thead className="bg-orange-50 border-b border-orange-100">
              <tr>
                <th className="text-left px-3 py-2 font-semibold text-orange-800">Client</th>
                <th className="text-left px-3 py-2 font-semibold text-orange-800">Obligation</th>
                <th className="text-right px-3 py-2 font-semibold text-orange-800">Restant</th>
                <th className="text-center px-3 py-2 font-semibold text-orange-800">Échéance</th>
                <th className="text-center px-3 py-2 font-semibold text-orange-800">Statut</th>
              </tr>
            </thead>
            <tbody>
              {obligations.map((o, i) => {
                const level = getUrgenceLevel(o.echeance);
                const cls = urgenceBadgeClass(level);
                const text = urgenceBadgeText(o.echeance);
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-orange-50/20">
                    <td className="px-3 py-2 font-medium text-gray-800">{o.client_nom}</td>
                    <td className="px-3 py-2 text-gray-700">{o.designation}</td>
                    <td className="px-3 py-2 text-right font-semibold text-red-700">
                      {fmt(o.montant_reste)} F CFA
                    </td>
                    <td className="px-3 py-2 text-center text-gray-500">{o.echeance.label}</td>
                    <td className="px-3 py-2 text-center">
                      <Badge className={`border text-xs font-semibold ${cls}`}>{text}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RapportEcheances;
