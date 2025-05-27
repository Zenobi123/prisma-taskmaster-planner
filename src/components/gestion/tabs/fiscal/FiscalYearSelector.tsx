
import React from 'react';
import { Label } from '@/components/ui/label';

interface FiscalYearSelectorProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export const FiscalYearSelector: React.FC<FiscalYearSelectorProps> = ({
  selectedYear,
  onYearChange
}) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  
  // Génère les années de currentYear-2 à currentYear+1
  for (let year = currentYear - 2; year <= currentYear + 1; year++) {
    years.push(year.toString());
  }

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
      <select 
        id="fiscal-year"
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={selectedYear}
        onChange={(e) => onYearChange(e.target.value)}
      >
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};
