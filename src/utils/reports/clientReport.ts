
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClientFinancialDetails } from '@/types/clientFinancial';
import { formatDateToString } from '../exportUtils';
import { DocumentService } from '../pdf/services/DocumentService';

/**
 * Generates a detailed client financial report in PDF format.
 * @param clientDetails - The financial details of the client.
 */
export const generateClientReport = (clientDetails: ClientFinancialDetails): void => {
  try {
    if (!clientDetails.client) {
      console.error("Client details are missing.");
      alert("Impossible de générer le rapport : informations sur le client manquantes.");
      return;
    }

    // Use DocumentService for consistent styling and structure
    const docService = new DocumentService();
    const doc = docService.getDocument();

    // Add standard header and footer
    docService.addStandardHeader('Situation Financière Client');
    docService.addStandardFooter();

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Situation Financière de ${clientDetails.client.nom}`, 15, 60);

    // Client Information
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`ID Client: ${clientDetails.client.id}`, 15, 70);
    doc.text(`Solde Disponible: ${clientDetails.solde_disponible} XAF`, 15, 75);

    // Start Y position for tables
    let startY = 85;

    // Function to add tables with dynamic headers and data
    const addTable = (title: string, headers: string[], data: any[], yPos: number): number => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 15, yPos);

      autoTable(doc, {
        startY: yPos + 5,
        head: [headers],
        body: data,
        theme: 'grid',
        headStyles: { 
          fillColor: [60, 98, 85], 
          textColor: 255,
          fontStyle: 'bold'
        },
        styles: {
          fontSize: 10,
          cellPadding: 5,
        },
        alternateRowStyles: {
          fillColor: [248, 250, 249]
        },
      });

      return (doc as any).lastAutoTable.finalY + 10;
    };

    // Format invoices for table
    const formattedInvoices = clientDetails.factures.map(invoice => [
      invoice.id,
      formatDateToString(new Date(invoice.date)),
      invoice.montant,
      invoice.montant_paye,
      invoice.montant_restant,
      invoice.status,
      invoice.status_paiement,
      formatDateToString(new Date(invoice.echeance))
    ]);

    // Add invoices table
    startY = addTable(
      "Factures",
      ["ID", "Date", "Montant", "Payé", "Restant", "Statut", "Statut Paiement", "Échéance"],
      formattedInvoices,
      startY
    );

    // Format payments for table
    const formattedPayments = clientDetails.paiements.map(payment => [
      payment.id,
      formatDateToString(new Date(payment.date)),
      payment.montant,
      payment.mode,
      payment.reference,
      payment.facture_id || 'N/A',
      payment.est_credit ? 'Oui' : 'Non'
    ]);

    // Add payments table
    startY = addTable(
      "Paiements",
      ["ID", "Date", "Montant", "Mode", "Référence", "Facture ID", "Crédit"],
      formattedPayments,
      startY
    );

    // Generate and download the PDF
    docService.save('rapport_client.pdf');

  } catch (error) {
    console.error("Error generating client report:", error);
    alert("Erreur lors de la génération du rapport client.");
  }
};
