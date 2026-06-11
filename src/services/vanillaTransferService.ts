// Import / export bidirectionnel avec l'application vanilla (facturation/),
// au format d'échange PRISMA-CLIENTS v1 :
//   - import : clients + historique (factures, devis, reçus, propositions,
//     courriers) vers Supabase — idempotent (doublons ignorés par numéro) ;
//   - export : clients PRISMA + historique vers une enveloppe réimportable
//     telle quelle dans l'application vanilla.

import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/client";
import { invalidateClientsCache } from "./client/clientCacheService";
import { recalculerStatutPaiementFacture } from "./factureServices/facturePaiementSyncService";
import {
  VanillaClient,
  VanillaEnvelope,
  VanillaHistorique,
} from "@/utils/vanillaTransfer/types";
import { buildVanillaEnvelope } from "@/utils/vanillaTransfer/envelope";
import {
  prismaToVanillaClient,
  vanillaToPrismaClient,
} from "@/utils/vanillaTransfer/clientMapper";
import {
  CourrierRowLike,
  DevisRowLike,
  FactureRowLike,
  PaiementRowLike,
  PrestationRowLike,
  PropositionRowLike,
  courrierRowToVanilla,
  devisRowToVanilla,
  factureRowToVanilla,
  paiementRowToVanillaRecu,
  prestationVanillaToRow,
  propositionRowToVanilla,
  vanillaCourrierToRow,
  vanillaDevisToRow,
  vanillaFactureToRow,
  vanillaPropositionToRow,
  vanillaRecuToPaiementRow,
} from "@/utils/vanillaTransfer/documentMappers";

export interface VanillaImportCounts {
  importes: number;
  ignores: number;
}

export interface VanillaImportReport {
  clientsCrees: string[];
  clientsExistants: string[];
  factures: VanillaImportCounts;
  devis: VanillaImportCounts;
  recus: VanillaImportCounts;
  propositions: VanillaImportCounts;
  courriers: VanillaImportCounts;
  nonSupportes: { notes: number; contrats: number };
  erreurs: string[];
}

const emptyReport = (): VanillaImportReport => ({
  clientsCrees: [],
  clientsExistants: [],
  factures: { importes: 0, ignores: 0 },
  devis: { importes: 0, ignores: 0 },
  recus: { importes: 0, ignores: 0 },
  propositions: { importes: 0, ignores: 0 },
  courriers: { importes: 0, ignores: 0 },
  nonSupportes: { notes: 0, contrats: 0 },
  erreurs: [],
});

const normName = (s: string | undefined | null): string =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

/**
 * Insère un client converti depuis le vanilla, avec ses colonnes fiscales
 * étendues (civilite, chiffreaffaires, iscga, agences…). Si la contrainte sur
 * regimefiscal rejette la valeur (ex. « obnl » sur une base plus ancienne), on
 * réessaie en « reel » et on le signale dans le rapport.
 */
async function insertVanillaClient(
  mapped: Partial<Client>,
  displayName: string,
  report: VanillaImportReport,
): Promise<string | null> {
  const payload: Record<string, unknown> = {
    type: mapped.type,
    nom: mapped.nom ?? null,
    raisonsociale: mapped.raisonsociale ?? null,
    niu: mapped.niu || "",
    centrerattachement: mapped.centrerattachement || "",
    adresse: mapped.adresse,
    contact: mapped.contact,
    secteuractivite: mapped.secteuractivite || "",
    numerocnps: mapped.numerocnps ?? null,
    regimefiscal: mapped.regimefiscal,
    statut: mapped.statut || "actif",
    gestionexternalisee: mapped.gestionexternalisee || false,
    situationimmobiliere: mapped.situationimmobiliere ?? null,
    interactions: [],
    civilite: mapped.civilite,
    chiffreaffaires: mapped.chiffreaffaires ?? 0,
    iscga: mapped.iscga ?? false,
    isvendeurboissons: mapped.isvendeurboissons ?? false,
    modepaiementigs: mapped.modepaiementigs ?? "annuel",
    modepaiementpsl: mapped.modepaiementpsl ?? "annuel",
    agences: mapped.agences ?? null,
  };

  let { data, error } = await supabase
    .from("clients")
    .insert([payload as never])
    .select("id")
    .single();

  if (error && /regimefiscal/i.test(error.message || "")) {
    ({ data, error } = await supabase
      .from("clients")
      .insert([{ ...payload, regimefiscal: "reel" } as never])
      .select("id")
      .single());
    if (!error) {
      report.erreurs.push(
        `« ${displayName} » : régime fiscal « ${mapped.regimefiscal} » refusé par la base, enregistré en « reel ».`,
      );
    }
  }

  if (error || !data) {
    report.erreurs.push(`Client « ${displayName} » : ${error?.message || "insertion impossible"}.`);
    return null;
  }
  return data.id as string;
}

