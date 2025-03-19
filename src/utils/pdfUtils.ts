
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Prestation {
  description: string;
  quantite?: number;
  montant: number;
  taux?: number;
}

interface Paiement {
  date: string;
  montant: number;
  mode: string;
}

interface Client {
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}

export interface Facture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: string;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
}

// Function to generate the PDF document
export const generatePDF = (facture: Facture, download?: boolean) => {
  const doc = new jsPDF();

  // Set document properties
  doc.setProperties({
    title: `Facture ${facture.id}`,
    subject: 'Facture',
    author: 'PRISMA GESTION',
    keywords: 'facture, pdf, generate'
  });

  // Add header
  doc.setFontSize(20);
  doc.text(`Facture ${facture.id}`, 10, 10);

  // Add client information
  doc.setFontSize(12);
  doc.text(`Client: ${facture.client.nom}`, 10, 20);
  doc.text(`Adresse: ${facture.client.adresse}`, 10, 26);
  doc.text(`Téléphone: ${facture.client.telephone}`, 10, 32);
  doc.text(`Email: ${facture.client.email}`, 10, 38);

  // Add invoice details
  doc.text(`Date: ${facture.date}`, 140, 20);
  doc.text(`Échéance: ${facture.echeance}`, 140, 26);
  doc.text(`Montant total: ${facture.montant} XAF`, 140, 32);
  doc.text(`Statut: ${facture.status}`, 140, 38);

  // Prepare table data
  const tableColumn = ["Description", "Quantité", "Montant", "Taux", "Total"];
  const tableRows: string[][] = [];

  facture.prestations.forEach(prestation => {
    const total = (prestation.montant * (prestation.quantite || 1)) * (1 + (prestation.taux || 0) / 100);
    const row = [
      prestation.description,
      (prestation.quantite || 1).toString(),
      prestation.montant.toString(),
      (prestation.taux || 0).toString(),
      total.toString()
    ];
    tableRows.push(row);
  });

  // Add table
  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 50,
  });

  // Add notes if available
  if (facture.notes) {
    doc.setFontSize(10);
    const tableHeight = (doc as any).previousAutoTable.finalY;
    doc.text(`Notes: ${facture.notes}`, 10, tableHeight + 10);
  }

  // Add payment information if available
  if (facture.paiements && facture.paiements.length > 0) {
    doc.setFontSize(12);
    const tableHeight = (doc as any).previousAutoTable.finalY;
    doc.text("Paiements:", 10, tableHeight + 20);

    let paymentY = tableHeight + 26;
    facture.paiements.forEach(paiement => {
      doc.setFontSize(10);
      doc.text(`- Date: ${paiement.date}, Montant: ${paiement.montant} XAF, Mode: ${paiement.mode}`, 10, paymentY);
      paymentY += 6;
    });
    
    // Display remaining amount due
    const remainingAmount = facture.montant - (facture.montant_paye || 0);
    doc.setFontSize(12);
    doc.text(`Montant restant dû: ${remainingAmount} XAF`, 140, paymentY);
  } else {
    // If no payments, display the total amount due
    doc.setFontSize(12);
    const tableHeight = (doc as any).previousAutoTable.finalY;
    doc.text(`Montant restant dû: ${facture.montant} XAF`, 140, tableHeight + 20);
  }

  // Set status text based on facture.status
  let statusText = "";
  if (facture.status === 'payée') {
    statusText = "Facture payée";
  } else if (facture.status === 'en_attente' || facture.status === 'envoyée') {
    statusText = "Facture en attente de paiement";
  } else if (facture.status === 'partiellement_payée') {
    statusText = "Facture partiellement payée";
  }

  // Add status text to the PDF
  if (statusText) {
    doc.setFontSize(14);
    // Get the Y position of the last content added to the document
    const lastContentY = (doc as any).previousAutoTable
      ? (doc as any).previousAutoTable.finalY + 30
      : 50 + tableRows.length * 10 + 30; // Approximate position if no table

    doc.text(statusText, 10, lastContentY);
  }

  if (download) {
    // Download the PDF
    doc.save(`Facture_${facture.id}.pdf`);
    return doc.output('blob');
  } else {
    // Open the PDF in a new tab
    window.open(doc.output('bloburl'), '_blank');
    return null;
  }
};
