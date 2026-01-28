
import { Client } from "@/types/client";
import { exportToExcel } from "./csvExporter";

/**
 * Génère un ID court de 5 caractères alphanumériques en majuscules à partir d'un UUID
 */
const generateShortId = (uuid: string): string => {
  // Retire les tirets et prend les caractères alphanumériques
  const alphanumeric = uuid.replace(/-/g, '').toUpperCase();
  // Retourne les 5 premiers caractères
  return alphanumeric.slice(0, 5);
};

/**
 * Formate les données client pour l'exportation en supprimant les détails complexes
 */
const formatClientForExport = (client: Client) => {
  return {
    ID: generateShortId(client.id),
    Type: client.type === "physique" ? "Personne physique" : "Personne morale",
    Nom: client.type === "physique" ? client.nom : client.raisonsociale,
    NIU: client.niu,
    CentreRattachement: client.centrerattachement,
    Ville: client.adresse.ville,
    Quartier: client.adresse.quartier,
    Telephone: client.contact.telephone,
    Email: client.contact.email,
    SecteurActivite: client.secteuractivite,
    Statut: client.statut,
    NumeroCNPS: client.numerocnps || "",
    GestionExternalisee: client.gestionexternalisee ? "Oui" : "Non",
    DateCreation: client.created_at || ""
  };
};

/**
 * Exporte la liste des clients au format CSV
 */
export const exportClientsToCSV = (clients: Client[], filename = "clients") => {
  const formattedClients = clients.map(formatClientForExport);
  exportToExcel(formattedClients, filename);
};

/**
 * Exporte la liste des clients au format JSON
 */
export const exportClientsToJSON = (clients: Client[], filename = "clients") => {
  const formattedClients = clients.map(formatClientForExport);
  const jsonContent = JSON.stringify(formattedClients, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.json`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporte la liste des clients au format XLS (via XLSX)
 * Note: Cette fonction utilise le même format CSV car nous n'avons pas de dépendance XLSX.
 * Pour un vrai format XLS, nous pourrions ajouter une bibliothèque comme xlsx ou exceljs.
 */
export const exportClientsToXLS = (clients: Client[], filename = "clients") => {
  const formattedClients = clients.map(formatClientForExport);
  exportToExcel(formattedClients, `${filename}`);
};
