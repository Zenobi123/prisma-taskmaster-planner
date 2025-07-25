
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { getFacturesData } from "./factureDataService";
import { formatClientsForSelector } from "./factureFormatService";
import { factureCreationService } from "./factureCreationService";
import { getNextFactureNumber } from "./factureServices/factureNumberService";
import { deleteFactureFromDatabase } from "./factureServices/factureDeleteService";
import { updateFactureInDatabase } from "./factureServices/factureUpdateService";

// Re-export functions for backward compatibility
export const getFactures = getFacturesData;
export { formatClientsForSelector };
export const addFactureToDatabase = factureCreationService.createFacture;
export { getNextFactureNumber };
export { deleteFactureFromDatabase };
export { updateFactureInDatabase };

// This file acts as a facade for the facture services and maintains
// backward compatibility with existing code that imports from factureService.ts
