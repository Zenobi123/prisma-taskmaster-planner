import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDataService } from './reportDataService';
import { formatMoney } from '@/lib/spec/fiscal';

type AutoTableDoc = jsPDF & {
  autoTable: (options: unknown) => void;
  lastAutoTable?: { finalY: number };
};

interface ClientNameShape {
  client_data?: { name?: string };
  client?: { nom?: string };
  clients?: { nom?: string; raisonsociale?: string };
  client_nom?: string;
}

interface DevisReportRow extends ClientNameShape {
  id?: string;
  numero?: string;
  date?: string;
  date_validite?: string;
  objet?: string;
  status?: string;
  montant_total?: number | string;
}

interface PropositionReportRow extends ClientNameShape {
  id?: string;
  numero?: string;
  date?: string;
  source_type?: string;
  source_numero?: string;
  total?: number | string;
  total_impots?: number | string;
  total_honoraires?: number | string;
  status?: string;
}

interface RecuReportRow extends ClientNameShape {
  id?: string;
  reference?: string;
  facture?: string;
  facture_id?: string;
  date?: string;
  mode?: string;
  montant?: number | string;
  solde_restant?: number | string;
  est_verifie?: boolean;
  est_credit?: boolean;
}

const generatedAt = () => new Date().toLocaleDateString('fr-FR');
const dateFr = (value?: string) => (value ? new Date(value).toLocaleDateString('fr-FR') : '—');
const asNumber = (value?: number | string) => Number(value) || 0;

const clientName = (row: ClientNameShape) =>
  row.client_data?.name ||
  row.client?.nom ||
  row.clients?.nom ||
  row.clients?.raisonsociale ||
  row.client_nom ||
  'Client inconnu';

const addPrismaHeader = (doc: jsPDF, title: string, subtitle: string) => {
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, 210, 26, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(title, 14, 13);
  doc.setFontSize(9);
  doc.text(subtitle, 14, 20);
  doc.setTextColor(17, 24, 39);
};

const addSummary = (doc: jsPDF, startY: number, rows: Array<[string, string]>) => {
  const tableDoc = doc as AutoTableDoc;
  tableDoc.autoTable({
    startY,
    head: [['Indicateur', 'Valeur']],
    body: rows,
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 9 },
  });
  return (tableDoc.lastAutoTable?.finalY ?? startY) + 10;
};

export const generateDevisDossierReport = async () => {
  const data = await ReportDataService.getBillingDossierData();
  const devis = data.devis as DevisReportRow[];
  const total = devis.reduce((sum, d) => sum + asNumber(d.montant_total), 0);
  const acceptes = devis.filter((d) => ['accepte', 'accepté'].includes(String(d.status).toLowerCase())).length;
  const convertis = devis.filter((d) => String(d.status).toLowerCase() === 'converti').length;

  const doc = new jsPDF();
  addPrismaHeader(doc, 'État des devis / proformas', `PRISMA GESTION — généré le ${generatedAt()}`);
  const y = addSummary(doc, 36, [
    ['Nombre de devis', String(devis.length)],
    ['Montant total proposé', formatMoney(total)],
    ['Devis acceptés', String(acceptes)],
    ['Devis convertis en factures', String(convertis)],
  ]);

  (doc as AutoTableDoc).autoTable({
    startY: y,
    head: [['N°', 'Client', 'Date', 'Validité', 'Objet', 'Statut', 'Total']],
    body: devis.map((d) => [
      d.numero || d.id,
      clientName(d),
      dateFr(d.date),
      dateFr(d.date_validite),
      d.objet || '—',
      d.status || '—',
      formatMoney(asNumber(d.montant_total)),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 7 },
  });

  doc.save(`etat-devis-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const generatePropositionsPaiementReport = async () => {
  const data = await ReportDataService.getBillingDossierData();
  const propositions = data.propositions as PropositionReportRow[];
  const total = propositions.reduce((sum, p) => sum + asNumber(p.total), 0);
  const totalImpots = propositions.reduce((sum, p) => sum + asNumber(p.total_impots), 0);
  const totalHonoraires = propositions.reduce((sum, p) => sum + asNumber(p.total_honoraires), 0);

  const doc = new jsPDF();
  addPrismaHeader(doc, 'État des propositions de paiement', `PRISMA GESTION — généré le ${generatedAt()}`);
  const y = addSummary(doc, 36, [
    ['Nombre de propositions', String(propositions.length)],
    ['Total impôts proposés', formatMoney(totalImpots)],
    ['Total honoraires proposés', formatMoney(totalHonoraires)],
    ['Total général proposé', formatMoney(total)],
  ]);

  (doc as AutoTableDoc).autoTable({
    startY: y,
    head: [['N°', 'Client', 'Date', 'Source', 'Impôts', 'Honoraires', 'Total', 'Statut']],
    body: propositions.map((p) => [
      p.numero || p.id,
      clientName(p),
      dateFr(p.date),
      p.source_numero || p.source_type || '—',
      formatMoney(asNumber(p.total_impots)),
      formatMoney(asNumber(p.total_honoraires)),
      formatMoney(asNumber(p.total)),
      p.status || '—',
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 7 },
  });

  doc.save(`etat-propositions-paiement-${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const generateRecusPaiementReport = async () => {
  const data = await ReportDataService.getBillingDossierData();
  const recus = data.recus as RecuReportRow[];
  const total = recus.reduce((sum, r) => sum + asNumber(r.montant), 0);
  const verifies = recus.filter((r) => r.est_verifie).length;
  const credits = recus.filter((r) => r.est_credit).length;

  const doc = new jsPDF();
  addPrismaHeader(doc, 'État des reçus de paiement', `PRISMA GESTION — généré le ${generatedAt()}`);
  const y = addSummary(doc, 36, [
    ['Nombre de reçus', String(recus.length)],
    ['Total encaissé', formatMoney(total)],
    ['Paiements vérifiés', String(verifies)],
    ['Avances / crédits client', String(credits)],
  ]);

  (doc as AutoTableDoc).autoTable({
    startY: y,
    head: [['Référence reçu', 'Client', 'Facture', 'Date', 'Mode', 'Montant', 'Solde restant']],
    body: recus.map((r) => [
      r.reference || r.id,
      clientName(r),
      r.facture || r.facture_id || (r.est_credit ? 'Crédit' : '—'),
      dateFr(r.date),
      r.mode || '—',
      formatMoney(asNumber(r.montant)),
      formatMoney(asNumber(r.solde_restant)),
    ]),
    theme: 'grid',
    headStyles: { fillColor: [30, 58, 138] },
    styles: { fontSize: 7 },
  });

  doc.save(`etat-recus-paiement-${new Date().toISOString().slice(0, 10)}.pdf`);
};
