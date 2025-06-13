
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { getFacturesData } from "./factureDataService";
import { formatClientsForSelector } from "./factureFormatService";
import { addFactureToDatabase } from "./factureCreationService";
import { getNextFactureNumber } from "./factureServices/factureNumberService";
import { deleteFactureFromDatabase } from "./factureServices/factureDeleteService";
import { updateFactureInDatabase } from "./factureServices/factureUpdateService";

// Re-export functions for backward compatibility
export const getFactures = getFacturesData;
export { formatClientsForSelector };
export { addFactureToDatabase };
export { getNextFactureNumber };
export { deleteFactureFromDatabase };
export { updateFactureInDatabase };

// Add the missing exports for create and update operations
export const createFacture = addFactureToDatabase;
export const updateFacture = updateFactureInDatabase;

// This file acts as a facade for the facture services and maintains
// backward compatibility with existing code that imports from factureService.ts