/**
 * Importe une enveloppe PRISMA-CLIENTS dans Supabase.
 * Les clients sont rapprochés par NIU (puis par nom) — un client déjà présent
 * n'est pas modifié, son historique est rattaché à la fiche existante.
 * Les documents déjà présents (même numéro/référence) sont ignorés.
 */
export async function importVanillaEnvelope(
  envelope: VanillaEnvelope,
): Promise<VanillaImportReport> {
  const report = emptyReport();
  const nameToClientId = new Map<string, string>();

  // --- 1. Clients : rapprochement par NIU, sinon par nom ---
  for (const vc of envelope.clients) {
    const displayName = vc.name || vc.niu || "(sans nom)";
    const mapped = vanillaToPrismaClient(vc);

    let existingId: string | null = null;
    if (mapped.niu) {
      const { data } = await supabase
        .from("clients")
        .select("id")
        .eq("niu", mapped.niu)
        .is("deleted_at", null)
        .limit(1)
        .maybeSingle();
      existingId = data?.id ?? null;
    }
    if (!existingId && vc.name) {
      const column = mapped.type === "morale" ? "raisonsociale" : "nom";
      const { data } = await supabase
        .from("clients")
        .select("id")
        .ilike(column, vc.name.trim())
        .is("deleted_at", null)
        .limit(1)
        .maybeSingle();
      existingId = data?.id ?? null;
    }

    if (existingId) {
      nameToClientId.set(normName(vc.name), existingId);
      report.clientsExistants.push(displayName);
      continue;
    }

    const newId = await insertVanillaClient(mapped, displayName, report);
    if (newId) {
      nameToClientId.set(normName(vc.name), newId);
      report.clientsCrees.push(displayName);
    }
  }

  const h: VanillaHistorique = envelope.historique || {};
  const resolveClientId = (rec: { client?: string; clientData?: VanillaClient | null }) =>
    nameToClientId.get(normName(rec.client || rec.clientData?.name)) ?? null;

  // --- 2. Factures (+ prestations) ---
  for (const f of h.factures || []) {
    const clientId = resolveClientId(f);
    if (!clientId || !f.number) {
      report.factures.ignores++;
      if (!clientId) report.erreurs.push(`Facture ${f.number || f.id} : client introuvable.`);
      continue;
    }
    const { data: exists } = await supabase
      .from("factures")
      .select("id")
      .eq("id", f.number)
      .maybeSingle();
    if (exists) {
      report.factures.ignores++;
      continue;
    }
    const row = vanillaFactureToRow(f, clientId);
    const { error } = await supabase.from("factures").insert(row);
    if (error) {
      report.factures.ignores++;
      report.erreurs.push(`Facture ${f.number} : ${error.message}`);
      continue;
    }
    const prestations = (f.prestations || []).map((p) => ({
      id: `FPRE-${crypto.randomUUID()}`,
      facture_id: row.id,
      ...prestationVanillaToRow(p),
    }));
    if (prestations.length > 0) {
      await supabase.from("facture_prestations").insert(prestations as never);
    }
    report.factures.importes++;
  }

  // --- 3. Devis (+ prestations, lien vers la facture convertie) ---
  for (const d of h.devis || []) {
    const clientId = resolveClientId(d);
    if (!clientId || !d.number) {
      report.devis.ignores++;
      if (!clientId) report.erreurs.push(`Devis ${d.number || d.id} : client introuvable.`);
      continue;
    }
    const { data: exists } = await supabase
      .from("devis")
      .select("id")
      .eq("numero", d.number)
      .maybeSingle();
    if (exists) {
      report.devis.ignores++;
      continue;
    }
    let factureId: string | null = null;
    if (d.convertedToFacture) {
      const { data: fact } = await supabase
        .from("factures")
        .select("id")
        .eq("id", d.convertedToFacture)
        .maybeSingle();
      factureId = fact?.id ?? null;
    }
    const row = vanillaDevisToRow(d, clientId, factureId);
    const { error } = await supabase.from("devis").insert(row as never);
    if (error) {
      report.devis.ignores++;
      report.erreurs.push(`Devis ${d.number} : ${error.message}`);
      continue;
    }
    const prestations = (d.prestations || []).map((p) => ({
      id: `DPRE-${crypto.randomUUID()}`,
      devis_id: row.id,
      ...prestationVanillaToRow(p),
    }));
    if (prestations.length > 0) {
      await supabase.from("devis_prestations").insert(prestations as never);
    }
    report.devis.importes++;
  }

  // --- 4. Reçus → paiements (puis recalcul du statut des factures liées) ---
  const facturesARecalculer = new Set<string>();
  for (const r of h.recus || []) {
    const clientId = resolveClientId(r);
    if (!clientId) {
      report.recus.ignores++;
      report.erreurs.push(`Reçu ${r.number || r.id} : client introuvable.`);
      continue;
    }
    if (r.number) {
      const { data: exists } = await supabase
        .from("paiements")
        .select("id")
        .eq("reference", r.number)
        .maybeSingle();
      if (exists) {
        report.recus.ignores++;
        continue;
      }
    }
    const factureNumber =
      r.factureNumbers?.[0] || (r.sourceType === "facture" ? r.sourceNumber || null : null);
    let factureId: string | null = null;
    let factureMontant: number | null = null;
    if (factureNumber) {
      const { data: fact } = await supabase
        .from("factures")
        .select("id, montant")
        .eq("id", factureNumber)
        .maybeSingle();
      if (fact) {
        factureId = fact.id;
        factureMontant = Number(fact.montant) || 0;
      }
    }
    const row = vanillaRecuToPaiementRow(r, clientId, factureId, factureMontant);
    const { error } = await supabase.from("paiements").insert(row as never);
    if (error) {
      report.recus.ignores++;
      report.erreurs.push(`Reçu ${r.number || r.id} : ${error.message}`);
      continue;
    }
    if (factureId) facturesARecalculer.add(factureId);
    report.recus.importes++;
  }
  for (const factureId of facturesARecalculer) {
    await recalculerStatutPaiementFacture(factureId);
  }

  // --- 5. Propositions ---
  for (const p of h.propositions || []) {
    const clientId = resolveClientId(p);
    if (!clientId) {
      report.propositions.ignores++;
      report.erreurs.push(`Proposition ${p.id} : client introuvable.`);
      continue;
    }
    const row = vanillaPropositionToRow(p, clientId);
    const { data: exists } = await supabase
      .from("propositions")
      .select("id")
      .eq("numero", row.numero)
      .maybeSingle();
    if (exists) {
      report.propositions.ignores++;
      continue;
    }
    const { error } = await supabase.from("propositions").insert(row as never);
    if (error) {
      report.propositions.ignores++;
      report.erreurs.push(`Proposition ${row.numero} : ${error.message}`);
      continue;
    }
    report.propositions.importes++;
  }

  // --- 6. Courriers ---
  for (const c of h.courriers || []) {
    const clientId = resolveClientId(c);
    const row = vanillaCourrierToRow(c, clientId);
    const { data: exists } = await supabase
      .from("courriers")
      .select("id")
      .eq("reference", row.reference)
      .maybeSingle();
    if (exists) {
      report.courriers.ignores++;
      continue;
    }
    const { error } = await supabase.from("courriers").insert(row as never);
    if (error) {
      report.courriers.ignores++;
      report.erreurs.push(`Courrier ${row.reference} : ${error.message}`);
      continue;
    }
    report.courriers.importes++;
  }

  // --- 7. Collections sans équivalent PRISMA ---
  report.nonSupportes.notes = Array.isArray(h.notes) ? h.notes.length : 0;
  report.nonSupportes.contrats = Array.isArray(h.contrats) ? h.contrats.length : 0;

  invalidateClientsCache();
  return report;
}

