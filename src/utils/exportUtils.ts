
import { Event } from "@/types/event";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Formats a date to a string in local format
 */
export const formatDateToString = (date: Date | undefined): string => {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Exports events to a CSV file
 */
export const exportToCSV = (events: Event[], date: Date | undefined): void => {
  // CSV header
  const csvHeader = [
    "Titre",
    "Client",
    "Collaborateur",
    "Horaire",
    "Type",
  ].join(",");
  
  // Format event data for CSV
  const csvData = events.map(event => [
    `"${event.title.replace(/"/g, '""')}"`,
    `"${event.client.replace(/"/g, '""')}"`,
    `"${event.collaborateur.replace(/"/g, '""')}"`,
    `"${event.time}"`,
    `"${event.type === "mission" ? "Mission" : "Réunion"}"`
  ].join(",")).join("\n");
  
  // Combine header and data
  const csvContent = `${csvHeader}\n${csvData}`;
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link and trigger the download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `events-${date ? date.toISOString().split('T')[0] : 'all'}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports events to a PDF file with enhanced styling
 */
export const exportToPDF = (events: Event[], date: Date | undefined): void => {
  // Create a new PDF document with improved quality
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  // Set document properties
  doc.setProperties({
    title: `Planning ${date ? formatDateToString(date) : 'Complet'}`,
    subject: 'Planning d\'événements',
    author: 'PRISMA GESTION',
    keywords: 'planning, événements, pdf',
    creator: 'PRISMA GESTION'
  });
  
  // Set title with the date and enhanced styling
  const dateStr = formatDateToString(date);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text(`Planning du ${dateStr}`, 14, 20);
  
  // Add subtle title underline
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 22, 100, 22);
  
  // Prepare data for the table
  const tableData = events.map(event => [
    event.title,
    event.client,
    event.collaborateur,
    event.time,
    event.type === "mission" ? "Mission" : "Réunion"
  ]);
  
  // Define table header
  const tableHeader = [
    ["Titre", "Client", "Collaborateur", "Horaire", "Type"]
  ];
  
  // Add the table to the PDF with enhanced styling
  autoTable(doc, {
    startY: 30,
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [50, 98, 85],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineColor: [220, 230, 220],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248]
    },
    columnStyles: {
      0: { cellWidth: 50 },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 25, halign: 'center' }
    },
    margin: { top: 30, right: 15, bottom: 20, left: 15 }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 10);
    doc.text(`Page ${i}/${pageCount}`, 170, pageHeight - 10);
  }
  
  // Save the PDF
  doc.save(`events-${date ? date.toISOString().split('T')[0] : 'all'}.pdf`);
};

/**
 * Exports data to Excel format
 */
export const exportToExcel = (data: any[], filename: string): void => {
  // Create CSV content
  const headers = Object.keys(data[0] || {});
  const csvHeader = headers.join(",");
  
  // Format data for CSV
  const csvData = data.map(row => 
    headers.map(header => {
      const cell = row[header] !== undefined && row[header] !== null ? row[header] : '';
      // Wrap in quotes and escape quotes inside
      return `"${String(cell).replace(/"/g, '""')}"`;
    }).join(",")
  ).join("\n");
  
  // Combine header and data
  const csvContent = `${csvHeader}\n${csvData}`;
  
  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  // Create a download link and trigger the download
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exports data to PDF format with enhanced styling
 */
export const exportToPdf = (title: string, data: any[], filename: string): void => {
  // Create a new PDF document with improved quality
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });
  
  // Set document properties
  doc.setProperties({
    title: title,
    subject: 'Export de données',
    author: 'PRISMA GESTION',
    keywords: 'export, données, pdf',
    creator: 'PRISMA GESTION'
  });
  
  // Set title with enhanced styling
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 98, 85); // Dark green for consistency
  doc.text(title, 14, 20);
  
  // Add subtle title underline
  doc.setDrawColor(200, 220, 200);
  doc.setLineWidth(0.2);
  doc.line(14, 22, 60, 22);
  
  // Check if data exists
  if (data.length === 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text("Aucune donnée disponible", 14, 40);
    doc.save(`${filename}.pdf`);
    return;
  }
  
  // Prepare data for the table
  const tableData = data.map(row => Object.values(row));
  
  // Define table header
  const tableHeader = [Object.keys(data[0])];
  
  // Add the table to the PDF with enhanced styling
  autoTable(doc, {
    startY: 30,
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { 
      fillColor: [132, 169, 140],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      lineColor: [220, 230, 220],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248]
    },
    margin: { top: 30, right: 15, bottom: 20, left: 15 }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    doc.text('PRISMA GESTION - Gestion comptable et fiscale', 15, pageHeight - 10);
    doc.text(`Page ${i}/${pageCount}`, 170, pageHeight - 10);
  }
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};
