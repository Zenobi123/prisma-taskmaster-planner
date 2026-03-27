
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Client } from '@/types/client';

const getFormeJuridiqueLabel = (forme: string) => {
  const map: Record<string, string> = {
    sa: "Société Anonyme (SA)",
    sarl: "Société à Responsabilité Limitée (SARL)",
    sas: "Société par Actions Simplifiée (SAS)",
    snc: "Société en Nom Collectif (SNC)",
    association: "Association",
    gie: "Groupement d'Intérêt Économique (GIE)",
    autre: "Autre",
  };
  return map[forme] || forme;
};

const getRegimeFiscalLabel = (regime: string) => {
  const map: Record<string, string> = {
    reel: "Régime Réel",
    igs: "Impôt Général Synthétique (IGS)",
    non_professionnel: "Non Professionnel",
  };
  return map[regime] || regime;
};

export const generateClientFichePDF = (client: Client) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const clientName = client.type === 'morale' 
    ? (client.raisonsociale || client.nom || 'Client') 
    : (client.nom || 'Client');

  // Header bar
  doc.setFillColor(41, 128, 185);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('FICHE CLIENT', pageWidth / 2, 15, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(clientName, pageWidth / 2, 25, { align: 'center' });

  // Date d'édition
  doc.setFontSize(8);
  doc.setTextColor(200, 220, 240);
  doc.text(`Éditée le ${new Date().toLocaleDateString('fr-FR')}`, pageWidth / 2, 32, { align: 'center' });

  let currentY = 45;

  // === Section 1: Informations Générales ===
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('INFORMATIONS GÉNÉRALES', 14, currentY);
  currentY += 3;

  const generalInfo: string[][] = [];
  
  generalInfo.push(['Type de client', client.type === 'physique' ? 'Personne Physique' : 'Personne Morale']);
  generalInfo.push(['Statut', client.statut === 'actif' ? 'Actif' : client.statut === 'inactif' ? 'Inactif' : 'Archivé']);

  if (client.type === 'physique') {
    if (client.nom) generalInfo.push(['Nom', client.nom]);
    if (client.sexe) generalInfo.push(['Sexe', client.sexe === 'homme' ? 'Homme' : 'Femme']);
    if (client.etatcivil) generalInfo.push(['État civil', client.etatcivil.charAt(0).toUpperCase() + client.etatcivil.slice(1)]);
  } else {
    if (client.raisonsociale) generalInfo.push(['Raison sociale', client.raisonsociale]);
    if (client.sigle) generalInfo.push(['Sigle', client.sigle]);
    if (client.nomdirigeant) generalInfo.push(['Dirigeant', client.nomdirigeant]);
    if (client.formejuridique) generalInfo.push(['Forme juridique', getFormeJuridiqueLabel(client.formejuridique)]);
    if (client.datecreation) generalInfo.push(['Date de création', new Date(client.datecreation).toLocaleDateString('fr-FR')]);
    if (client.lieucreation) generalInfo.push(['Lieu de création', client.lieucreation]);
    if (client.nomcommercial) generalInfo.push(['Nom commercial', client.nomcommercial]);
    if (client.numerorccm) generalInfo.push(['N° RCCM', client.numerorccm]);
  }

  generalInfo.push(['NIU', client.niu || 'Non renseigné']);
  generalInfo.push(['Régime fiscal', getRegimeFiscalLabel(client.regimefiscal)]);
  generalInfo.push(['Centre de rattachement', client.centrerattachement || 'Non renseigné']);
  generalInfo.push(['Secteur d\'activité', client.secteuractivite || 'Non renseigné']);
  if (client.numerocnps) generalInfo.push(['N° CNPS', client.numerocnps]);
  generalInfo.push(['Gestion externalisée', client.gestionexternalisee ? 'Oui' : 'Non']);

  autoTable(doc, {
    body: generalInfo,
    startY: currentY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: [60, 60, 60] },
      1: { cellWidth: 120 }
    },
    alternateRowStyles: { fillColor: [240, 248, 255] },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // === Section 2: Adresse ===
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('ADRESSE', 14, currentY);
  currentY += 3;

  const addressInfo: string[][] = [];
  if (client.adresse) {
    addressInfo.push(['Ville', client.adresse.ville || 'Non renseigné']);
    addressInfo.push(['Quartier', client.adresse.quartier || 'Non renseigné']);
    addressInfo.push(['Lieu-dit', client.adresse.lieuDit || 'Non renseigné']);
  }

  autoTable(doc, {
    body: addressInfo,
    startY: currentY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: [60, 60, 60] },
      1: { cellWidth: 120 }
    },
    alternateRowStyles: { fillColor: [240, 255, 240] },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // === Section 3: Contact ===
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('CONTACT', 14, currentY);
  currentY += 3;

  const contactInfo: string[][] = [];
  if (client.contact) {
    contactInfo.push(['Téléphone', client.contact.telephone || 'Non renseigné']);
    contactInfo.push(['Email', client.contact.email || 'Non renseigné']);
  }

  autoTable(doc, {
    body: contactInfo,
    startY: currentY,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55, textColor: [60, 60, 60] },
      1: { cellWidth: 120 }
    },
    alternateRowStyles: { fillColor: [255, 248, 240] },
    margin: { left: 14, right: 14 },
  });

  currentY = (doc as any).lastAutoTable.finalY + 10;

  // === Section 4: Situation Immobilière (si renseignée) ===
  if (client.situationimmobiliere) {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('SITUATION IMMOBILIÈRE', 14, currentY);
    currentY += 3;

    const immoInfo: string[][] = [];
    const formatMontant = (m: number) => new Intl.NumberFormat('fr-FR').format(m) + ' F CFA';
    
    immoInfo.push(['Type', client.situationimmobiliere.type === 'proprietaire' ? 'Propriétaire' : 'Locataire']);
    if (client.situationimmobiliere.type === 'proprietaire' && client.situationimmobiliere.valeur) {
      immoInfo.push(['Valeur du bien', formatMontant(client.situationimmobiliere.valeur)]);
    }
    if (client.situationimmobiliere.type === 'locataire' && client.situationimmobiliere.loyer) {
      immoInfo.push(['Loyer mensuel', formatMontant(client.situationimmobiliere.loyer)]);
    }

    autoTable(doc, {
      body: immoInfo,
      startY: currentY,
      theme: 'striped',
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 55, textColor: [60, 60, 60] },
        1: { cellWidth: 120 }
      },
      alternateRowStyles: { fillColor: [248, 240, 255] },
      margin: { left: 14, right: 14 },
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;
  }

  // === Section 5: Interactions ===
  if (client.interactions && client.interactions.length > 0) {
    // Check if we need a new page
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('HISTORIQUE DES INTERACTIONS', 14, currentY);
    currentY += 3;

    const interactionsData = client.interactions.map(i => [
      new Date(i.date).toLocaleDateString('fr-FR'),
      i.description
    ]);

    autoTable(doc, {
      head: [['Date', 'Description']],
      body: interactionsData,
      startY: currentY,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 30 },
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i}/${pageCount} — Fiche client générée automatiquement`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save
  const sanitizedName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`fiche_client_${sanitizedName}.pdf`);
};
