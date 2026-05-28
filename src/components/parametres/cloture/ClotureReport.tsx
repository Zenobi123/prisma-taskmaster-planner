import React from "react";
import type { ClotureData } from "@/services/clotureService";
import type { CabinetConfig } from "@/lib/spec/cabinetConfig";
import type {
  ObligationStatuses,
  TaxObligationStatus,
  DeclarationObligationStatus,
} from "@/hooks/fiscal/types";

interface ClotureReportProps {
  data: ClotureData;
  cabinet: CabinetConfig;
}

const fmtMoney = (n: number): string =>
  `${Math.round(n || 0).toLocaleString("fr-FR")} F CFA`;

const fmtDate = (d: string | null | undefined): string => {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("fr-FR");
};

const FACTURE_STATUT: Record<string, string> = {
  non_payée: "Non payée",
  partiellement_payée: "Partiellement payée",
  payée: "Payée",
  en_retard: "En retard",
};

const MISSION_STATUT: Record<string, string> = {
  en_attente: "En attente",
  en_cours: "En cours",
  termine: "Terminée",
  en_retard: "En retard",
};

const TAX_LABELS: { key: keyof ObligationStatuses; label: string }[] = [
  { key: "igs", label: "IGS" },
  { key: "patente", label: "Patente" },
  { key: "licence", label: "Licence" },
  { key: "bailCommercial", label: "Bail commercial" },
  { key: "precompteLoyer", label: "Précompte loyer" },
  { key: "tpf", label: "TPF" },
];

const DECLARATION_LABELS: { key: keyof ObligationStatuses; label: string }[] = [
  { key: "dsf", label: "DSF" },
  { key: "darp", label: "DARP" },
  { key: "dbef", label: "DBEF" },
  { key: "cntps", label: "CNPS" },
  { key: "precomptes", label: "Précomptes" },
];

function summariseObligations(obligations: ObligationStatuses): string {
  const parts: string[] = [];

  for (const { key, label } of TAX_LABELS) {
    const o = obligations[key] as TaxObligationStatus | undefined;
    if (o?.assujetti) parts.push(`${label} : ${o.payee ? "payé" : "non payé"}`);
  }
  for (const { key, label } of DECLARATION_LABELS) {
    const o = obligations[key] as DeclarationObligationStatus | undefined;
    if (o?.assujetti) parts.push(`${label} : ${o.depose ? "déposé" : "non déposé"}`);
  }

  return parts.length ? parts.join(" • ") : "Aucune obligation assujettie";
}

const thStyle = "border border-gray-400 px-2 py-1 text-left bg-gray-100";
const tdStyle = "border border-gray-400 px-2 py-1 align-top";

/**
 * Document imprimable récapitulant en détail tous les éléments d'un exercice
 * comptable au moment de sa clôture (factures, paiements, missions, états fiscaux).
 */
