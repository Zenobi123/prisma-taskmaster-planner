
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

interface CommercialActivityRow {
  month: string;
  irPrincipal: number;
  irCAC: number;
  irTotal: number;
  caHT: number;
}

interface CommercialActivityTableProps {
  commercialActivityData: CommercialActivityRow[];
  handleIRPrincipalChange: (index: number, value: string) => void;
  formatNumberWithSeparator: (value: number) => string;
}

export const CommercialActivityTable = ({ 
  commercialActivityData,
  handleIRPrincipalChange,
  formatNumberWithSeparator
}: CommercialActivityTableProps) => {
  // Calculate totals
  const totals = commercialActivityData.reduce(
    (acc, curr) => ({
      month: "Total",
      irPrincipal: acc.irPrincipal + curr.irPrincipal,
      irCAC: acc.irCAC + curr.irCAC,
      irTotal: acc.irTotal + curr.irTotal,
      caHT: acc.caHT + curr.caHT
    }),
    { month: "Total", irPrincipal: 0, irCAC: 0, irTotal: 0, caHT: 0 }
  );

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mois</TableHead>
            <TableHead>Accompte sur IR (Principal)</TableHead>
            <TableHead>Accompte sur IR (CAC)</TableHead>
            <TableHead>Accompte sur IR (Total)</TableHead>
            <TableHead>CA HT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commercialActivityData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.month}</TableCell>
              <TableCell>
                <Input
                  type="text"
                  value={row.irPrincipal ? formatNumberWithSeparator(row.irPrincipal) : ''}
                  onChange={(e) => handleIRPrincipalChange(index, e.target.value)}
                  className="w-32"
                />
              </TableCell>
              <TableCell>{formatNumberWithSeparator(row.irCAC)}</TableCell>
              <TableCell>{formatNumberWithSeparator(row.irTotal)}</TableCell>
              <TableCell>{formatNumberWithSeparator(row.caHT)}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium bg-slate-50">
            <TableCell>{totals.month}</TableCell>
            <TableCell>{formatNumberWithSeparator(totals.irPrincipal)}</TableCell>
            <TableCell>{formatNumberWithSeparator(totals.irCAC)}</TableCell>
            <TableCell>{formatNumberWithSeparator(totals.irTotal)}</TableCell>
            <TableCell>{formatNumberWithSeparator(totals.caHT)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
