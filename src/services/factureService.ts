
import { Facture } from "@/types/facture";
import { Client } from "@/types/client";
import { getFacturesData } from "./factureDataService";
import { formatClientsForSelector } from "./factureFormatService";
import { addFactureToDatabase } from "./factureCreationService";

// Re-export functions for backward compatibility
export const getFactures = getFacturesData;
export { formatClientsForSelector };
export { addFactureToDatabase };

// This file acts as a facade for the facture services and maintains
// backward compatibility with existing code that imports from factureService.ts
