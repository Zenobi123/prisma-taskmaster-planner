
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture, Prestation } from '../types';

export const addPrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
  // Prepare table data with enhanced structure
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
  
  // Add table using autoTable with improved styling
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 135,
    theme: 'grid',
    headStyles: {
      fillColor: [50, 98, 85], // Dark green color with better saturation
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
      cellPadding: {top: 5, right: 5, bottom: 5, left: 5}
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [200, 220, 200],
      lineWidth: 0.2,
      font: 'helvetica',
      textColor: [40, 40, 40]
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [248, 250, 249]
    },
    margin: { left: 15, right: 15 },
    didDrawCell: (data) => {
      // Enhance cell borders
      if (data.column.index === 4 && data.row.index >= 0) {
        // Make total column slightly emphasized
        doc.setFillColor(245, 250, 245);
      }
    }
  });
  
  // Get the final Y position after table is drawn
  return (doc as any).lastAutoTable.finalY || 150;
};

// Add total section below the prestations table with enhanced styling
export const addTotalSection = (doc: jsPDF, facture: PDFFacture, finalY: number) => {
  // Enhanced styling for the total box
  doc.setFillColor(240, 250, 240);
  doc.roundedRect(130, finalY + 10, 65, 22, 3, 3, 'F');
  
  // Add border for better visibility
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.2);
  doc.roundedRect(130, finalY + 10, 65, 22, 3, 3, 'S');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85);
  doc.text("TOTAL:", 140, finalY + 22);
  
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text(`${facture.montant.toLocaleString('fr-FR')} XAF`, 165, finalY + 22);
  
  return finalY + 35; // Return the new Y position with more space
};
