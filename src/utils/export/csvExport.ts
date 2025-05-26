
import { Client } from "@/types/client";
import { formatClientForExport } from "./clientDataFormatter";

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
