
import React from "react";
import { CommercialActivityTable } from "./CommercialActivityTable";

interface CommercialActivityRow {
  month: string;
  irPrincipal: number;
  irCAC: number;
  irTotal: number;
  caHT: number;
}

interface CommercialActivityContentProps {
  previousYear: number;
  commercialActivityData: CommercialActivityRow[];
  handleIRPrincipalChange: (index: number, value: string) => void;
  formatNumberWithSeparator: (value: number) => string;
}

export const CommercialActivityContent = ({ 
  previousYear,
  commercialActivityData,
  handleIRPrincipalChange,
  formatNumberWithSeparator
}: CommercialActivityContentProps) => {
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Analyse du chiffre d'affaires pour l'activité commerciale de l'exercice {previousYear}.
      </p>
      <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
        <li>Ventes de marchandises</li>
      </ul>
      
      <div className="mt-4">
        <h4 className="font-medium text-sm mb-2">Tableau d'analyse</h4>
        <CommercialActivityTable 
          commercialActivityData={commercialActivityData}
          handleIRPrincipalChange={handleIRPrincipalChange}
          formatNumberWithSeparator={formatNumberWithSeparator}
        />
      </div>
    </div>
  );
};
