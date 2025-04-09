
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
  
  // Set custom margins: top: 2.5cm, left/right: 2cm exactly
  const margin = {
    top: 2.5,
    left: 2.0,
    right: 2.0,
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
      fillColor: [80, 120, 100], // Maintien de la couleur actuelle
      textColor: 255,
      fontSize: 9,
      cellPadding: 0.3,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
    },
    styles: {
      fontSize: 8,
      cellPadding: 0.3,
      overflow: 'visible', // Pour assurer que tout le contenu est visible
      lineWidth: 0.1,
    },
    margin: margin,
    columnStyles: {
      0: { cellWidth: 4.0, overflow: 'linebreak' }, // Nom - allow multiple lines
      1: { cellWidth: 2.8, overflow: 'visible' },   // NIU
      2: { cellWidth: 2.3, overflow: 'visible' },   // Centre
      3: { cellWidth: 2.3, overflow: 'visible' },   // Régime
      4: { cellWidth: 1.5, overflow: 'visible' },   // Soumis IGS
      5: { cellWidth: 2.0, overflow: 'visible' },   // Adhérent CGA
      6: { cellWidth: 1.7, overflow: 'visible' },   // Classe IGS
      7: { cellWidth: 4.5, overflow: 'linebreak' }, // Adresse - allow multiple lines
      8: { cellWidth: 2.5, overflow: 'visible' },   // Téléphone
    },
    didParseCell: function(data) {
      // For multi-line headers
      if (data.section === 'head') {
        data.cell.styles.valign = 'middle';
      }
    },
    // Répéter l'entête sur chaque page
    showHead: 'everyPage',
    // Assurer que les marges sont respectées
    willDrawCell: function(data) {
      // Ensure we're drawing within the specified margins
      if (data.cell.x < margin.left) {
        data.cell.x = margin.left;
      }
      if (data.cell.x + data.cell.width > pageWidth - margin.right) {
        data.cell.width = pageWidth - margin.right - data.cell.x;
      }
    },
    // Add alternating row colors for better readability
    bodyStyles: {
      lineColor: [200, 200, 200],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    // Make sure table fits into page width
    tableWidth: 'auto',
    // Ensure consistent line height
    rowPageBreak: 'auto',
  });
  
  // Save the PDF
  doc.save("liste-clients.pdf");
};

