
import { Client } from "@/types/client";

/**
 * Extracts and formats fiscal data from a client
 */
export const extractFiscalData = (client: Client) => {
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
export const formatClientForExport = (client: Client) => {
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
