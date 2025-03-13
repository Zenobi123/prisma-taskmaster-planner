
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ServiceActivityRow, calculateRoundedValue } from "./types";

export function useServiceActivity() {
  const [rows, setRows] = useState<ServiceActivityRow[]>([
    {
      id: uuidv4(),
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
      statut: "en_attente"
    }
  ]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: uuidv4(),
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
        statut: "en_attente"
      }
    ]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCellChange = (id: string, field: keyof ServiceActivityRow, value: string) => {
    const updatedRows = rows.map((row) => {
      if (row.id !== id) return row;

      const updatedRow = { ...row };

      if (field === "structure" || field === "numeroMarche" || field === "client" || field === "date") {
        // For string fields, just update the value
        updatedRow[field] = value;
      } else if (field === "statut") {
        // For statut field, ensure it's a valid value
        updatedRow.statut = value as 'payé' | 'en_attente' | 'annulé';
      } else if (field === "montantHT") {
        // For montantHT, update the value and recalculate dependent values
        const montantHT = parseFloat(value) || 0;
        updatedRow.montantHT = montantHT;
        updatedRow.arrondi = calculateRoundedValue(montantHT);
        updatedRow.acompteIRPrincipal = Math.round(montantHT * 0.025);
        updatedRow.acompteIRCAC = Math.round(updatedRow.acompteIRPrincipal * 0.1);
        updatedRow.droitEnregistrement = Math.round(updatedRow.arrondi * 0.02);
        updatedRow.montantTTC = montantHT;
      } else if (field === "acompteIRPrincipal") {
        // For acompteIRPrincipal, update the value and recalculate CAC
        updatedRow.acompteIRPrincipal = parseFloat(value) || 0;
        updatedRow.acompteIRCAC = Math.round(updatedRow.acompteIRPrincipal * 0.1);
        updatedRow.montantTTC = updatedRow.montantHT;
      } else if (field === "droitEnregistrement") {
        // For droitEnregistrement, update the value
        updatedRow.droitEnregistrement = parseFloat(value) || 0;
        updatedRow.montantTTC = updatedRow.montantHT;
      }

      return updatedRow;
    });

    setRows(updatedRows);
  };

  return { rows, addRow, removeRow, handleCellChange };
}
