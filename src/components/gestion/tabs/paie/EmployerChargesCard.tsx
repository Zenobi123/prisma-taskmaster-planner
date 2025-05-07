
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMoney } from "./utils";

interface EmployerChargesCardProps {
  totalGrossSalary: number;
  cnpsEmployer: number;
  fne: number;
  cfcEmployer: number;
}

export function EmployerChargesCard({
  totalGrossSalary,
  cnpsEmployer,
  fne,
  cfcEmployer,
}: EmployerChargesCardProps) {
  const totalCharges = cnpsEmployer + fne + cfcEmployer;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Charges patronales (employeur)</CardTitle>
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
              <TableCell className="font-medium">Total masse salariale brute</TableCell>
              <TableCell className="text-right">{formatMoney(totalGrossSalary)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell colSpan={2} className="font-semibold">Charges patronales</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CNPS (Part patronale)</TableCell>
              <TableCell className="text-right">{formatMoney(cnpsEmployer)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>FNE (1%)</TableCell>
              <TableCell className="text-right">{formatMoney(fne)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>CFC (Part patronale - 1,5%)</TableCell>
              <TableCell className="text-right">{formatMoney(cfcEmployer)}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-semibold">Total des charges patronales</TableCell>
              <TableCell className="text-right font-semibold">
                {formatMoney(totalCharges)}
              </TableCell>
            </TableRow>
            <TableRow className="bg-primary/10">
              <TableCell className="font-semibold">Coût total employeur</TableCell>
              <TableCell className="text-right font-bold">
                {formatMoney(totalGrossSalary + totalCharges)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
