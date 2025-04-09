
import { Client } from "@/types/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatClientForExport } from "./clientDataFormatter";

/**
 * Exports clients list to PDF
 */
export const exportClientsToPDF = (clients: Client[], includeArchived: boolean = false): void => {
  // Filter clients based on archive status if needed
  const filteredClients = includeArchived 
    ? clients 
    : clients.filter(client => client.statut !== "archive");
  
  // Create a new PDF document in landscape orientation
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'cm',
    format: 'a4'
  });
  
  // Set custom margins: top: 2.5cm, left/right: 1cm exactly
  const margin = {
    top: 2.5,
    left: 1.0,
    right: 1.0,
    bottom: 2.0
  };
  
  // Calculate available width considering margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const availableWidth = pageWidth - margin.left - margin.right;
  
  // Add centered title
  doc.setFontSize(16);
  const title = "LISTE DES CLIENTS";
  const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, margin.top - 0.5);
  
  // Add date
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString("fr-FR");
  doc.text(`Date d'impression: ${today}`, margin.left, margin.top);
  
  // Prepare data for the table
  const tableData = filteredClients.map(client => {
    const formattedClient = formatClientForExport(client);
    return [
      formattedClient.nom,
      formattedClient.niu,
      formattedClient.centre,
      formattedClient.regime,
      formattedClient.soumisIGS,
      formattedClient.adherentCGA,
      formattedClient.classeIGS,
      formattedClient.adresse,
      formattedClient.contact,
    ];
  });
  
  // Define table header with multi-line support
  const tableHeader = [
    [
      "Nom/Raison\nsociale",
      "NIU",
      "Centre",
      "Régime\nfiscal",
      "Soumis\nIGS",
      "Adhérent\nCGA",
      "Classe\nIGS",
      "Adresse",
      "Téléphone"
    ]
  ];
  
  // Add the table to the PDF with adjusted column widths for landscape
  autoTable(doc, {
    startY: margin.top + 0.7,
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [80, 120, 100], 
      textColor: 255,
      fontSize: 8,
      cellPadding: 0.2,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
    },
    styles: {
      fontSize: 8,
      cellPadding: 0.2,
      overflow: 'visible', // Change to visible to ensure all content is displayed
      lineWidth: 0.1,
    },
    margin: margin,
    columnStyles: {
      0: { cellWidth: 4.5, overflow: 'linebreak' }, // Nom - allow multiple lines
      1: { cellWidth: 3.0, overflow: 'visible' },   // NIU - show full content
      2: { cellWidth: 2.5, overflow: 'visible' },   // Centre - ensure all content is shown
      3: { cellWidth: 2.5, overflow: 'visible' },   // Régime - ensure all content is shown
      4: { cellWidth: 1.6, overflow: 'visible' },   // Soumis IGS - ensure all content is shown
      5: { cellWidth: 2.0, overflow: 'visible' },   // Adhérent CGA - ensure all content is shown
      6: { cellWidth: 1.7, overflow: 'visible' },   // Classe IGS - ensure all content is shown
      7: { cellWidth: 5.0, overflow: 'linebreak' }, // Adresse - allow multiple lines
      8: { cellWidth: 2.8, overflow: 'visible' },   // Téléphone - ensure all content is shown
    },
    didParseCell: function(data) {
      // For multi-line headers
      if (data.section === 'head') {
        data.cell.styles.valign = 'middle';
      }
    },
    // Add willDrawCell hook to ensure margins are respected
    willDrawCell: function(data) {
      // Ensure we're drawing within the specified margins
      if (data.cell.x < margin.left) {
        data.cell.x = margin.left;
      }
      if (data.cell.x + data.cell.width > pageWidth - margin.right) {
        data.cell.width = pageWidth - margin.right - data.cell.x;
      }
    }
  });
  
  // Save the PDF
  doc.save("liste-clients.pdf");
};
