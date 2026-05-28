import { supabase } from "@/integrations/supabase/client";
import { getFactures } from "@/services/factureService";
import { getTasks, type Task } from "@/services/taskService";
import { getClients } from "@/services/clientService";
import type { Facture } from "@/types/facture";
import type { Client } from "@/types/client";
import type { ClientFiscalData, ObligationStatuses } from "@/hooks/fiscal/types";

export interface CloturePaiementRow {
  id: string;
  date: string;
  client: string;
  facture_id: string | null;
  montant: number;
  mode: string;
  reference: string;
}

export interface ClotureFiscalRow {
  clientNom: string;
  niu: string;
  obligations: ObligationStatuses;
}

export interface ClotureData {
  year: number;
  factures: Facture[];
  paiements: CloturePaiementRow[];
  missions: Task[];
  etatsFiscaux: ClotureFiscalRow[];
}

const yearOf = (date: string | null | undefined): number | null => {
  if (!date) return null;
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? null : d.getFullYear();
};

const clientLabel = (client: Client): string =>
  client.type === "physique"
    ? client.nom || "Client"
    : client.raisonsociale || client.nom || "Client";

/** Récupère tous les éléments d'une année donnée pour le point de clôture. */
export async function getClotureData(year: number): Promise<ClotureData> {
  const [factures, tasks, clients, paiementsRes] = await Promise.all([
    getFactures(),
    getTasks(),
    getClients(true),
    supabase
      .from("paiements")
      .select(`*, clients:client_id (nom, raisonsociale)`)
      .order("date", { ascending: true }),
  ]);

  const facturesY = factures
    .filter((f) => yearOf(f.date) === year)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const missionsY = tasks
    .filter((t) => yearOf(t.start_date || t.end_date || t.created_at) === year)
    .sort(
      (a, b) =>
        new Date(a.start_date || a.created_at).getTime() -
        new Date(b.start_date || b.created_at).getTime(),
    );

  const paiementsRows = paiementsRes.data ?? [];
  const paiementsY: CloturePaiementRow[] = paiementsRows
    .filter((p) => yearOf(p.date) === year)
    .map((p) => ({
      id: p.id,
      date: p.date,
      client: p.clients ? p.clients.nom || p.clients.raisonsociale || "" : "",
      facture_id: p.facture_id ?? null,
      montant: Number(p.montant) || 0,
      mode: p.mode || "",
      reference: p.reference || "",
    }));

  const yearKey = String(year);
  const etatsFiscaux: ClotureFiscalRow[] = clients
    .map((client) => {
      const fiscalData = client.fiscal_data as ClientFiscalData | undefined;
      const obligations = fiscalData?.obligations?.[yearKey];
      if (!obligations) return null;
      return {
        clientNom: clientLabel(client),
        niu: client.niu || "",
        obligations,
      };
    })
    .filter((row): row is ClotureFiscalRow => row !== null)
    .sort((a, b) => a.clientNom.localeCompare(b.clientNom, "fr"));

  return {
    year,
    factures: facturesY,
    paiements: paiementsY,
    missions: missionsY,
    etatsFiscaux,
  };
}
