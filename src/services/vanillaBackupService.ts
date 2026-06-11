// Interopérabilité des sauvegardes PRISMA GESTION (vanilla) ↔ Prisma (Supabase).
//
// Import : lit un fichier `prisma-gestion-backup-*.json` (PrismaAutoBackup v2.0)
// et recrée clients → factures (+prestations) → reçus (paiements) → devis →
// propositions, en résolvant les références du vanilla (par NOM de client et
// par NUMÉRO de document). Idempotent : les entités déjà présentes (même NIU /
// numéro / référence) sont ignorées.
//
// Export : reconstruit le même fichier JSON depuis Supabase, lisible par le
// vanilla (ids numériques régénérés, snapshots clientData, statuts vanilla).

import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import { getClients, createClient } from '@/services/clientService';
import { getFactures } from '@/services/factureService';
import { getDevis } from '@/services/devisService';
import { getPropositions } from '@/services/propositionService';
import { loadCabinetConfig, saveCabinetConfig } from '@/lib/spec/cabinetConfig';
import { ventilerPaiement } from '@/lib/spec/adapters';
import type { Client } from '@/types/client';
import type { Facture } from '@/types/facture';
import type { Paiement } from '@/types/paiement';
import {
  type VanillaBackup,
  type VanillaClient,
  vanillaClientToClientPayload,
  vanillaFactureToInsert,
  vanillaRecuToPaiementInsert,
  vanillaDevisToInsert,
  vanillaPropositionToInsert,
  clientToVanillaClient,
  factureToVanillaFacture,
  paiementToVanillaRecu,
  devisToVanillaDevis,
  propositionToVanillaProposition,
  buildVanillaBackup,
} from '@/lib/spec/vanillaBackup';

export interface EntityImportResult {
  created: number;
  skipped: number;
}

export interface VanillaImportReport {
  clients: EntityImportResult;
  factures: EntityImportResult;
  recus: EntityImportResult;
  devis: EntityImportResult;
  propositions: EntityImportResult;
  cabinetConfig: boolean;
  errors: string[];
}

const norm = (s: string | undefined | null): string => (s ?? '').trim().toLowerCase();

/** Index des clients existants par NIU et par nom (pour la résolution vanilla). */
function indexClients(clients: Client[]): { byNiu: Map<string, Client>; byName: Map<string, Client> } {
  const byNiu = new Map<string, Client>();
  const byName = new Map<string, Client>();
  for (const c of clients) {
    if (c.niu) byNiu.set(norm(c.niu), c);
    const name = c.nom || c.raisonsociale;
    if (name) byName.set(norm(name), c);
  }
  return { byNiu, byName };
}

/** Résout (ou crée) le client d'un nom vanilla, avec repli sur le snapshot clientData. */
async function resolveOrCreateClient(
  name: string | undefined,
  snapshot: VanillaClient | undefined,
  vanillaClientsByName: Map<string, VanillaClient>,
  index: { byNiu: Map<string, Client>; byName: Map<string, Client> },
  report: VanillaImportReport,
): Promise<Client | null> {
  const key = norm(name);
  if (!key) return null;

  const vanilla = vanillaClientsByName.get(key) ?? snapshot;
  // 1) Match par NIU puis par nom.
  if (vanilla?.niu) {
    const byNiu = index.byNiu.get(norm(vanilla.niu));
    if (byNiu) return byNiu;
  }
  const byName = index.byName.get(key);
  if (byName) return byName;

  // 2) Création depuis la fiche vanilla (liste clients ou snapshot du document).
  if (!vanilla) return null;
  const created = await createClient(vanillaClientToClientPayload(vanilla));
  report.clients.created += 1;
  if (created.niu) index.byNiu.set(norm(created.niu), created);
  index.byName.set(key, created);
  return created;
}

