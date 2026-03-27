
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getEcheanceForImpot } from "@/utils/echeancesFiscales";

// ─── Types ────────────────────────────────────
export interface ClientActiviteRow {
  client_id: string;
  client_nom: string;
  nbFactures: number;
  totalImpots: number;
  totalHonoraires: number;
  totalCA: number;
  totalPaye: number;
  totalReste: number;
  tauxRecouvrement: number;
}

export interface RecuRow {
  id: string;
  reference: string;
  date: string;
  client_nom: string;
  montant_impots: number;
  montant_honoraires: number;
  montant: number;
}

export interface PrestationRow {
  id: string;
  facture_id: string;
  facture_numero?: string;
  client_id: string;
  client_nom: string;
  type: "impot" | "honoraire";
  designation: string;
  montant: number;
  montant_paye: number;
  montant_reste: number;
  realisation: "À faire" | "En cours" | "Effectué";
}

export interface ImpotImpeRow {
  client_nom: string;
  designation: string;
  montant_reste: number;
  echeance_date: string;
  echeance_label: string;
  joursRestants: number;
  enRetard: boolean;
}

export interface ActiviteData {
  year: number;
  // KPIs
  nbClientsActifs: number;
  totalCA: number;
  totalImpots: number;
  totalHonoraires: number;
  totalPaye: number;
  totalReste: number;
  tauxRecouvrement: number;
  prestationsEffectuees: number;
  prestationsEnCours: number;
  prestationsAFaire: number;
  totalPrestations: number;
  // Sections
  clientsRows: ClientActiviteRow[];
  recusRows: RecuRow[];
  prestationsRows: PrestationRow[];
  impotsImpayes: ImpotImpeRow[];
  honorairesImpayes: PrestationRow[];
  prestationsNonRealisees: PrestationRow[];
}

