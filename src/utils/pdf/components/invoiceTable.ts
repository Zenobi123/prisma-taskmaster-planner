
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture, Prestation } from '../types';

export const addPrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
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
  return (doc as any).lastAutoTable.finalY || 150;
};

// Add total section below the prestations table
export const addTotalSection = (doc: jsPDF, facture: PDFFacture, finalY: number) => {
  doc.setFillColor(240, 248, 240);
  doc.roundedRect(130, finalY + 10, 65, 20, 3, 3, 'F');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(44, 62, 80);
  doc.text("TOTAL:", 140, finalY + 20);
  
  doc.setFontSize(12);
  doc.text(`${facture.montant.toLocaleString('fr-FR')} XAF`, 165, finalY + 20);
  
  return finalY + 30; // Return the new Y position
};