/**
 * Exporte des clients PRISMA au format PRISMA-CLIENTS, avec ou sans leur
 * historique d'opérations. L'enveloppe produite est directement importable
 * dans l'application vanilla (clients.html → Importer).
 */
export async function exportClientsVanilla(
  clients: Client[],
  withHistory: boolean,
): Promise<VanillaEnvelope> {
  const vanillaClients = clients.map(prismaToVanillaClient);
  if (!withHistory) {
    return buildVanillaEnvelope(vanillaClients);
  }

  const historique: Required<VanillaHistorique> = {
    factures: [],
    devis: [],
    recus: [],
    propositions: [],
    notes: [],
    courriers: [],
    contrats: [],
  };

  for (let i = 0; i < clients.length; i++) {
    const client = clients[i];
    const vc = vanillaClients[i];

    // Factures + prestations
    const { data: factures } = await supabase
      .from("factures")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });
    const factureRows = (factures || []) as FactureRowLike[];
    const factureIds = factureRows.map((f) => f.id);

    const prestationsByFacture = new Map<string, PrestationRowLike[]>();
    if (factureIds.length > 0) {
      const { data: prestations } = await supabase
        .from("facture_prestations")
        .select("*")
        .in("facture_id", factureIds);
      for (const p of (prestations || []) as Array<PrestationRowLike & { facture_id: string }>) {
        const list = prestationsByFacture.get(p.facture_id) || [];
        list.push(p);
        prestationsByFacture.set(p.facture_id, list);
      }
    }

    // Devis + prestations (et lien devis → facture pour fromDevis)
    const { data: devis } = await supabase
      .from("devis")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });
    const devisRows = (devis || []) as Array<DevisRowLike & { client_id: string }>;
    const devisIds = devisRows.map((d) => d.id);

    const prestationsByDevis = new Map<string, PrestationRowLike[]>();
    if (devisIds.length > 0) {
      const { data: prestations } = await supabase
        .from("devis_prestations")
        .select("*")
        .in("devis_id", devisIds);
      for (const p of (prestations || []) as Array<PrestationRowLike & { devis_id: string }>) {
        const list = prestationsByDevis.get(p.devis_id) || [];
        list.push(p);
        prestationsByDevis.set(p.devis_id, list);
      }
    }

    const devisByFactureId = new Map<string, { id: string; numero: string }>();
    for (const d of devisRows) {
      if (d.facture_id) devisByFactureId.set(d.facture_id, { id: d.id, numero: d.numero });
    }

    for (const f of factureRows) {
      historique.factures.push(
        factureRowToVanilla(
          f,
          prestationsByFacture.get(f.id) || [],
          vc,
          devisByFactureId.get(f.id) || null,
        ),
      );
    }
    for (const d of devisRows) {
      historique.devis.push(devisRowToVanilla(d, prestationsByDevis.get(d.id) || [], vc));
    }

    // Paiements → reçus
    const { data: paiements } = await supabase
      .from("paiements")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });
    const factureById = new Map(factureRows.map((f) => [f.id, f]));
    for (const p of (paiements || []) as PaiementRowLike[]) {
      const facture = p.facture_id ? factureById.get(p.facture_id) || null : null;
      historique.recus.push(
        paiementRowToVanillaRecu(
          p,
          vc,
          facture ? { id: facture.id, montant: facture.montant } : null,
          facture ? prestationsByFacture.get(facture.id) || [] : [],
        ),
      );
    }

    // Propositions
    const { data: propositions } = await supabase
      .from("propositions")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });
    for (const p of (propositions || []) as PropositionRowLike[]) {
      historique.propositions.push(propositionRowToVanilla(p, vc));
    }

    // Courriers
    const { data: courriers } = await supabase
      .from("courriers")
      .select("*")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true });
    for (const c of (courriers || []) as CourrierRowLike[]) {
      historique.courriers.push(courrierRowToVanilla(c, vc));
    }
  }

  return buildVanillaEnvelope(vanillaClients, historique);
}
