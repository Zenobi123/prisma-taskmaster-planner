import { Table, TableBody } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import FactureTableHeader from "./FactureTableHeader";
import FactureTableRow from "./FactureTableRow";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Download, Edit, Send, Ban, Trash, MoreHorizontal } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/factureUtils";
import FacturePrintButton from "@/components/printable/connectors/FacturePrintButton";

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
  onViewFacture,
  onDownloadFacture,
  onDeleteFacture,
  onEditFacture,
  onSendFacture,
  onCancelFacture,
}: FactureTableProps) => {
  return (
    <>
      {/* Vue tableau (desktop) */}
      <div className="hidden md:block rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <FactureTableHeader />
          <TableBody>
            {factures.length > 0 ? (
              factures.map((facture) => (
                <FactureTableRow
                  key={facture.id}
                  facture={facture}
                  onDelete={() => onDeleteFacture(facture.id)}
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

      {/* Vue cartes (mobile) */}
      <div className="md:hidden space-y-3">
        {factures.length > 0 ? (
          factures.map((facture) => (
            <div key={facture.id} className="rounded-lg border bg-white p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {facture.numero || facture.id}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {facture.client?.nom || "N/A"}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[11px] text-gray-400">Montant</div>
                  <div className="font-semibold text-sm">{formatCurrency(facture.montant)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Émise : {formatDate(facture.date)}</span>
                <span>Échéance : {formatDate(facture.echeance)}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <StatusBadge status={facture.status} type="document" />
                <StatusBadge status={facture.status_paiement} type="paiement" />
              </div>

              <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
                <FacturePrintButton facture={facture} variant="icon" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 w-9 p-0">
                      <span className="sr-only">Ouvrir le menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onViewFacture(facture)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Voir
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onDownloadFacture(facture)}>
                      <Download className="mr-2 h-4 w-4" />
                      Télécharger
                    </DropdownMenuItem>
                    {onSendFacture && (
                      <DropdownMenuItem onClick={() => onSendFacture(facture)}>
                        <Send className="mr-2 h-4 w-4" />
                        Envoyer
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEditFacture(facture)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    {onCancelFacture && (
                      <DropdownMenuItem onClick={() => onCancelFacture(facture)}>
                        <Ban className="mr-2 h-4 w-4" />
                        Annuler
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDeleteFacture(facture.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border bg-white text-center py-10 text-gray-500">
            Aucune facture trouvée
          </div>
        )}
      </div>
    </>
  );
};

export default FactureTable;
