
export interface ServiceActivityRow {
  id: string;
  date: string;
  structure: string;
  numeroMarche: string;
  montantHT: number;
  arrondi: number;
  acompteIRPrincipal: number;
  acompteIRCAC: number;
  droitEnregistrement: number;
  montantTTC: number;
}

export interface ServiceActivityContentProps {
  previousYear?: number;
}

// Format numbers with thousands separator (French locale)
export const formatNumberWithSeparator = (value: number): string => {
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 });
};

// Calculate the rounded value to the next thousand
export const calculateRoundedValue = (value: number): number => {
  return Math.ceil(value / 1000) * 1000;
};

// Calculate totals for all columns
export const calculateTotals = (rows: ServiceActivityRow[]) => {
  return {
    montantHT: rows.reduce((sum, row) => sum + row.montantHT, 0),
    arrondi: rows.reduce((sum, row) => sum + row.arrondi, 0),
    acompteIRPrincipal: rows.reduce((sum, row) => sum + row.acompteIRPrincipal, 0),
    acompteIRCAC: rows.reduce((sum, row) => sum + row.acompteIRCAC, 0),
    droitEnregistrement: rows.reduce((sum, row) => sum + row.droitEnregistrement, 0),
    montantTTC: rows.reduce((sum, row) => sum + row.montantTTC, 0)
  };
};
