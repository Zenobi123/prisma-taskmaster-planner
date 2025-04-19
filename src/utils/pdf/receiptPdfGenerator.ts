import jsPDF from 'jspdf';
import { Paiement } from '@/types/paiement';
import { SimplifiedClient } from './types';
import { DocumentService } from './services/DocumentService';

/**
 * Fonction pour générer un PDF de reçu de paiement de haute qualité
 * @param paiement - Données du paiement
 * @param download - Si true, télécharger le PDF; si false, ouvrir dans un nouvel onglet
 * @returns Soit un Blob (si download=true) soit null (si download=false)
 */
export const generateReceiptPDF = (paiement: any, download: boolean = false) => {
  try {
    // Créer un nouveau service de document
    const reference = paiement.reference || paiement.id;
    const docService = new DocumentService('reçu', 'Reçu de paiement', reference);
    const doc = docService.getDocument();
    
    // Ajouter l'en-tête standard
    docService.addStandardHeader(paiement.date);
    
    // Ajouter la section de détails du paiement
    const paymentDetailsY = addReceiptPaymentDetails(doc, paiement);
    
    // Ajouter la section du montant avec arrière-plan vert
    const amountSectionY = docService.addAmountSection(
      'MONTANT PAYÉ:',
      paiement.montant,
      paymentDetailsY,
      true
    );
    
    // Ajouter les notes si disponibles
    const notesY = paiement.notes 
      ? docService.addNotesSection(paiement.notes, amountSectionY)
      : amountSectionY;
    
    // Ajouter le texte légal
    addLegalText(doc, notesY + 10);
    
    // Ajouter le pied de page standard
    docService.addStandardFooter();
    
    // Générer le PDF
    return docService.generate(download);
  } catch (error) {
    console.error("Erreur lors de la génération du reçu PDF:", error);
    throw error;
  }
};

// Ajouter les détails du paiement
const addReceiptPaymentDetails = (doc: jsPDF, paiement: any): number => {
  // Créer une boîte pour les informations de paiement
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(15, 105, 180, 50, 3, 3, 'F');
  
  // Information client
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  
  // Colonnes d'information
  const leftLabels = ["Client:", "Référence:", "Date:", "Mode:"];
  const rightLabels = ["Facture associée:", "Réf. transaction:", "Type:"];
  
  const leftX = 25;
  const leftDataX = 60;
  const rightX = 115;
  const rightDataX = 170;
  const startY = 115;
  const lineHeight = 10;
  
  // Obtenir le nom du client - gérer différents formats possibles
  let clientName = "Client";
  
  if (paiement.client) {
    if (typeof paiement.client === 'object') {
      // Si c'est un objet, chercher le nom ou la raison sociale
      clientName = paiement.client.nom || paiement.client.raisonsociale || "Client";
    } else if (typeof paiement.client === 'string') {
      // Si c'est une chaîne de caractères
      clientName = paiement.client;
    }
  }
  
  // Ajouter les lignes d'information (côté gauche)
  for (let i = 0; i < leftLabels.length; i++) {
    const y = startY + (i * lineHeight);
    
    doc.setFont('helvetica', 'bold');
    doc.text(leftLabels[i], leftX, y);
    
    doc.setFont('helvetica', 'normal');
    
    // Données correspondantes
    let value = "";
    switch (i) {
      case 0: value = clientName; break;
      case 1: value = paiement.reference || paiement.id; break;
      case 2: value = formatPaymentDate(paiement.date); break;
      case 3: value = paiement.mode; break;
    }
    
    doc.text(value, leftDataX, y);
  }
  
  // Ajouter les lignes d'information (côté droit)
  for (let i = 0; i < rightLabels.length; i++) {
    const y = startY + (i * lineHeight);
    
    // Sauter si donnée non applicable
    let applicable = false;
    switch (i) {
      case 0: applicable = !!paiement.facture; break;
      case 1: applicable = !!paiement.reference_transaction; break;
      case 2: applicable = !!paiement.est_credit; break;
    }
    
    if (!applicable) continue;
    
    doc.setFont('helvetica', 'bold');
    doc.text(rightLabels[i], rightX, y);
    
    doc.setFont('helvetica', 'normal');
    
    // Données correspondantes
    let value = "";
    switch (i) {
      case 0: value = paiement.facture; break;
      case 1: value = paiement.reference_transaction; break;
      case 2: 
        doc.setTextColor(0, 128, 0);
        value = 'Crédit (Avance)'; 
        break;
    }
    
    doc.text(value, rightDataX, y);
    doc.setTextColor(60, 60, 60); // Réinitialiser la couleur
  }
  
  // Dessiner une ligne horizontale de séparation
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.2);
  doc.line(25, startY + (3.5 * lineHeight), 185, startY + (3.5 * lineHeight));
  
  return 155; // Retourner la position Y pour la section suivante
};

// Ajouter le texte légal et de confirmation au reçu
const addLegalText = (doc: jsPDF, yPosition: number) => {
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  
  const centerX = doc.internal.pageSize.width / 2;
  
  // Texte centré
  doc.text('Ce reçu confirme le traitement de votre paiement.', centerX, yPosition, {
    align: 'center'
  });
  doc.text('Document valable comme preuve de paiement.', centerX, yPosition + 5, {
    align: 'center'
  });
  
  return yPosition + 10; // Retourner la position Y après le texte légal
};

// Format date from any format to a localized string
const formatPaymentDate = (dateString: string | Date): string => {
  try {
    const date = dateString instanceof Date 
      ? dateString 
      : new Date(dateString);
    
    // Create a formatter based on the browser's locale
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    // If parsing fails, return the original string
    return String(dateString);
  }
};

// Fonction pour formatter les informations du client pour le reçu
export const formatClientForReceipt = (client: any): SimplifiedClient => {
  // Si le client est déjà au bon format, le renvoyer
  if (typeof client === 'object' && client.nom) {
    return createSimplifiedClient(client);
  }
  
  // Si le client est juste une chaîne (nom/ID), créer un objet client minimal
  if (typeof client === 'string') {
    return {
      id: '',
      nom: client,
      adresse: '',
      telephone: '',
      email: ''
    };
  }
  
  // Client par défaut vide
  return {
    id: '',
    nom: 'Client',
    adresse: '',
    telephone: '',
    email: ''
  };
};

// Fonction d'aide pour créer un client simplifié à partir d'un objet client complexe
const createSimplifiedClient = (client: any): SimplifiedClient => {
  return {
    id: client.id || '',
    nom: client.nom || client.raisonsociale || 'Client',
    adresse: typeof client.adresse === 'object' && client.adresse
      ? `${client.adresse.ville || ''}, ${client.adresse.quartier || ''}`
      : (client.adresse || ''),
    telephone: typeof client.contact === 'object' && client.contact
      ? client.contact.telephone || ''
      : (client.telephone || ''),
    email: typeof client.contact === 'object' && client.contact
      ? client.contact.email || ''
      : (client.email || '')
  };
};
