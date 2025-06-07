
import React from "react";
import { FiscalYearSelector } from "./FiscalYearSelector";

interface ObligationsFiscalesHeaderProps {
  fiscalYear: string;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ObligationsFiscalesHeader: React.FC<ObligationsFiscalesHeaderProps> = ({
  fiscalYear,
  onYearChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Obligations fiscales</h1>
        <p className="text-sm text-gray-500">Suivi des obligations fiscales de l'entreprise</p>
      </div>
      <FiscalYearSelector 
        fiscalYear={fiscalYear}
        onYearChange={onYearChange}
      />
    </div>
  );
};
