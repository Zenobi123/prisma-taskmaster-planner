
import { v4 as uuidv4 } from 'uuid';
import { Json } from "@/integrations/supabase/types";
import { Facture, Prestation, FactureDB, convertToFacture, convertToFactureDB } from "@/types/facture";

// Générer un numéro de facture unique
export const generateFactureId = () => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `F${year}${month}-${random}`;
};

export const prepareFactureForDb = (facture: any) => {
  return {
    ...facture,
    prestations: facture.prestations as unknown as Json
  };
};