export const ClotureReport: React.FC<ClotureReportProps> = ({ data, cabinet }) => {
  const totalFactures = data.factures.reduce((s, f) => s + (f.montant || 0), 0);
  const totalPaiements = data.paiements.reduce((s, p) => s + (p.montant || 0), 0);

  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", color: "#111", fontSize: "11px" }}>
      <div className="flex justify-between items-start border-b-2 border-[#1e3a8a] pb-2 mb-4">
        <div>
          <div className="text-lg font-bold text-[#1e3a8a]">{cabinet.nomCabinet}</div>
          <div className="text-xs text-gray-600">{cabinet.slogan}</div>
          <div className="text-xs text-gray-600">{cabinet.siege}</div>
          <div className="text-xs text-gray-600">NIU : {cabinet.niu}</div>
        </div>
        <div className="text-right text-xs text-gray-600">
          Édité le {new Date().toLocaleDateString("fr-FR")}
        </div>
      </div>

      <h1 className="text-center text-base font-bold mb-1">
        POINT DE CLÔTURE DE L'EXERCICE {data.year}
      </h1>
      <p className="text-center text-xs text-gray-600 mb-4">
        Récapitulatif détaillé des éléments de l'exercice comptable {data.year}
      </p>

      <div className="mb-4 text-xs">
        <strong>Synthèse :</strong> {data.factures.length} facture(s) ({fmtMoney(totalFactures)}) •{" "}
        {data.paiements.length} paiement(s) ({fmtMoney(totalPaiements)}) • {data.missions.length}{" "}
        mission(s) • {data.etatsFiscaux.length} client(s) avec états fiscaux
      </div>

      {/* FACTURES */}
      <h2 className="text-sm font-bold text-[#1e3a8a] mt-4 mb-2">
        1. Factures émises ({data.factures.length})
      </h2>
      {data.factures.length === 0 ? (
        <p className="text-xs text-gray-500 italic mb-2">Aucune facture pour cet exercice.</p>
      ) : (
        <table className="w-full border-collapse text-[10px] mb-2">
          <thead>
            <tr>
              <th className={thStyle}>N°</th>
              <th className={thStyle}>Date</th>
              <th className={thStyle}>Client</th>
              <th className={thStyle}>Montant</th>
              <th className={thStyle}>Statut paiement</th>
            </tr>
          </thead>
          <tbody>
            {data.factures.map((f) => (
              <tr key={f.id}>
                <td className={tdStyle}>{f.numero || "—"}</td>
                <td className={tdStyle}>{fmtDate(f.date)}</td>
                <td className={tdStyle}>{f.client?.nom || "—"}</td>
                <td className={tdStyle}>{fmtMoney(f.montant)}</td>
                <td className={tdStyle}>{FACTURE_STATUT[f.status_paiement] || f.status_paiement}</td>
              </tr>
            ))}
            <tr>
              <td className={`${tdStyle} font-bold`} colSpan={3}>
                Total
              </td>
              <td className={`${tdStyle} font-bold`}>{fmtMoney(totalFactures)}</td>
              <td className={tdStyle}></td>
            </tr>
          </tbody>
        </table>
      )}

      {/* PAIEMENTS */}
      <h2 className="text-sm font-bold text-[#1e3a8a] mt-4 mb-2">
        2. Paiements reçus ({data.paiements.length})
      </h2>
      {data.paiements.length === 0 ? (
        <p className="text-xs text-gray-500 italic mb-2">Aucun paiement pour cet exercice.</p>
      ) : (
        <table className="w-full border-collapse text-[10px] mb-2">
          <thead>
            <tr>
              <th className={thStyle}>Date</th>
              <th className={thStyle}>Client</th>
              <th className={thStyle}>Référence</th>
              <th className={thStyle}>Mode</th>
              <th className={thStyle}>Montant</th>
            </tr>
          </thead>
          <tbody>
            {data.paiements.map((p) => (
              <tr key={p.id}>
                <td className={tdStyle}>{fmtDate(p.date)}</td>
                <td className={tdStyle}>{p.client || "—"}</td>
                <td className={tdStyle}>{p.reference || "—"}</td>
                <td className={tdStyle}>{p.mode || "—"}</td>
                <td className={tdStyle}>{fmtMoney(p.montant)}</td>
              </tr>
            ))}
            <tr>
              <td className={`${tdStyle} font-bold`} colSpan={4}>
                Total
              </td>
              <td className={`${tdStyle} font-bold`}>{fmtMoney(totalPaiements)}</td>
            </tr>
          </tbody>
        </table>
      )}

      {/* MISSIONS */}
      <h2 className="text-sm font-bold text-[#1e3a8a] mt-4 mb-2">
        3. Missions ({data.missions.length})
      </h2>
      {data.missions.length === 0 ? (
        <p className="text-xs text-gray-500 italic mb-2">Aucune mission pour cet exercice.</p>
      ) : (
        <table className="w-full border-collapse text-[10px] mb-2">
          <thead>
            <tr>
              <th className={thStyle}>Mission</th>
              <th className={thStyle}>Client</th>
              <th className={thStyle}>Assigné à</th>
              <th className={thStyle}>Période</th>
              <th className={thStyle}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {data.missions.map((m) => (
              <tr key={m.id}>
                <td className={tdStyle}>{m.title}</td>
                <td className={tdStyle}>
                  {m.clients?.type === "physique"
                    ? m.clients?.nom
                    : m.clients?.raisonsociale || m.clients?.nom || "—"}
                </td>
                <td className={tdStyle}>
                  {m.collaborateurs
                    ? `${m.collaborateurs.prenom} ${m.collaborateurs.nom}`
                    : "Non assigné"}
                </td>
                <td className={tdStyle}>
                  {fmtDate(m.start_date)} → {fmtDate(m.end_date)}
                </td>
                <td className={tdStyle}>{MISSION_STATUT[m.status] || m.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ÉTATS FISCAUX */}
      <h2 className="text-sm font-bold text-[#1e3a8a] mt-4 mb-2">
        4. États fiscaux ({data.etatsFiscaux.length} client(s))
      </h2>
      {data.etatsFiscaux.length === 0 ? (
        <p className="text-xs text-gray-500 italic mb-2">
          Aucun état fiscal enregistré pour cet exercice.
        </p>
      ) : (
        <table className="w-full border-collapse text-[10px] mb-2">
          <thead>
            <tr>
              <th className={thStyle}>Client</th>
              <th className={thStyle}>NIU</th>
              <th className={thStyle}>Obligations {data.year}</th>
            </tr>
          </thead>
          <tbody>
            {data.etatsFiscaux.map((row, i) => (
              <tr key={`${row.niu}-${i}`}>
                <td className={tdStyle}>{row.clientNom}</td>
                <td className={tdStyle}>{row.niu || "—"}</td>
                <td className={tdStyle}>{summariseObligations(row.obligations)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-8 flex justify-end">
        <div className="text-center text-xs">
          <div>{cabinet.signataireTitre}</div>
          <div className="font-bold mt-6">{cabinet.signataireNom}</div>
        </div>
      </div>
    </div>
  );
};
