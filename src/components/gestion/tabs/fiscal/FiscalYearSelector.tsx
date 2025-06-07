
import React from "react";
import { Label } from "@/components/ui/label";

interface FiscalYearSelectorProps {
  fiscalYear: string;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const FiscalYearSelector: React.FC<FiscalYearSelectorProps> = ({
  fiscalYear,
  onYearChange
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
      <select 
        id="fiscal-year"
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={fiscalYear}
        onChange={onYearChange}
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>
    </div>
  );
};
