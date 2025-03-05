
import React from "react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ServiceActivityTableHeader = () => {
  return (
    <TableHeader className="bg-primary text-white">
      <TableRow className="border-b-2 border-black">
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Date</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Structure</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Numéro Marché</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black w-36">Montant HT</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black">Arrondi</TableHead>
        <TableHead colSpan={3} className="text-center text-white font-medium border-r-2 border-black">Acompte IR</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black w-32">DE</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium border-r-2 border-black w-32">Montant TTC</TableHead>
        <TableHead rowSpan={2} className="text-center text-white font-medium">Actions</TableHead>
      </TableRow>
      <TableRow className="border-b-2 border-black">
        <TableHead className="text-center text-white font-medium border-r-2 border-black">Principal (5%)</TableHead>
        <TableHead className="text-center text-white font-medium border-r-2 border-black">CAC (10%)</TableHead>
        <TableHead className="text-center text-white font-medium border-r-2 border-black">Total</TableHead>
      </TableRow>
    </TableHeader>
  );
};
