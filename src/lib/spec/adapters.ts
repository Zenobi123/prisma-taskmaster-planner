// Adapters : convertit les types existants (src/types/*) vers les types Spec
// utilisés par les templates imprimables.

import type { Facture as ExistingFacture, Prestation as ExistingPrestation } from '@/types/facture';
import type { Devis as ExistingDevis } from '@/types/devis';
import type { Proposition as ExistingProposition } from '@/types/proposition';
import type { Paiement as ExistingPaiement } from '@/types/paiement';
import type { CourrierRecord } from '@/types/courrier';
import type { Client as ExistingClient } from '@/types/client';

import type { ClientSpec } from '@/lib/spec/fiscal';
import { adaptClient } from '@/lib/spec/fiscal';
import type { Prestation as SpecPrestation } from '@/lib/spec/facturePrestations';
import type { FacturePrintData } from '@/components/printable/PrintableFacture';
import type { NotePrintData } from '@/components/printable/PrintableNote';
import type {
  DevisPrintData,
  DevisStatus as PrintableDevisStatus,
} from '@/components/printable/PrintableDevis';
import type { CourrierPrintData } from '@/components/printable/PrintableCourrier';
import type { PropositionPrintData } from '@/components/printable/PrintableProposition';
import type { RecuPrintData, RecuPaymentMode } from '@/components/printable/PrintableRecu';
import type { CourrierStatut } from '@/lib/spec/courrierStatut';
import { getCiviliteLongue } from '@/lib/spec/fiscal';

function adaptPrestation(p: ExistingPrestation): SpecPrestation {
  return {
    type: p.type === 'impot' ? 'Impôt' : 'Honoraire',
    designation: p.description,
    qty: p.quantite || 1,
    price: p.prix_unitaire || 0,
    total: p.montant || (p.quantite || 1) * (p.prix_unitaire || 0),
  };
}

function fallbackClient(
  name = 'Client',
  ville = '',
  phone = '',
  email?: string,
  type: ClientSpec['type'] = 'Personne morale',
): ClientSpec {
  return {
    id: Date.now(),
    type,
    name,
    niu: '',
    cdi: '',
    ville,
    quartier: '',
    phone,
    email,
    contact: name,
    civilite: 'M.',
    secteur: '',
    externalise: 'Non',
    statut: 'Actif',
    modePaiementIGS: 'annuel',
    modePaiementPSL: 'annuel',
    createdAt: new Date().toISOString(),
  };
}

function fallbackClientFromFacture(f: ExistingFacture): ClientSpec {
  // Si la facture n'embarque pas le client complet, on construit un ClientSpec minimal.
  const c = f.client;
  return fallbackClient(c?.nom || 'Client', c?.adresse || '', c?.telephone || '', c?.email);
}

export function factureToPrintData(
  facture: ExistingFacture,
  fullClient?: ExistingClient | null,
): FacturePrintData {
  const prestations = (facture.prestations || []).map(adaptPrestation);
  const totalImpots = facture.montant_impots ??
    prestations.filter((p) => p.type === 'Impôt').reduce((s, p) => s + p.total, 0);
  const totalHonoraires = facture.montant_honoraires ??
    prestations.filter((p) => p.type === 'Honoraire').reduce((s, p) => s + p.total, 0);
  const total = facture.montant || totalImpots + totalHonoraires;
  const client = fullClient ? adaptClient(fullClient) : fallbackClientFromFacture(facture);

  return {
    number: facture.numero || `N° ${facture.id?.slice(-4)}`,
    date: facture.date,
    client,
    prestations,
    totalImpots,
    totalHonoraires,
    total,
  };
}

