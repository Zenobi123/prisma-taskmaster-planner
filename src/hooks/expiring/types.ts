
export interface ExpiringClient {
  id: string;
  name: string;
  document: string;
  expiryDate: string;
  creationDate?: string;
  daysRemaining: number;
}
