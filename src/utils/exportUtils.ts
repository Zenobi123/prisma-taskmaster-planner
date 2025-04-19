import { Event } from "@/types/event";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { DocumentService } from './pdf/services/DocumentService';

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
 * Exports events to a PDF file with improved quality
 */
export const exportToPDF = (events: Event[], date: Date | undefined): void => {
  try {
    // Format the date for display and filename
    const dateStr = formatDateToString(date);
    const dateFilename = date ? date.toISOString().split('T')[0] : 'all';
    
    // Create document service for high quality PDF
    const docService = new DocumentService(
      'rapport', 
      'Planning', 
      date ? dateFilename : 'complet'
    );
    
    const doc = docService.getDocument();
    
    // Add header with date
    docService.addStandardHeader();
    
    // Add title with the date
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Planning du ${dateStr}`, 15, 65);
    
    // Add events table using autoTable
    autoTable(doc, {
      startY: 75,
      head: [["Titre", "Client", "Collaborateur", "Horaire", "Type"]],
      body: events.map(event => [
        event.title,
        event.client,
        event.collaborateur,
        event.time,
        event.type === "mission" ? "Mission" : "Réunion"
      ]),
      theme: 'grid',
      headStyles: { 
        fillColor: [60, 98, 85], 
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      columnStyles: {
        0: { cellWidth: 50 }, // Titre
        1: { cellWidth: 40 }, // Client
        2: { cellWidth: 40 }, // Collaborateur
        3: { cellWidth: 30 }, // Horaire
        4: { cellWidth: 25 }  // Type
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
    });
    
    // Add number of events
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Nombre total d'événements: ${events.length}`, 15, finalY + 15);
    
    // Add footer
    docService.addStandardFooter();
    
    // Generate and save PDF
    docService.generate(true);
    
  } catch (error) {
    console.error("Erreur lors de l'exportation en PDF:", error);
    alert("Une erreur est survenue lors de l'exportation en PDF.");
  }
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
 * Exports data to PDF format with improved quality
 */
export const exportToPdf = (title: string, data: any[], filename: string): void => {
  try {
    // Create document service for high quality PDF
    const docService = new DocumentService('rapport', title, filename);
    const doc = docService.getDocument();
    
    // Add header
    docService.addStandardHeader();
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, 65);
    
    // Check if data exists
    if (data.length === 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text("Aucune donnée disponible", 15, 80);
      
      // Add footer
      docService.addStandardFooter();
      
      // Generate and save PDF
      docService.generate(true);
      return;
    }
    
    // Get headers from first data object
    const headers = Object.keys(data[0]);
    
    // Clean up headers for display (remove underscores, capitalize)
    const displayHeaders = headers.map(header => 
      header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    
    // Generate table data
    const tableData = data.map(row => headers.map(header => row[header]));
    
    // Add the table to the PDF
    autoTable(doc, {
      startY: 75,
      head: [displayHeaders],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [60, 98, 85], 
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
    });
    
    // Add number of records
    const finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Nombre total d'enregistrements: ${data.length}`, 15, finalY + 15);
    
    // Add today's date
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR');
    doc.text(`Date d'exportation: ${dateStr}`, 15, finalY + 25);
    
    // Add footer
    docService.addStandardFooter();
    
    // Generate and save PDF
    docService.generate(true);
    
  } catch (error) {
    console.error("Erreur lors de l'exportation en PDF:", error);
    alert("Une erreur est survenue lors de l'exportation en PDF.");
  }
};