export async function importVanillaBackup(backup: VanillaBackup): Promise<VanillaImportReport> {
  const report: VanillaImportReport = {
    clients: { created: 0, skipped: 0 },
    factures: { created: 0, skipped: 0 },
    recus: { created: 0, skipped: 0 },
    devis: { created: 0, skipped: 0 },
    propositions: { created: 0, skipped: 0 },
    cabinetConfig: false,
    errors: [],
  };

  const existing = await getClients(true);
  const index = indexClients(existing);
  const vanillaClientsByName = new Map<string, VanillaClient>();
  for (const vc of backup.clients ?? []) {
    if (vc?.name) vanillaClientsByName.set(norm(vc.name), vc);
  }

  // --- 1. Clients ---
  for (const vc of backup.clients ?? []) {
    try {
      const exists =
        (vc.niu && index.byNiu.get(norm(vc.niu))) || (vc.name && index.byName.get(norm(vc.name)));
      if (exists) {
        report.clients.skipped += 1;
        continue;
      }
      const created = await createClient(vanillaClientToClientPayload(vc));
      report.clients.created += 1;
      if (created.niu) index.byNiu.set(norm(created.niu), created);
      index.byName.set(norm(vc.name), created);
    } catch (e) {
      report.errors.push(`Client « ${vc.name ?? '?'} » : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // --- 2. Factures (+ prestations) ---
  const { data: existingFactures } = await supabase.from('factures').select('id');
  const factureIds = new Set((existingFactures ?? []).map((f) => f.id));
  for (const vf of backup.factures ?? []) {
    try {
      const client = await resolveOrCreateClient(vf.client, vf.clientData, vanillaClientsByName, index, report);
      if (!client) {
        report.errors.push(`Facture ${vf.number ?? '?'} : client « ${vf.client ?? '?'} » introuvable.`);
        continue;
      }
      const { facture, prestations } = vanillaFactureToInsert(vf, client.id);
      if (factureIds.has(facture.id)) {
        report.factures.skipped += 1;
        continue;
      }
      const { error } = await supabase.from('factures').insert(facture);
      if (error) throw new Error(error.message);
      factureIds.add(facture.id);
      if (prestations.length > 0) {
        const rows = prestations.map((p) => ({
          id: `FPRE-${crypto.randomUUID()}`,
          facture_id: facture.id,
          ...p,
        }));
        const { error: pErr } = await supabase.from('facture_prestations').insert(rows);
        if (pErr) report.errors.push(`Prestations de ${facture.id} : ${pErr.message}`);
      }
      report.factures.created += 1;
    } catch (e) {
      report.errors.push(`Facture ${vf.number ?? '?'} : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // --- 3. Reçus → paiements ---
  const { data: existingPaiements } = await supabase.from('paiements').select('reference');
  const references = new Set((existingPaiements ?? []).map((p) => p.reference).filter(Boolean));
  for (const vr of backup.recus ?? []) {
    try {
      if (vr.number && references.has(vr.number)) {
        report.recus.skipped += 1;
        continue;
      }
      const client = await resolveOrCreateClient(vr.client, undefined, vanillaClientsByName, index, report);
      if (!client) {
        report.errors.push(`Reçu ${vr.number ?? '?'} : client « ${vr.client ?? '?'} » introuvable.`);
        continue;
      }
      // Résolution de la facture : l'id Supabase d'une facture EST son numéro vanilla.
      const factureNumber =
        vr.factureNumbers?.[0] ?? (vr.sourceType === 'facture' ? vr.sourceNumber ?? undefined : undefined);
      const factureId = factureNumber && factureIds.has(factureNumber) ? factureNumber : null;
      const row = vanillaRecuToPaiementInsert(vr, client.id, factureId);
      const { error } = await supabase.from('paiements').insert(row);
      if (error) throw new Error(error.message);
      if (row.reference) references.add(row.reference);
      report.recus.created += 1;
    } catch (e) {
      report.errors.push(`Reçu ${vr.number ?? '?'} : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // --- 4. Devis (+ prestations) ---
  const { data: existingDevis } = await supabase.from('devis').select('numero');
  const devisNumeros = new Set((existingDevis ?? []).map((d: { numero: string }) => d.numero));
  for (const vd of backup.devis ?? []) {
    try {
      if (vd.number && devisNumeros.has(vd.number)) {
        report.devis.skipped += 1;
        continue;
      }
      const client = await resolveOrCreateClient(vd.client, vd.clientData, vanillaClientsByName, index, report);
      if (!client) {
        report.errors.push(`Devis ${vd.number ?? '?'} : client « ${vd.client ?? '?'} » introuvable.`);
        continue;
      }
      const { devis, prestations } = vanillaDevisToInsert(vd, client.id, `DEV-${crypto.randomUUID()}`);
      const { error } = await supabase.from('devis').insert(devis);
      if (error) throw new Error(error.message);
      devisNumeros.add(devis.numero);
      if (prestations.length > 0) {
        const rows = prestations.map((p) => ({
          id: `DPRE-${crypto.randomUUID()}`,
          devis_id: devis.id,
          ...p,
        }));
        const { error: pErr } = await supabase.from('devis_prestations').insert(rows);
        if (pErr) report.errors.push(`Prestations du devis ${devis.numero} : ${pErr.message}`);
      }
      report.devis.created += 1;
    } catch (e) {
      report.errors.push(`Devis ${vd.number ?? '?'} : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // --- 5. Propositions ---
  const { data: existingProps } = await supabase.from('propositions').select('numero');
  const propNumeros = new Set((existingProps ?? []).map((p: { numero: string }) => p.numero));
  for (const vp of backup.propositions ?? []) {
    try {
      // Le vanilla n'a pas de numéro de proposition : numéro déterministe depuis
      // l'id vanilla (timestamp) pour rester idempotent.
      const numero = `PROP-IMP-${String(vp.id ?? Date.now())}`;
      if (propNumeros.has(numero)) {
        report.propositions.skipped += 1;
        continue;
      }
      const client = await resolveOrCreateClient(vp.client, vp.clientData, vanillaClientsByName, index, report);
      if (!client) {
        report.errors.push(`Proposition du ${vp.date ?? '?'} : client « ${vp.client ?? '?'} » introuvable.`);
        continue;
      }
      const row = vanillaPropositionToInsert(vp, client.id, `PROP-${crypto.randomUUID()}`, numero);
      const { error } = await supabase
        .from('propositions')
        .insert({ ...row, lignes: row.lignes as unknown as Json });
      if (error) throw new Error(error.message);
      propNumeros.add(numero);
      report.propositions.created += 1;
    } catch (e) {
      report.errors.push(`Proposition : ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // --- 6. Configuration cabinet (signature, cachet, signataire…) ---
  if (backup.cabinetConfig && Object.keys(backup.cabinetConfig).length > 0) {
    const current = loadCabinetConfig();
    saveCabinetConfig({ ...current, ...backup.cabinetConfig });
    report.cabinetConfig = true;
  }

  return report;
}

/* ===================================================================== */
/* EXPORT                                                                */
/* ===================================================================== */

interface PaiementRow {
  id: string;
  client_id: string | null;
  facture_id: string | null;
  date: string;
  montant: number;
  mode: string;
  reference: string | null;
  notes: string | null;
  est_credit: boolean | null;
  elements_specifiques: Json | null;
}

export async function exportVanillaBackup(): Promise<VanillaBackup> {
  const [clients, factures, devisList, propositions, paiementsRes] = await Promise.all([
    getClients(false),
    getFactures(),
    getDevis().catch(() => []),
    getPropositions().catch(() => []),
    supabase.from('paiements').select('*').order('date', { ascending: true }),
  ]);
  const paiements = (paiementsRes.data ?? []) as PaiementRow[];

  // Ids numériques façon vanilla (Date.now()) : base + index, et tables de
  // correspondance pour les références croisées.
  let nextId = Date.now();
  const allocId = () => nextId++;

  const vanillaClientByUuid = new Map<string, ReturnType<typeof clientToVanillaClient>>();
  const vanillaClients = clients.map((c) => {
    const vc = clientToVanillaClient(c, allocId());
    vanillaClientByUuid.set(c.id, vc);
    return vc;
  });

  const factureNumericByUuid = new Map<string, number>();
  const factureByUuid = new Map<string, Facture>();
  const vanillaFactures = factures.map((f) => {
    const numericId = allocId();
    factureNumericByUuid.set(f.id, numericId);
    factureByUuid.set(f.id, f);
    const vc =
      vanillaClientByUuid.get(f.client_id) ??
      clientToVanillaClient(
        {
          id: f.client_id,
          type: 'morale',
          regimefiscal: 'reel',
          niu: '',
          centrerattachement: '',
          adresse: { ville: '', quartier: '', lieuDit: '' },
          contact: { telephone: f.client?.telephone ?? '', email: f.client?.email ?? '' },
          secteuractivite: '',
          interactions: [],
          statut: 'actif',
          gestionexternalisee: false,
          raisonsociale: f.client?.nom ?? 'Client',
        },
        allocId(),
      );
    return factureToVanillaFacture(f, vc, numericId);
  });

  const vanillaRecus = paiements.map((p) => {
    const facture = p.facture_id ? factureByUuid.get(p.facture_id) ?? null : null;
    const clientName =
      (p.client_id && vanillaClientByUuid.get(p.client_id)?.name) || facture?.client?.nom || 'Client';
    // Ventilation Impôts / Honoraires identique au reçu de référence.
    let prestationsPayees: Paiement['prestations_payees'];
    if (p.elements_specifiques) {
      try {
        const parsed =
          typeof p.elements_specifiques === 'string'
            ? JSON.parse(p.elements_specifiques)
            : p.elements_specifiques;
        prestationsPayees = (parsed as { prestations_payees?: Paiement['prestations_payees'] })
          ?.prestations_payees;
      } catch {
        prestationsPayees = undefined;
      }
    }
    const { montantImpots, montantHonoraires } = ventilerPaiement(
      { prestations_payees: prestationsPayees } as Paiement,
      Number(p.montant) || 0,
      facture,
    );
    return paiementToVanillaRecu(
      {
        id: p.id,
        reference: p.reference ?? '',
        montant: p.montant,
        mode: p.mode as Paiement['mode'],
        date: p.date,
        notes: p.notes ?? undefined,
      } as Paiement,
      clientName,
      allocId(),
      {
        montantImpots,
        montantHonoraires,
        factureNumericId: p.facture_id ? factureNumericByUuid.get(p.facture_id) : undefined,
        factureNumber: facture ? facture.numero || facture.id : undefined,
      },
    );
  });

  const vanillaDevis = devisList.map((d) => {
    const vc = vanillaClientByUuid.get(d.client_id);
    return devisToVanillaDevis(
      d,
      vc ?? { name: d.client?.nom ?? 'Client' },
      allocId(),
    );
  });

  const vanillaPropositions = propositions.map((p) => {
    const vc = vanillaClientByUuid.get(p.client_id);
    return propositionToVanillaProposition(p, vc ?? { name: p.client?.nom ?? 'Client' }, allocId());
  });

  return buildVanillaBackup({
    clients: vanillaClients,
    factures: vanillaFactures,
    recus: vanillaRecus,
    devis: vanillaDevis,
    propositions: vanillaPropositions,
    cabinetConfig: { ...loadCabinetConfig() },
  });
}
