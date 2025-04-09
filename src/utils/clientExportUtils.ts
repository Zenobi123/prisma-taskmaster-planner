
import { Client } from "@/types/client";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatMontant } from "./formatUtils";

/**
 * Extracts and formats fiscal data from a client
 */
const extractFiscalData = (client: Client) => {
  const igsData = client.igs || client.fiscal_data?.igs;
  
  return {
    soumisIGS: igsData?.soumisIGS ? "Oui" : "Non",
    adherentCGA: igsData?.adherentCGA ? "Oui" : "Non",
    classeIGS: igsData?.classeIGS || "Non définie",
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
    regime: fiscalData.regimeFiscal,
    soumisIGS: fiscalData.soumisIGS,
    adherentCGA: fiscalData.adherentCGA,
    classeIGS: fiscalData.classeIGS,
    adresse: `${client.adresse.ville}, ${client.adresse.quartier}`,
    contact: client.contact.telephone,
    email: client.contact.email,
    statut: client.statut
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
  
  // Set custom margins: top: 2.5cm, left/right: 2cm
  const margin = {
    top: 2.5,
    left: 2,
    right: 2,
    bottom: 2
  };
  
  // Calculate available width considering margins
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const availableWidth = pageWidth - margin.left - margin.right;
  
  // Add title
  doc.setFontSize(14);
  doc.text("Liste des Clients avec Informations Fiscales", margin.left, margin.top);
  
  // Add date
  doc.setFontSize(10);
  const today = new Date().toLocaleDateString("fr-FR");
  doc.text(`Date d'impression: ${today}`, margin.left, margin.top + 0.7);
  
  // Prepare data for the table
  const tableData = filteredClients.map(client => {
    const formattedClient = formatClientForExport(client);
    return [
      formattedClient.nom,
      formattedClient.niu,
      formattedClient.regime,
      formattedClient.soumisIGS,
      formattedClient.adherentCGA,
      formattedClient.classeIGS,
      formattedClient.adresse,
      formattedClient.contact,
      formattedClient.statut,
    ];
  });
  
  // Define table header
  const tableHeader = [
    [
      "Nom/Raison sociale",
      "NIU",
      "Régime fiscal",
      "Soumis IGS",
      "Adhérent CGA",
      "Classe IGS",
      "Adresse",
      "Téléphone",
      "Statut"
    ]
  ];
  
  // Add the table to the PDF with adjusted column widths for landscape
  // and ensure all data (except name and address) fits on one line
  autoTable(doc, {
    startY: margin.top + 1.2,
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [80, 120, 100], 
      textColor: 255,
      fontSize: 8,
      cellPadding: 0.2,
    },
    styles: {
      fontSize: 8,
      cellPadding: 0.2,
      overflow: 'ellipsize', // Truncate text with ... if it doesn't fit
      lineWidth: 0.1,
    },
    margin: {
      top: margin.top,
      left: margin.left,
      right: margin.right,
      bottom: margin.bottom
    },
    columnStyles: {
      0: { cellWidth: 4.5, overflow: 'linebreak' }, // Nom - allow multiple lines
      1: { cellWidth: 2.5, overflow: 'ellipsize' }, // NIU
      2: { cellWidth: 2.5, overflow: 'ellipsize' }, // Régime
      3: { cellWidth: 1.8, overflow: 'ellipsize' }, // Soumis IGS
      4: { cellWidth: 2.3, overflow: 'ellipsize' }, // Adhérent CGA
      5: { cellWidth: 2, overflow: 'ellipsize' }, // Classe IGS
      6: { cellWidth: 5, overflow: 'linebreak' },  // Adresse - allow multiple lines
      7: { cellWidth: 2.5, overflow: 'ellipsize' }, // Téléphone
      8: { cellWidth: 2, overflow: 'ellipsize' }, // Statut
    }
  });
  
  // Save the PDF
  doc.save("liste-clients-fiscal.pdf");
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
    "Régime fiscal",
    "Soumis IGS",
    "Adhérent CGA",
    "Classe IGS",
    "Adresse",
    "Téléphone",
    "Email",
    "Statut"
  ];
  
  // Convert to CSV format
  const csvHeader = headers.join(",");
  const csvRows = formattedClients.map(client => [
    `"${client.nom}"`,
    `"${client.niu}"`,
    `"${client.regime}"`,
    `"${client.soumisIGS}"`,
    `"${client.adherentCGA}"`,
    `"${client.classeIGS}"`,
    `"${client.adresse}"`,
    `"${client.contact}"`,
    `"${client.email}"`,
    `"${client.statut}"`
  ].join(","));
  
  // Combine header and rows
  const csvContent = [csvHeader, ...csvRows].join("\n");
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.href = url;
  link.setAttribute("download", "liste-clients-fiscal.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
