
import { Client } from "@/types/client";

export interface PrestationPayee {
  id: string;
  montant_modifie: number | null;
}

export interface Paiement {
  id: string;
  facture: string;
  client: string | Client | any; // Can be either a string ID or a Client object
  client_id: string;
  date: string;
  montant: number;
  mode: "espèces" | "virement" | "orange_money" | "mtn_money";
  reference: string;
  solde_restant: number;
  est_credit?: boolean;
  est_verifie?: boolean;
  reference_transaction?: string;
  notes?: string;
  type_paiement?: "total" | "partiel";
  prestations_payees?: PrestationPayee[];
}
