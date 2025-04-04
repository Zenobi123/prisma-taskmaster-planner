
import { Client } from "@/types/client";

// Client object for PDF generation with simplified structure
export interface SimplifiedClient {
  nom: string;
  adresse: string;
  niu?: string;
  email?: string;
  telephone?: string;
}

// Payment record for PDF invoices
export interface PdfPaiement {
  id?: string;
  reference?: string;
  date: string;
  montant: number;
  mode: string;
  notes?: string;
  facture_id?: string;
  client?: SimplifiedClient;
  solde_restant?: number;
  est_credit?: boolean;
}

// Service record for PDF invoices
export interface PdfPrestation {
  id?: string;
  description: string;
  quantite?: number;
  taux?: number;
  montant: number;
  facture_id?: string;
}

// Complete invoice data for PDF generation
export interface PDFFacture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: "brouillon" | "envoyée" | "annulée";
  status_paiement: "non_payée" | "partiellement_payée" | "payée" | "en_retard";
  prestations: PdfPrestation[];
  paiements?: PdfPaiement[];
  notes?: string;
}
