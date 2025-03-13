
import { Client } from "@/types/client";

export interface ServiceActivityRow {
  id: string;
  client: string;
  montant: number;
  date: string;
  statut: 'payé' | 'en_attente' | 'annulé';
}

export interface ServiceActivityContentProps {
  client: Client;
  previousYear?: number;
}

export interface ServiceActivityTableProps {
  rows: ServiceActivityRow[];
  handleCellChange: (id: string, field: keyof ServiceActivityRow, value: any) => void;
  removeRow: (id: string) => void;
}
