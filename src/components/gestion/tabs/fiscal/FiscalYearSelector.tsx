
import React, { useMemo } from "react";
import { Label } from "@/components/ui/label";
import { useClotures } from "@/lib/spec/clotureComptable";

interface FiscalYearSelectorProps {
  fiscalYear: string;
  onYearChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const START_YEAR = 2025;

export const FiscalYearSelector: React.FC<FiscalYearSelectorProps> = ({
  fiscalYear,
  onYearChange
}) => {
  const { isYearClosed } = useClotures();

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const result: number[] = [];
    for (let y = currentYear; y >= START_YEAR; y--) {
      result.push(y);
    }
    return result;
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="fiscal-year" className="text-sm">Année fiscale:</Label>
      <select
        id="fiscal-year"
        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        value={fiscalYear}
        onChange={onYearChange}
      >
        {years.map((year) => (
          <option key={year} value={String(year)}>
            {isYearClosed(year) ? `${year} (clôturé)` : year}
          </option>
        ))}
      </select>
    </div>
  );
};
