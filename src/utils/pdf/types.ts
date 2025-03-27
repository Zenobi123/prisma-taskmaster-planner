
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

export interface PDFFacture {
  id: string;
  client: Client;
  date: string;
  echeance: string;
  montant: number;
  montant_paye?: number;
  status: string;
  prestations: Prestation[];
  paiements?: Paiement[];
  notes?: string;
}
