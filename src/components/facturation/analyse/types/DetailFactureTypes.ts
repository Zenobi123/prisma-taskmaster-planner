
export type FacturePrestation = {
  id: string;
  description: string;
  montant: number;
  type?: string;
};

export type FactureDetail = {
  id: string;
  date: string;
  client: string;
  montant: number;
  montant_paye: number;
  status: string;
  status_paiement: string;
  echeance: string;
  prestations: FacturePrestation[];
};

export interface DetailFactureProps {
  factureId: string;
}
