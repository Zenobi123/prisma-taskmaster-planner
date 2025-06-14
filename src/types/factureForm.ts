
import { Prestation } from "./facture";

export interface FactureFormData {
  client_id: string;
  date: Date;
  echeance: Date;
  status: string;
  status_paiement: string;
  mode: string;
  prestations: Prestation[];
  notes?: string;
}

export { Prestation };
