
export interface Paiement {
  id: string;
  facture: string;
  client: string;
  date: string;
  montant: number;
  mode: "virement" | "espèces" | "chèque";
}
