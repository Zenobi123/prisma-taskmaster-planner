
import { Table, TableBody } from "@/components/ui/table";
import { Paiement } from "@/types/paiement";
import PaiementTableHeader from "./PaiementTableHeader";
import PaiementTableRow from "./PaiementTableRow";
import { Skeleton } from "@/components/ui/skeleton";

interface PaiementTableProps {
  paiements: Paiement[];
  loading?: boolean;
  onDelete?: (id: string) => Promise<boolean>;
  onViewReceipt?: (paiement: Paiement) => void;
}

const PaiementTable = ({ 
  paiements, 
  loading = false, 
  onDelete, 
  onViewReceipt 
}: PaiementTableProps) => {
  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <PaiementTableHeader />
      <TableBody>
        {paiements.length > 0 ? (
          paiements.map((paiement) => (
            <PaiementTableRow 
              key={paiement.id} 
              paiement={paiement} 
              onDelete={onDelete}
              onViewReceipt={onViewReceipt}
            />
          ))
        ) : (
          <tr>
            <td colSpan={8} className="text-center py-8 text-gray-500">
              Aucun paiement trouvé
            </td>
          </tr>
        )}
      </TableBody>
    </Table>
  );
};

export default PaiementTable;
