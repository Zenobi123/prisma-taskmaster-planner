
/**
 * Utilities for CSV export functionality
 */

import { Event } from "@/types/event";

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
  
  // Create and trigger download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
 * Generic function to export data to Excel (CSV) format
 */
export const exportToExcel = (data: any[], filename: string): void => {
  const headers = Object.keys(data[0] || {});
  const csvHeader = headers.join(",");
  
  const csvData = data.map(row => 
    headers.map(header => {
      const cell = row[header] !== undefined && row[header] !== null ? row[header] : '';
      return `"${String(cell).replace(/"/g, '""')}"`;
    }).join(",")
  ).join("\n");
  
  const csvContent = `${csvHeader}\n${csvData}`;
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
