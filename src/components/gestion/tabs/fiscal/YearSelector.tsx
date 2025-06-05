
import React from "react";
import { Label } from "@/components/ui/label";

interface YearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onYearChange
}) => {
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
      <select 
        id="fiscal-year"
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={selectedYear}
        onChange={handleYearChange}
      >
        <option value="2025">2025</option>
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </select>
    </div>
  );
};
