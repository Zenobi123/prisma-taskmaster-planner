
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatMontant } from "@/utils/formatUtils";
import { FacturePrestation } from "../types/DetailFactureTypes";

interface DetailsTabContentProps {
  prestations: FacturePrestation[];
}

export const DetailsTabContent = ({ prestations }: DetailsTabContentProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prestations.map(prestation => (
              <TableRow key={prestation.id}>
                <TableCell>{prestation.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    prestation.type === "impots" 
                      ? "bg-[#84A98C]/10 text-[#84A98C] border-[#84A98C]/20" 
                      : "bg-[#2F3E46]/10 text-[#2F3E46] border-[#2F3E46]/20"
                  }>
                    {prestation.type === "impots" ? "Impôts" : "Honoraires"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">{formatMontant(prestation.montant)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