// ─── Hook ─────────────────────────────────────
export function useVueActivite(year: number) {
  const [data, setData] = useState<ActiviteData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch in parallel
      const [
        { data: factures, error: fErr },
        { data: paiements, error: pErr },
        { data: clients, error: cErr },
        { data: prestations, error: prErr },
      ] = await Promise.all([
        supabase
          .from("factures")
          .select("id, numero, date, montant, montant_paye, client_id, status")
          .gte("date", `${year}-01-01`)
          .lte("date", `${year}-12-31`),
        supabase
          .from("paiements")
          .select("id, reference, date, montant, client_id, facture")
          .gte("date", `${year}-01-01`)
          .lte("date", `${year}-12-31`),
        supabase
          .from("clients")
          .select("id, nom, raisonsociale, type"),
        supabase
          .from("prestations")
          .select("id, facture_id, type, designation, total, facture:factures(id, numero, date, client_id)"),
      ]);

      if (fErr) throw fErr;
      if (pErr) throw pErr;
      if (cErr) throw cErr;
      if (prErr) throw prErr;

      // Client name map
      const clientMap = new Map<string, string>();
      for (const c of clients || []) {
        const nom = c.type === "morale" ? (c.raisonsociale || c.nom) : c.nom;
        clientMap.set(c.id, nom || "—");
      }

      const factureList = factures || [];
      const paiementList = paiements || [];
      const prestationList = prestations || [];

      // ── Client aggregation ──
      const clientAgg = new Map<string, ClientActiviteRow>();

      for (const f of factureList) {
        const cid = f.client_id;
        if (!cid) continue;
        const existing = clientAgg.get(cid) || {
          client_id: cid,
          client_nom: clientMap.get(cid) || "—",
          nbFactures: 0,
          totalImpots: 0,
          totalHonoraires: 0,
          totalCA: 0,
          totalPaye: 0,
          totalReste: 0,
          tauxRecouvrement: 0,
        };
        existing.nbFactures += 1;
        existing.totalCA += Number(f.montant) || 0;
        existing.totalPaye += Number(f.montant_paye) || 0;
        clientAgg.set(cid, existing);
      }

      // Impôts / honoraires per client from prestations
      for (const pr of prestationList) {
        const fac = (pr as any).facture;
        if (!fac) continue;
        const factureDate: string = fac.date || "";
        if (!factureDate.startsWith(String(year))) continue;
        const cid = fac.client_id;
        if (!cid) continue;
        const row = clientAgg.get(cid);
        if (!row) continue;
        const amt = Number((pr as any).total) || 0;
        if (pr.type === "impot") row.totalImpots += amt;
        else row.totalHonoraires += amt;
      }

      // Finalize per-client
      for (const row of clientAgg.values()) {
        row.totalReste = row.totalCA - row.totalPaye;
        row.tauxRecouvrement = row.totalCA > 0 ? (row.totalPaye / row.totalCA) * 100 : 0;
      }

      const clientsRows = Array.from(clientAgg.values()).sort((a, b) => b.totalCA - a.totalCA);

      // ── Totals ──
      const totalCA = clientsRows.reduce((s, r) => s + r.totalCA, 0);
      const totalImpots = clientsRows.reduce((s, r) => s + r.totalImpots, 0);
      const totalHonoraires = clientsRows.reduce((s, r) => s + r.totalHonoraires, 0);
      const totalPaye = clientsRows.reduce((s, r) => s + r.totalPaye, 0);
      const totalReste = totalCA - totalPaye;
      const tauxRecouvrement = totalCA > 0 ? (totalPaye / totalCA) * 100 : 0;
      const nbClientsActifs = clientsRows.filter(r => r.nbFactures > 0).length;

      // ── Reçus / paiements rows ──
      const recusRows: RecuRow[] = paiementList.map(p => ({
        id: p.id,
        reference: (p as any).reference || p.id,
        date: p.date,
        client_nom: clientMap.get(p.client_id) || "—",
        montant_impots: Number((p as any).montant_impots) || 0,
        montant_honoraires: Number((p as any).montant_honoraires) || 0,
        montant: Number(p.montant) || 0,
      })).sort((a, b) => b.date.localeCompare(a.date));

      // ── Prestations rows ──
      const factureIdMap = new Map(factureList.map(f => [f.id, f]));
      const prestationsRows: PrestationRow[] = [];

      for (const pr of prestationList) {
        const fac = (pr as any).facture;
        if (!fac) continue;
        const factureDate: string = fac.date || "";
        if (!factureDate.startsWith(String(year))) continue;
        const cid = fac.client_id;

        // Estimate paid amount proportionally from facture
        const parentFacture = factureIdMap.get(fac.id);
        const factureMontant = Number(parentFacture?.montant) || 0;
        const facturePaye = Number(parentFacture?.montant_paye) || 0;
        const prTotal = Number((pr as any).total) || 0;
        const montantPaye = factureMontant > 0 ? (prTotal / factureMontant) * facturePaye : 0;

        prestationsRows.push({
          id: pr.id,
          facture_id: fac.id,
          facture_numero: fac.numero || "—",
          client_id: cid || "",
          client_nom: clientMap.get(cid) || "—",
          type: (pr.type === "impot" ? "impot" : "honoraire") as "impot" | "honoraire",
          designation: pr.designation || "—",
          montant: prTotal,
          montant_paye: montantPaye,
          montant_reste: Math.max(0, prTotal - montantPaye),
          realisation: "À faire",
        });
      }

      // Prestation stats (all treated as "À faire" since we don't have realisation in DB yet)
      const prestationsEffectuees = prestationsRows.filter(p => p.realisation === "Effectué").length;
      const prestationsEnCours = prestationsRows.filter(p => p.realisation === "En cours").length;
      const prestationsAFaire = prestationsRows.filter(p => p.realisation === "À faire").length;
      const totalPrestations = prestationsRows.length;

      // ── Reste à faire ──
      const impotsImpayes: ImpotImpeRow[] = prestationsRows
        .filter(p => p.type === "impot" && p.montant_reste > 0)
        .map(p => {
          const ech = getEcheanceForImpot(p.designation, year);
          return {
            client_nom: p.client_nom,
            designation: p.designation,
            montant_reste: p.montant_reste,
            echeance_date: ech.date,
            echeance_label: ech.label,
            joursRestants: ech.joursRestants,
            enRetard: ech.enRetard,
          };
        })
        .sort((a, b) => a.joursRestants - b.joursRestants);

      const honorairesImpayes = prestationsRows.filter(
        p => p.type === "honoraire" && p.montant_reste > 0
      );

      const prestationsNonRealisees = prestationsRows.filter(
        p => p.realisation !== "Effectué"
      );

      setData({
        year,
        nbClientsActifs,
        totalCA,
        totalImpots,
        totalHonoraires,
        totalPaye,
        totalReste,
        tauxRecouvrement,
        prestationsEffectuees,
        prestationsEnCours,
        prestationsAFaire,
        totalPrestations,
        clientsRows,
        recusRows,
        prestationsRows,
        impotsImpayes,
        honorairesImpayes,
        prestationsNonRealisees,
      });
    } catch (e: any) {
      console.error("useVueActivite error:", e);
      setError(e.message || "Erreur de chargement");
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refresh: load };
}
