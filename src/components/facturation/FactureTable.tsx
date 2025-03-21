
import { Table, TableBody } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import FactureTableHeader from "./FactureTableHeader";
import FactureTableRow from "./FactureTableRow";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewFacture: (facture: Facture) => void;
  onDownloadFacture: (facture: Facture) => void;
  onDeleteFacture: (factureId: string) => void;
  onEditFacture: (facture: Facture) => void;
}

const FactureTable = ({ 
  factures, 
  formatMontant,
  onViewFacture,
  onDownloadFacture,
  onDeleteFacture,
  onEditFacture
}: FactureTableProps) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <FactureTableHeader />
        <TableBody>
          {factures.length > 0 ? (
            factures.map((facture) => (
              <FactureTableRow
                key={facture.id}
                facture={facture}
                formatMontant={formatMontant}
                onViewFacture={onViewFacture}
                onDownloadFacture={onDownloadFacture}
                onDeleteFacture={onDeleteFacture}
                onEditFacture={onEditFacture}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-10 text-gray-500">
                Aucune facture trouvée
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FactureTable;
