
import { Table, TableBody } from "@/components/ui/table";
import { Paiement } from "@/types/paiement";
import PaiementTableHeader from "./PaiementTableHeader";
import PaiementTableRow from "./PaiementTableRow";

interface PaiementTableProps {
  paiements: Paiement[];
}

const PaiementTable = ({ paiements }: PaiementTableProps) => {
  return (
    <Table>
      <PaiementTableHeader />
      <TableBody>
        {paiements.length > 0 ? (
          paiements.map((paiement) => (
            <PaiementTableRow key={paiement.id} paiement={paiement} />
          ))
        ) : (
          <tr>
            <td colSpan={7} className="text-center py-8 text-gray-500">
              Aucun paiement trouvé
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
};

export default PaiementTable;
