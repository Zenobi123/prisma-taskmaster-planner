
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
  
  // Set custom margins: exactly 2cm for left/right as requested
  const margin = {
    top: 2.0,
    left: 2.0,
    right: 2.0,
    bottom: 2.0
  };
  
  // Calculate available width considering margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const availableWidth = pageWidth - margin.left - margin.right;
  
  // Add centered title with improved styling
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  const title = "LISTE DES CLIENTS";
  const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
  const titleX = (pageWidth - titleWidth) / 2;
  doc.text(title, titleX, margin.top + 0.7);
  
  // Add date with improved styling
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const today = new Date().toLocaleDateString("fr-FR");
  doc.text(`Date d'impression: ${today}`, margin.left, margin.top + 1.4);
  
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
  
  // Adjusted column widths to ensure all content fits within page margins
  const columnWidths = {
    0: { cellWidth: 4.2, overflow: 'linebreak' }, // Nom/Raison sociale - allow multiple lines
    1: { cellWidth: 2.8, overflow: 'visible' },   // NIU
    2: { cellWidth: 2.3, overflow: 'visible' },   // Centre
    3: { cellWidth: 2.3, overflow: 'visible' },   // Régime fiscal
    4: { cellWidth: 1.5, overflow: 'visible' },   // Soumis IGS
    5: { cellWidth: 2.0, overflow: 'visible' },   // Adhérent CGA
    6: { cellWidth: 1.8, overflow: 'visible' },   // Classe IGS
    7: { cellWidth: 4.0, overflow: 'linebreak' }, // Adresse - allow multiple lines
    8: { cellWidth: 2.5, overflow: 'visible' },   // Téléphone
  };
  
  // Add the table to the PDF
  autoTable(doc, {
    startY: margin.top + 2.0, // Start table below title and date
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [80, 120, 100], // Keep existing header color
      textColor: 255,
      fontSize: 10, // Increased font size for better readability
      fontStyle: 'bold',
      cellPadding: 0.4,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
    },
    styles: {
      fontSize: 9, // Slightly increased font size for better readability
      cellPadding: 0.3,
      lineWidth: 0.1,
      overflow: 'ellipsize', // Ensure text doesn't overflow
      cellWidth: 'wrap',
      halign: 'left', // Left align content for better readability
    },
    margin: margin,
    columnStyles: columnWidths,
    didParseCell: function(data) {
      // Customize header cells
      if (data.section === 'head') {
        data.cell.styles.valign = 'middle';
        data.cell.styles.halign = 'center';
      }
      
      // Customize certain columns for better alignment
      if (data.section === 'body') {
        // Center align boolean columns (Soumis IGS, Adhérent CGA)
        if (data.column.index === 4 || data.column.index === 5) {
          data.cell.styles.halign = 'center';
        }
      }
    },
    // Ensure header repeats on every page
    showHead: 'everyPage',
    // Respect margins
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
    // Ensure consistent line height and page breaks
    rowPageBreak: 'auto',
    // Add table borders
    tableLineWidth: 0.2,
    tableLineColor: [80, 80, 80],
  });
  
  // Save the PDF with descriptive filename including date
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  doc.save(`liste-clients-${dateStr}.pdf`);
};
