
import { useState } from "react";
import { ServiceActivityRow, calculateRoundedValue } from "./types";

export const useServiceActivity = () => {
  const [rows, setRows] = useState<ServiceActivityRow[]>([]);

  // Add a new empty row
  const addRow = () => {
    const newRow: ServiceActivityRow = {
      id: crypto.randomUUID(),
      client: "",
      date: "",
      structure: "",
      numeroMarche: "",
      montant: 0,
      montantHT: 0,
      arrondi: 0,
      acompteIRPrincipal: 0,
      acompteIRCAC: 0,
      droitEnregistrement: 0,
      montantTTC: 0,
      statut: 'en_attente'
    };
    setRows([...rows, newRow]);
  };

  // Remove a row by id
  const removeRow = (id: string) => {
    setRows(rows.filter(row => row.id !== id));
  };

  // Handle changes to any cell in the table
  const handleCellChange = (id: string, field: keyof ServiceActivityRow, value: string) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row };
        
        if (field === 'date' || field === 'structure' || field === 'numeroMarche' || field === 'client') {
          updatedRow[field] = value;
        } else {
          // For numeric fields, parse the input and calculate derived values
          const numericValue = parseFloat(value.replace(/\s/g, '').replace(',', '.')) || 0;
          
          if (field === 'montantHT') {
            updatedRow.montantHT = numericValue;
            updatedRow.arrondi = calculateRoundedValue(numericValue);
            updatedRow.acompteIRPrincipal = numericValue * 0.05; // 5% of montantHT
            updatedRow.acompteIRCAC = updatedRow.acompteIRPrincipal * 0.1; // 10% of Principal
            updatedRow.droitEnregistrement = updatedRow.arrondi * 0.07 + 4500; // 7% of arrondi + 4500
            updatedRow.montantTTC = numericValue * 1.1925; // Montant HT x 1.1925
          } else if (field === 'acompteIRPrincipal') {
            updatedRow.acompteIRPrincipal = numericValue;
            updatedRow.acompteIRCAC = numericValue * 0.1; // 10% of Principal
            updatedRow.montantTTC = updatedRow.montantHT * 1.1925; // Recalculate TTC
          } else if (field === 'droitEnregistrement') {
            updatedRow.droitEnregistrement = numericValue;
            updatedRow.montantTTC = updatedRow.montantHT * 1.1925; // Recalculate TTC
          } else if (field === 'montant') {
            updatedRow.montant = numericValue;
          } else if (field === 'statut') {
            updatedRow.statut = value as 'payé' | 'en_attente' | 'annulé';
          }
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  return {
    rows,
    addRow,
    removeRow,
    handleCellChange
  };
};
