
import { Table, TableBody } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import FactureTableHeader from "./FactureTableHeader";
import FactureTableRow from "./FactureTableRow";
import { useIsMobile } from "@/hooks/use-mobile";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewFacture: (facture: Facture) => void;
  onDownloadFacture: (facture: Facture) => void;
  onDeleteFacture: (factureId: string) => void;
  onEditFacture: (facture: Facture) => void;
  onSendFacture?: (facture: Facture) => void;
  onCancelFacture?: (facture: Facture) => void;
  isMobile?: boolean;
}

const FactureTable = ({ 
  factures, 
  formatMontant,
  onViewFacture,
  onDownloadFacture,
  onDeleteFacture,
  onEditFacture,
  onSendFacture,
  onCancelFacture,
  isMobile
}: FactureTableProps) => {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        {!isMobile && <FactureTableHeader />}
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
                onSendFacture={onSendFacture}
                onCancelFacture={onCancelFacture}
                isMobile={isMobile}
              />
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center py-10 text-gray-500">
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
