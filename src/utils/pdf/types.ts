
import { Client } from '@/types/client';

export interface Prestation {
  description: string;
  quantite?: number;
  montant: number;
  taux?: number;
}

export interface Paiement {
  date: string;
  montant: number;
  mode: string;
  reference?: string;
}

export type FactureStatus = "brouillon" | "envoyée" | "annulée" | string;
export type PaiementStatus = "non_payée" | "partiellement_payée" | "payée" | "en_retard" | string;

export interface PDFFacture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: FactureStatus;
  status_paiement?: PaiementStatus;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
}

// Simplified client interface for PDF generation
export interface SimplifiedClient {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
}
