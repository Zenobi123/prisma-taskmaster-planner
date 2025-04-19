
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDFFacture } from '../types';

export const generatePrestationsTable = (doc: jsPDF, facture: PDFFacture): number => {
  const tableColumn = ["Description", "Quantité", "Montant (XAF)", "Taux (%)", "Total (XAF)"];
  const tableRows = facture.prestations.map(prestation => {
    const quantite = prestation.quantite || 1;
    const taux = prestation.taux || 0;
    const montantHT = prestation.montant * quantite;
    const montantTTC = montantHT * (1 + taux / 100);
    
    return [
      prestation.description,
      quantite.toString(),
      prestation.montant.toLocaleString('fr-FR'),
      taux.toString(),
      Math.round(montantTTC).toLocaleString('fr-FR')
    ];
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 135,
    theme: 'grid',
    headStyles: {
      fillColor: [50, 98, 85],
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
  
  return (doc as any).lastAutoTable.finalY || 150;
};
