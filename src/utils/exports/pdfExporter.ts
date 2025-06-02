
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Client } from '@/types/client';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
  }
}

export const exportClientsToPdf = (clients: Client[]) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(18);
  doc.text('Liste des clients', 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date d'export: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // Define table columns
  const columns = [
    { header: 'Nom', dataKey: 'nom' },
    { header: 'NIU', dataKey: 'niu' },
    { header: 'Type', dataKey: 'type' },
    { header: 'Téléphone', dataKey: 'telephone' },
    { header: 'Centre', dataKey: 'centre' }
  ];
  
  // Prepare data for table
  const data = clients.map(client => ({
    nom: client.raisonsociale || client.nom || 'N/A',
    niu: client.niu || 'N/A',
    type: client.type === 'morale' ? 'Personne Morale' : 'Personne Physique',
    telephone: client.contact?.telephone || 'N/A',
    centre: client.centrerattachement || 'N/A'
  }));
  
  // Add table to document
  autoTable(doc, {
    head: [columns.map(col => col.header)],
    body: data.map(item => columns.map(col => item[col.dataKey as keyof typeof item])),
    startY: 40,
    margin: { top: 35 },
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Save the PDF
  doc.save('clients-list.pdf');
};

export const exportClientDetailsToPdf = (client: Client) => {
  // Create new PDF document
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(18);
  doc.text('Fiche Client', 14, 22);
  
  // Add client name as subtitle
  doc.setFontSize(14);
  const clientName = client.raisonsociale || client.nom || 'Client sans nom';
  doc.text(clientName, 14, 32);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date d'édition: ${new Date().toLocaleDateString()}`, 14, 40);
  
  // Client details
  doc.setFontSize(12);
  doc.text('Informations générales', 14, 50);
  
  const details = [
    ['NIU', client.niu || 'Non renseigné'],
    ['Type', client.type === 'morale' ? 'Personne Morale' : 'Personne Physique'],
    ['Téléphone', client.contact?.telephone || 'Non renseigné'],
    ['Centre de rattachement', client.centrerattachement || 'Non renseigné'],
    ['Gestion externalisée', client.gestionexternalisee ? 'Oui' : 'Non']
  ];
  
  // Add details table
  autoTable(doc, {
    body: details,
    startY: 55,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 }
    }
  });
  
  // Save the PDF
  doc.save(`client-${client.id}.pdf`);
};

// Add a more generic export function that can be used by other modules
export const exportToPdf = (title: string, data: any[], filename: string) => {
  const doc = new jsPDF();
  
  // Set title
  doc.setFontSize(18);
  doc.text(title, 14, 22);
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Date d'export: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // If we have data and it's an array with objects
  if (data && Array.isArray(data) && data.length > 0) {
    // Extract headers from first object
    const headers = Object.keys(data[0]);
    
    // Format data for table
    const formattedData = data.map(item => 
      headers.map(header => {
        const value = item[header];
        return value !== undefined && value !== null ? value.toString() : 'N/A';
      })
    );
    
    // Add table
    autoTable(doc, {
      head: [headers],
      body: formattedData,
      startY: 40,
      margin: { top: 35 },
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 }
    });
  } else {
    // Add a placeholder text if no data
    doc.setFontSize(12);
    doc.text('Aucune donnée à afficher', 14, 50);
  }
  
  // Save the PDF with custom filename
  doc.save(`${filename}.pdf`);
};
