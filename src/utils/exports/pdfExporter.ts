
import { Event } from "@/types/event";
import { DocumentService } from '../pdf/services/DocumentService';
import autoTable from 'jspdf-autotable';
import { formatDateToString } from './csvExporter';

/**
 * Exports events to a PDF file
 */
export const exportToPDF = (events: Event[], date: Date | undefined): void => {
  try {
    // Format the date for display and filename
    const dateStr = formatDateToString(date);
    const dateFilename = date ? date.toISOString().split('T')[0] : 'all';
    
    // Create document service for high quality PDF
    const docService = new DocumentService();
    const doc = docService.getDocument();
    
    // Add header with date
    docService.addStandardHeader('Planning');
    
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
        0: { cellWidth: 50 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 25 }
      },
      alternateRowStyles: {
        fillColor: [248, 250, 249]
      },
    });
    
    // Add number of events
    // Access lastAutoTable safely using type assertion
    const docWithTable = doc as any;
    const finalY = docWithTable.lastAutoTable?.finalY || 100;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Nombre total d'événements: ${events.length}`, 15, finalY + 15);
    
    // Add footer and generate
    docService.addStandardFooter();
    docService.save(`planning_${dateFilename}.pdf`);
    
  } catch (error) {
    console.error("Erreur lors de l'exportation en PDF:", error);
    alert("Une erreur est survenue lors de l'exportation en PDF.");
  }
};

/**
 * Exports generic data to PDF format
 */
export const exportToPdf = (title: string, data: any[], filename: string): void => {
  try {
    const docService = new DocumentService();
    const doc = docService.getDocument();
    
    docService.addStandardHeader(title);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 15, 65);
    
    if (data.length === 0) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.text("Aucune donnée disponible", 15, 80);
      docService.addStandardFooter();
      docService.save(`${filename}.pdf`);
      return;
    }
    
    const headers = Object.keys(data[0]);
    const displayHeaders = headers.map(header => 
      header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
    
    const tableData = data.map(row => headers.map(header => row[header]));
    
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
    
    // Access lastAutoTable safely using type assertion
    const docWithTable = doc as any;
    const finalY = docWithTable.lastAutoTable?.finalY || 100;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Nombre total d'enregistrements: ${data.length}`, 15, finalY + 15);
    
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR');
    doc.text(`Date d'exportation: ${dateStr}`, 15, finalY + 25);
    
    docService.addStandardFooter();
    docService.save(`${filename}.pdf`);
    
  } catch (error) {
    console.error("Erreur lors de l'exportation en PDF:", error);
    alert("Une erreur est survenue lors de l'exportation en PDF.");
  }
};

// Re-export formatDateToString from csvExporter
export { formatDateToString } from './csvExporter';
