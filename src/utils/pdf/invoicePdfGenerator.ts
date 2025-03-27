
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Facture } from '@/types/facture';
import { PDFFacture } from './types';
import { formatDateForDisplay, addCompanyLogo, addInvoiceInfoBox, addClientSection } from './pdfComponents';

// Function to generate the PDF document for invoices
export const generateInvoicePDF = (facture: PDFFacture, download?: boolean) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: `Facture ${facture.id}`,
      subject: 'Facture',
      author: 'PRISMA GESTION',
      keywords: 'facture, pdf, generate'
    });
    
    // Add company logo/header
    addCompanyLogo(doc);
    
    // Add invoice info box
    addInvoiceInfoBox(doc, 'FACTURE', facture.id, facture.date);
    
    // Add client information section
    addClientSection(doc, facture.client);
    
    // Add invoice details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    // Add payment details box
    doc.setFillColor(240, 248, 240); // Light green background
    doc.roundedRect(120, 90, 75, 30, 3, 3, 'F');
    
    doc.text(`Échéance: ${formatDateForDisplay(facture.echeance)}`, 130, 100);
    doc.text(`Montant total: ${facture.montant.toLocaleString('fr-FR')} XAF`, 130, 107);
    
    // Display payment status
    let statusText = "";
    let statusColor = [0, 0, 0]; // Default: black
    
    // Determine status based on status_paiement if available, otherwise fall back to legacy behavior
    const paymentStatus = facture.status_paiement || facture.status;
    
    if (paymentStatus === 'payée' || paymentStatus === 'payee') {
      statusText = "PAYÉE";
      statusColor = [0, 128, 0]; // Green
    } else if (paymentStatus === 'partiellement_payée' || paymentStatus === 'partiellement_payee') {
      statusText = "PARTIELLEMENT PAYÉE";
      statusColor = [255, 140, 0]; // Orange
    } else if (paymentStatus === 'en_retard') {
      statusText = "EN RETARD";
      statusColor = [220, 20, 60]; // Crimson
    } else {
      statusText = "EN ATTENTE";
      statusColor = [70, 130, 180]; // Steel Blue
    }
    
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`${statusText}`, 130, 115);
    doc.setTextColor(0, 0, 0); // Reset text color
    
    // Add horizontal separator line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(15, 130, 195, 130);
    
    // Prepare table data
    const tableColumn = ["Description", "Quantité", "Montant (XAF)", "Taux (%)", "Total (XAF)"];
    const tableRows: string[][] = [];
    
    facture.prestations.forEach(prestation => {
      const quantite = prestation.quantite || 1;
      const taux = prestation.taux || 0;
      const montantHT = prestation.montant * quantite;
      const montantTTC = montantHT * (1 + taux / 100);
      
      const row = [
        prestation.description,
        quantite.toString(),
        prestation.montant.toLocaleString('fr-FR'),
        taux.toString(),
        Math.round(montantTTC).toLocaleString('fr-FR')
      ];
      tableRows.push(row);
    });
    
    // Add table using autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 135,
      theme: 'grid',
      headStyles: {
        fillColor: [50, 98, 85], // Dark green color
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 10,
        halign: 'center'
      },
      styles: {
        fontSize: 9,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 30, halign: 'right' },
        3: { cellWidth: 25, halign: 'center' },
        4: { cellWidth: 30, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
      margin: { left: 15, right: 15 }
    });
    
    // Get the final Y position after table is drawn
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    
    // Add total section
    doc.setFillColor(240, 248, 240);
    doc.roundedRect(130, finalY + 10, 65, 20, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text("TOTAL:", 140, finalY + 20);
    
    doc.setFontSize(12);
    doc.text(`${facture.montant.toLocaleString('fr-FR')} XAF`, 165, finalY + 20);
    
    // Add payment information if available
    if (facture.paiements && facture.paiements.length > 0) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text("Paiements:", 15, finalY + 40);
      
      // Create a mini-table for payments
      const paymentTableHeaders = ["Date", "Référence", "Mode", "Montant (XAF)"];
      const paymentTableRows: string[][] = [];
      
      facture.paiements.forEach(paiement => {
        paymentTableRows.push([
          formatDateForDisplay(paiement.date),
          paiement.reference || "-",
          paiement.mode,
          paiement.montant.toLocaleString('fr-FR')
        ]);
      });
      
      autoTable(doc, {
        head: [paymentTableHeaders],
        body: paymentTableRows,
        startY: finalY + 45,
        theme: 'grid',
        headStyles: {
          fillColor: [132, 169, 140], // Medium green
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 9
        },
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          3: { halign: 'right' }
        },
        margin: { left: 15, right: 15 }
      });
      
      // Get position after payment table
      const paymentFinalY = (doc as any).lastAutoTable.finalY || (finalY + 60);
      
      // Display remaining amount due
      const remainingAmount = facture.montant - (facture.montant_paye || 0);
      
      doc.setFillColor(remainingAmount > 0 ? [255, 245, 240] : [240, 255, 240]);
      doc.roundedRect(130, paymentFinalY + 10, 65, 20, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(remainingAmount > 0 ? [200, 60, 40] : [40, 160, 60]);
      doc.text("Montant restant dû:", 140, paymentFinalY + 20);
      
      doc.setFontSize(11);
      doc.text(`${remainingAmount.toLocaleString('fr-FR')} XAF`, 165, paymentFinalY + 25);
    } else {
      // If no payments, display the total amount due
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(`Montant à payer: ${facture.montant.toLocaleString('fr-FR')} XAF`, 15, finalY + 40);
    }
    
    // Add notes if available
    if (facture.notes) {
      const noteY = finalY + (facture.paiements && facture.paiements.length > 0 ? 90 : 50);
      
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(15, noteY, 180, 20, 3, 3, 'F');
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(60, 60, 60);
      doc.text("Notes:", 20, noteY + 7);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      
      // Handle multiline notes
      const splitNotes = doc.splitTextToSize(facture.notes, 160);
      doc.text(splitNotes, 20, noteY + 14);
    }
    
    // Add footer with watermark
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const pageHeight = doc.internal.pageSize.height;
      
      // Bottom footer
      doc.setFont('helvetica', 'normal');
      doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 15);
      
      // Right side footer with page numbers
      doc.text(`Facture ${facture.id} - Page ${i}/${pageCount}`, 170, pageHeight - 15);
      
      // Add date generated
      const today = new Date();
      const generateDate = format(today, 'dd/MM/yyyy à HH:mm', { locale: fr });
      doc.text(`Document généré le ${generateDate}`, 15, pageHeight - 10);
      
      // Add watermark diagonal text in very light color
      doc.saveGraphicsState();
      // Fix for TypeScript error - translate and rotate methods
      (doc as any).translate(pageHeight/2, 100);
      (doc as any).rotate(-45);
      doc.text('PRISMA GESTION', 0, 0, { align: 'center' });
      doc.restoreGraphicsState();
    }
    
    if (download) {
      // Download the PDF
      doc.save(`Facture_${facture.id}.pdf`);
      return doc.output('blob');
    } else {
      // Open the PDF in a new tab
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    throw error;
  }
};
