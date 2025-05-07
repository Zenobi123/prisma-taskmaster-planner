
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "./utils";

interface PayrollDetailsProps {
  employeeId: number;
  grossSalary: number;
  cnpsEmployee: number;
  irpp: number;
  cac: number;
  tdl: number;
  rav: number;
  cfc: number;
  netSalary: number;
}

export function PayrollDetailsCard({ 
  employeeId, 
  grossSalary, 
  cnpsEmployee, 
  irpp, 
  cac, 
  tdl, 
  rav, 
  cfc, 
  netSalary 
}: PayrollDetailsProps) {
  const totalDeductions = cnpsEmployee + irpp + cac + tdl + rav + cfc;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Détails de la fiche de paie</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Élément</TableHead>
              <TableHead className="text-right">Montant (FCFA)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Salaire brut</TableCell>
              <TableCell className="text-right">{formatMoney(grossSalary)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-semibold">Charges et retenues</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CNPS (Part salariale)</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(cnpsEmployee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>IRPP (Principal)</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(irpp)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CAC (10% de l'IRPP)</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(cac)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>TDL</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(tdl)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>RAV</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(rav)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CFC (Part salariale)</TableCell>
              <TableCell className="text-right text-destructive">- {formatMoney(cfc)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Total des retenues</TableCell>
              <TableCell className="text-right font-semibold text-destructive">
                {formatMoney(totalDeductions)}
              </TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="font-semibold">Salaire net</TableCell>
              <TableCell className="text-right font-bold text-primary">
                {formatMoney(netSalary)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
