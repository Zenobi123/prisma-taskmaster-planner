
import { Table, TableBody } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import { FactureTableHeader } from "./table/FactureTableHeader";
import { FactureTableRow } from "./table/FactureTableRow";
import { FactureTablePagination } from "./table/FactureTablePagination";
import { FactureEmptyState } from "./table/FactureEmptyState";

interface FacturesTableProps {
  factures: Facture[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteInvoice: (id: string) => void;
  onPaiementClick: (facture: Facture) => void;
}

export const FacturesTable = ({
  factures,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteInvoice,
  onPaiementClick
}: FacturesTableProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  // Message si aucune facture
  if (factures.length === 0) {
    return <FactureEmptyState />;
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <FactureTableHeader />
          <TableBody>
            {factures.map((facture) => (
              <FactureTableRow 
                key={facture.id}
                facture={facture}
                onDeleteInvoice={onDeleteInvoice}
                onPaiementClick={onPaiementClick}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <FactureTablePagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};
