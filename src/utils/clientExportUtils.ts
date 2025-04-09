
import { Client } from "@/types/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMontant } from "./formatUtils";

/**
 * Extracts and formats fiscal data from a client
 */
const extractFiscalData = (client: Client) => {
  const igsData = client.igs || client.fiscal_data?.igs;
  
  let classeIGS = "Non définie";
  if (igsData?.classeIGS) {
    // Format class display as "Classe X" (e.g. "Classe 8" instead of "classe8")
    const classNumber = igsData.classeIGS.replace("classe", "");
    classeIGS = `Classe ${classNumber}`;
  }
  
  return {
    soumisIGS: igsData?.soumisIGS ? "Oui" : "Non",
    adherentCGA: igsData?.adherentCGA ? "Oui" : "Non",
    classeIGS: classeIGS,
    regimeFiscal: client.regimefiscal || "Non défini"
  };
};

/**
 * Formats client data for export
 */
const formatClientForExport = (client: Client) => {
  const fiscalData = extractFiscalData(client);
  const name = client.type === "physique" ? client.nom : client.raisonsociale;
  
  return {
    nom: name || "",
    niu: client.niu,
    centre: client.centrerattachement || "",
    regime: fiscalData.regimeFiscal,
    soumisIGS: fiscalData.soumisIGS,
    adherentCGA: fiscalData.adherentCGA,
    classeIGS: fiscalData.classeIGS,
    adresse: `${client.adresse.ville}, ${client.adresse.quartier}`,
    contact: client.contact.telephone,
    email: client.contact.email
  };
};

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
  
  // Set custom margins: top: 2.5cm, left/right: 1cm
  const margin = {
    top: 2.5,
    left: 1,
    right: 1,
    bottom: 2
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
      overflow: 'ellipsize', // Default overflow setting
      lineWidth: 0.1,
    },
    margin: margin,
    columnStyles: {
      0: { cellWidth: 4.5, overflow: 'linebreak' }, // Nom - allow multiple lines
      1: { cellWidth: 3.0, overflow: 'visible' },   // NIU - show full content
      2: { cellWidth: 2.5, overflow: 'ellipsize' }, // Centre
      3: { cellWidth: 2.5, overflow: 'ellipsize' }, // Régime
      4: { cellWidth: 1.6, overflow: 'ellipsize' }, // Soumis IGS
      5: { cellWidth: 2.0, overflow: 'ellipsize' }, // Adhérent CGA
      6: { cellWidth: 1.7, overflow: 'ellipsize' }, // Classe IGS
      7: { cellWidth: 5.0, overflow: 'linebreak' }, // Adresse - allow multiple lines
      8: { cellWidth: 2.8, overflow: 'ellipsize' }, // Téléphone
    },
    didParseCell: function(data) {
      // For multi-line headers
      if (data.section === 'head') {
        data.cell.styles.valign = 'middle';
      }
    }
  });
  
  // Save the PDF
  doc.save("liste-clients.pdf");
};

/**
 * Exports clients list to Excel (CSV)
 */
export const exportClientsToExcel = (clients: Client[], includeArchived: boolean = false): void => {
  // Filter clients based on archive status if needed
  const filteredClients = includeArchived 
    ? clients 
    : clients.filter(client => client.statut !== "archive");

  // Format clients data for CSV
  const formattedClients = filteredClients.map(formatClientForExport);
  
  // Create CSV header
  const headers = [
    "Nom/Raison sociale",
    "NIU", 
    "Centre",
    "Régime fiscal",
    "Soumis IGS",
    "Adhérent CGA",
    "Classe IGS",
    "Adresse",
    "Téléphone",
    "Email"
  ];
  
  // Convert to CSV format
  const csvHeader = headers.join(",");
  const csvRows = formattedClients.map(client => [
    `"${client.nom}"`,
    `"${client.niu}"`,
    `"${client.centre}"`,
    `"${client.regime}"`,
    `"${client.soumisIGS}"`,
    `"${client.adherentCGA}"`,
    `"${client.classeIGS}"`,
    `"${client.adresse}"`,
    `"${client.contact}"`,
    `"${client.email}"`
  ].join(","));
  
  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join("\n");
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "liste-clients.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
