
import { Client } from "@/types/client";

export interface ServiceActivityRow {
  id: string;
  client: string;
  date: string;
  structure: string;
  numeroMarche: string;
  montant: number;
  montantHT: number;
  arrondi: number;
  acompteIRPrincipal: number;
  acompteIRCAC: number;
  droitEnregistrement: number;
  montantTTC: number;
  statut: 'payé' | 'en_attente' | 'annulé';
}

export interface ServiceActivityContentProps {
  client: Client;
  previousYear?: number;
}

export interface ServiceActivityTableProps {
  rows: ServiceActivityRow[];
  handleCellChange: (id: string, field: keyof ServiceActivityRow, value: string) => void;
  removeRow: (id: string) => void;
}

// Utility functions
export const formatNumberWithSeparator = (value: number): string => {
  if (!value && value !== 0) return '';
  return value.toLocaleString('fr-FR');
};

export const calculateRoundedValue = (montantHT: number): number => {
  return Math.ceil(montantHT / 1000) * 1000;
};

export const calculateTotals = (rows: ServiceActivityRow[]) => {
  return rows.reduce((totals, row) => {
    return {
      montantHT: totals.montantHT + (row.montantHT || 0),
      arrondi: totals.arrondi + (row.arrondi || 0),
      acompteIRPrincipal: totals.acompteIRPrincipal + (row.acompteIRPrincipal || 0),
      acompteIRCAC: totals.acompteIRCAC + (row.acompteIRCAC || 0),
      droitEnregistrement: totals.droitEnregistrement + (row.droitEnregistrement || 0),
      montantTTC: totals.montantTTC + (row.montantTTC || 0)
    };
  }, {
    montantHT: 0,
    arrondi: 0,
    acompteIRPrincipal: 0, 
    acompteIRCAC: 0,
    droitEnregistrement: 0,
    montantTTC: 0
  });
};
