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
import type {
  DevisPrintData,
  DevisStatus as PrintableDevisStatus,
} from '@/components/printable/PrintableDevis';
import type { CourrierPrintData } from '@/components/printable/PrintableCourrier';
import type { PropositionPrintData } from '@/components/printable/PrintableProposition';
import type { RecuPrintData, RecuPaymentMode } from '@/components/printable/PrintableRecu';
import type { CourrierStatut } from '@/lib/spec/courrierTemplates';
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

export function paiementToRecuPrintData(
  paiement: ExistingPaiement,
  fullClient?: ExistingClient | null,
): RecuPrintData {
  const embeddedClient = typeof paiement.client === 'object' && paiement.client !== null ? paiement.client as ExistingClient : null;
  const client = fullClient
    ? adaptClient(fullClient)
    : embeddedClient
      ? adaptClient(embeddedClient)
      : fallbackClient(typeof paiement.client === 'string' ? paiement.client : 'Client');

  const montant = Number(paiement.montant) || 0;
  // La ventilation Impôts / Honoraires n'est pas dérivable d'un paiement seul
  // (PrestationPayee ne porte pas le type). On laisse 0/0 pour que le reçu
  // masque le bloc plutôt que d'attribuer tort le montant total aux impôts.
  const montantImpots = 0;
  const montantHonoraires = 0;

  return {
    number: paiement.reference || `RECU-${paiement.id?.slice(-6)}`,
    date: paiement.date,
    client,
    montant,
    montantImpots,
    montantHonoraires,
    paymentMode: PAYMENT_MODE_MAP[paiement.mode] || 'Mobile Money',
    motif: paiement.facture
      ? `Paiement de la facture ${paiement.facture}`
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
