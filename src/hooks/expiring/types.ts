
export interface ExpiringClient {
  id: string;
  name: string;
  document: string;
  expiryDate: string;
  creationDate: string; // Changer de optional à required
  daysRemaining: number;
  type?: string; // Ajout d'un champ type pour identifier le type de document
}
