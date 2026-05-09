// Adapters : convertit les types existants (src/types/*) vers les types Spec
// utilisés par les templates imprimables.

import type { Facture as ExistingFacture, Prestation as ExistingPrestation } from '@/types/facture';
import type { Devis as ExistingDevis } from '@/types/devis';
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

function fallbackClientFromFacture(f: ExistingFacture): ClientSpec {
  // Si la facture n'embarque pas le client complet, on construit un ClientSpec minimal.
  const c = f.client;
  return {
    id: Date.now(),
    type: 'Personne morale',
    name: c?.nom || 'Client',
    niu: '',
    cdi: '',
    ville: c?.adresse || '',
    quartier: '',
    phone: c?.telephone || '',
    email: c?.email,
    contact: c?.nom,
    civilite: 'M.',
    secteur: '',
    externalise: 'Non',
    statut: 'Actif',
    modePaiementIGS: 'annuel',
    modePaiementPSL: 'annuel',
    createdAt: new Date().toISOString(),
  };
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
    : {
        id: Date.now(),
        type: 'Personne morale' as const,
        name: devis.client?.nom || 'Client',
        niu: '',
        cdi: '',
        ville: devis.client?.adresse || '',
        quartier: '',
        phone: devis.client?.telephone || '',
        civilite: 'M.' as const,
        secteur: '',
        externalise: 'Non' as const,
        statut: 'Actif' as const,
        modePaiementIGS: 'annuel' as const,
        modePaiementPSL: 'annuel' as const,
        createdAt: new Date().toISOString(),
      };
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
