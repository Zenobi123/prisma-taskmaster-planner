
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
 * Exports events to a PDF file
 */
export const exportToPDF = (events: Event[], date: Date | undefined): void => {
  // Create a new PDF document
  const doc = new jsPDF();
  
  // Set title with the date
  const dateStr = formatDateToString(date);
  doc.setFontSize(16);
  doc.text(`Planning du ${dateStr}`, 14, 20);
  
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
  
  // Add the table to the PDF
  autoTable(doc, {
    startY: 30,
    head: tableHeader,
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
  });
  
  // Save the PDF
  doc.save(`events-${date ? date.toISOString().split('T')[0] : 'all'}.pdf`);
};
