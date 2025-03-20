
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { Paiement } from "@/types/paiement";
import ModePaiementBadge from "./ModePaiementBadge";
import { formatMontant } from "@/utils/formatUtils";

interface PaiementTableRowProps {
  paiement: Paiement;
}

const PaiementTableRow = ({ paiement }: PaiementTableRowProps) => {
  return (
    <TableRow key={paiement.id}>
      <TableCell className="font-medium">{paiement.id}</TableCell>
      <TableCell>{paiement.facture}</TableCell>
      <TableCell>{paiement.client}</TableCell>
      <TableCell>{paiement.date}</TableCell>
      <TableCell>{formatMontant(paiement.montant)}</TableCell>
      <TableCell>
        <ModePaiementBadge mode={paiement.mode} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PaiementTableRow;