// Note explicative dérivée d'une facture (note-app.html) : la « Note d'honoraire »
// en référence est la facture, dont on détaille la composition Impôts/Honoraires.
export function factureToNotePrintData(
  facture: ExistingFacture,
  fullClient?: ExistingClient | null,
): NotePrintData {
  const lignes = (facture.prestations || []).map((p) => ({
    type: p.type === 'impot' ? ('Impôt' as const) : ('Honoraire' as const),
    designation: p.description,
    montant: p.montant || (p.quantite || 1) * (p.prix_unitaire || 0),
  }));
  const totalImpots = facture.montant_impots ??
    lignes.filter((l) => l.type === 'Impôt').reduce((s, l) => s + l.montant, 0);
  const totalHonoraires = facture.montant_honoraires ??
    lignes.filter((l) => l.type === 'Honoraire').reduce((s, l) => s + l.montant, 0);
  const client = fullClient ? adaptClient(fullClient) : fallbackClientFromFacture(facture);

  return {
    number: facture.numero || `N° ${facture.id?.slice(-4)}`,
    date: facture.date,
    client,
    clientContact: client.contact,
    lignes,
    totalImpots,
    totalHonoraires,
  };
}

const DEVIS_STATUS_MAP: Record<string, PrintableDevisStatus> = {
  brouillon: 'brouillon',
  envoye: 'envoye',
  envoyé: 'envoye',
  accepte: 'accepte',
  accepté: 'accepte',
  refuse: 'refuse',
  refusé: 'refuse',
  converti: 'converti',
};

export function devisToPrintData(
  devis: ExistingDevis,
  fullClient?: ExistingClient | null,
): DevisPrintData {
  const prestations: SpecPrestation[] = (devis.prestations || []).map((p) => ({
    type: p.type === 'impot' ? 'Impôt' : 'Honoraire',
    designation: p.description,
    qty: p.quantite || 1,
    price: p.prix_unitaire || 0,
    total: p.montant || (p.quantite || 1) * (p.prix_unitaire || 0),
  }));
  const totalImpots = devis.montant_impots ?? prestations.filter((p) => p.type === 'Impôt').reduce((s, p) => s + p.total, 0);
  const totalHonoraires = devis.montant_honoraires ?? prestations.filter((p) => p.type === 'Honoraire').reduce((s, p) => s + p.total, 0);
  const total = devis.montant_total || totalImpots + totalHonoraires;
  const client = fullClient
    ? adaptClient(fullClient)
    : fallbackClient(devis.client?.nom || 'Client', devis.client?.adresse || '', devis.client?.telephone || '', devis.client?.email);
  return {
    number: devis.numero,
    date: devis.date,
    status: DEVIS_STATUS_MAP[devis.status] ?? 'brouillon',
    client,
    prestations,
    totalImpots,
    totalHonoraires,
    total,
  };
}


export function propositionToPrintData(
  proposition: ExistingProposition,
  fullClient?: ExistingClient | null,
): PropositionPrintData {
  const lignes = (proposition.lignes || []).map((ligne) => ({
    type: ligne.type === 'impot' ? 'Impôt' as const : 'Honoraire' as const,
    designation: ligne.designation,
    base: ligne.base_annuelle || 0,
    fraction: ligne.fraction || 0,
    amount: ligne.montant || 0,
  }));
  const totalImpots = proposition.total_impots ?? lignes.filter((l) => l.type === 'Impôt').reduce((s, l) => s + l.amount, 0);
  const totalHonoraires = proposition.total_honoraires ?? lignes.filter((l) => l.type === 'Honoraire').reduce((s, l) => s + l.amount, 0);
  const total = proposition.total || totalImpots + totalHonoraires;
  const client = fullClient
    ? adaptClient(fullClient)
    : fallbackClient(proposition.client?.nom || 'Client', proposition.client?.adresse || '', proposition.client?.telephone || '', proposition.client?.email);

  return {
    date: proposition.date,
    client,
    lignes,
    totalImpots,
    totalHonoraires,
    total,
    note: proposition.notes,
  };
}

const PAYMENT_MODE_MAP: Record<string, RecuPaymentMode> = {
  'espèces': 'Espèces',
  especes: 'Espèces',
  cash: 'Espèces',
  virement: 'Virement bancaire',
  orange_money: 'Mobile Money',
  mtn_money: 'Mobile Money',
  mobile_money: 'Mobile Money',
  cheque: 'Chèque',
  chèque: 'Chèque',
};

