
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
  
  // Set custom margins: 2cm for left/right, 1.5cm for top/bottom
  const margin = {
    top: 1.5,
    left: 2.0,
    right: 2.0,
    bottom: 1.5
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
  const columnStyles = {
    0: { cellWidth: 4.2 }, // Nom/Raison sociale
    1: { cellWidth: 2.8 }, // NIU
    2: { cellWidth: 2.3 }, // Centre
    3: { cellWidth: 2.3 }, // Régime fiscal
    4: { cellWidth: 1.5 }, // Soumis IGS
    5: { cellWidth: 2.0 }, // Adhérent CGA
    6: { cellWidth: 1.8 }, // Classe IGS
    7: { cellWidth: 4.0 }, // Adresse
    8: { cellWidth: 2.5 }, // Téléphone
  };
  
  // Add the table to the PDF
  autoTable(doc, {
    startY: margin.top + 2.0, // Start table below title and date
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [80, 120, 100], // Keeping the existing header color
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold',
      cellPadding: 0.4,
      halign: 'center',
      valign: 'middle',
      lineWidth: 0.1,
    },
    styles: {
      fontSize: 10, // Exactly 10pt as specified
      cellPadding: 0.3,
      lineWidth: 0.1,
      overflow: 'linebreak',
      cellWidth: 'wrap',
      halign: 'left', // Left align content for better readability
      font: 'helvetica', // Sans-serif font
    },
    margin: margin,
    columnStyles: columnStyles,
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
    // Apply specific overflow settings to each column
    willDrawCell: function(data) {
      // Apply column-specific overflow handling
      if (data.section === 'body') {
        // Apply linebreak for columns that might have lots of text
        if (data.column.index === 0 || data.column.index === 7) {
          data.cell.styles.overflow = 'linebreak';
        } else {
          // For other columns, use ellipsize to prevent overflow
          data.cell.styles.overflow = 'ellipsize';
        }
      }
    },
    // Add alternating row colors for better readability (zébrage)
    bodyStyles: {
      lineColor: [200, 200, 200],
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Slightly lighter for better contrast
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