// Ventilation Impôts / Honoraires d'un paiement, comme le reçu de référence
// (recu-app.html) qui répartit selon les lignes payées de la facture source.
// Exporté pour que tous les rendus de reçu (aperçu fidèle, dialogue, PDF jsPDF)
// partagent exactement la même logique.
export function ventilerPaiement(
  paiement: ExistingPaiement,
  montant: number,
  facture?: ExistingFacture | null,
): { montantImpots: number; montantHonoraires: number } {
  if (!facture) return { montantImpots: 0, montantHonoraires: 0 };
  const prestations = facture.prestations || [];
  const payees = paiement.prestations_payees || [];

  // 1) Paiement partiel : ventilation exacte par type des prestations payées.
  if (payees.length > 0 && prestations.length > 0) {
    const byId = new Map(prestations.map((p) => [p.id, p]));
    let impots = 0;
    let honoraires = 0;
    let matched = false;
    for (const entry of payees) {
      const pres = byId.get(entry.id);
      if (!pres) continue;
      matched = true;
      const amount = entry.montant_modifie ?? pres.montant ?? 0;
      if (pres.type === 'impot') impots += amount;
      else honoraires += amount;
    }
    if (matched && impots + honoraires > 0) {
      return { montantImpots: Math.round(impots), montantHonoraires: Math.round(honoraires) };
    }
  }

  // 2) Paiement total (ou ids non concordants) : répartition au prorata de la
  //    composition Impôts / Honoraires de la facture.
  const factImpots = facture.montant_impots ??
    prestations.filter((p) => p.type === 'impot').reduce((s, p) => s + (p.montant || 0), 0);
  const factHonoraires = facture.montant_honoraires ??
    prestations.filter((p) => p.type === 'honoraire').reduce((s, p) => s + (p.montant || 0), 0);
  const factTotal = factImpots + factHonoraires;
  if (factTotal > 0) {
    const ratio = Math.min(1, montant / factTotal);
    return {
      montantImpots: Math.round(factImpots * ratio),
      montantHonoraires: Math.round(factHonoraires * ratio),
    };
  }
  return { montantImpots: 0, montantHonoraires: 0 };
}

export function paiementToRecuPrintData(
  paiement: ExistingPaiement,
  fullClient?: ExistingClient | null,
  facture?: ExistingFacture | null,
): RecuPrintData {
  const embeddedClient = typeof paiement.client === 'object' && paiement.client !== null ? paiement.client as ExistingClient : null;
  const client = fullClient
    ? adaptClient(fullClient)
    : embeddedClient
      ? adaptClient(embeddedClient)
      : fallbackClient(typeof paiement.client === 'string' ? paiement.client : 'Client');

  const montant = Number(paiement.montant) || 0;
  const { montantImpots, montantHonoraires } = ventilerPaiement(paiement, montant, facture);

  return {
    number: paiement.reference || `RECU-${paiement.id?.slice(-6)}`,
    date: paiement.date,
    client,
    montant,
    montantImpots,
    montantHonoraires,
    paymentMode: PAYMENT_MODE_MAP[paiement.mode] || 'Mobile Money',
    // Référence (recu-app.html) : motif pré-rempli « Règlement facture N° ... »
    motif: paiement.facture
      ? `Règlement facture ${paiement.facture}`
      : paiement.est_credit
        ? 'Avance / crédit client'
        : paiement.notes || 'Paiement client',
  };
}

const COURRIER_STATUS_MAP: Record<string, CourrierStatut> = {
  brouillon: 'brouillon',
  envoye: 'envoye',
  accuse: 'accuse',
  classe: 'classe',
};

export function courrierToPrintData(
  courrier: CourrierRecord,
  fullClient?: ExistingClient | null,
): CourrierPrintData {
  const civilite = fullClient
    ? getCiviliteLongue(fullClient.civilite as 'M.' | 'Mme' | undefined)
    : 'Monsieur';

  return {
    ref: courrier.reference,
    date: courrier.date_creation,
    destinataire: courrier.client_nom || courrier.template_titre || '',
    destinataireAdresse: '',
    civiliteDestinataire: civilite,
    objet: courrier.sujet,
    corps: courrier.contenu || courrier.message_personnalise || '',
    pj: '',
    statut: COURRIER_STATUS_MAP[courrier.statut] ?? 'brouillon',
  };
}
