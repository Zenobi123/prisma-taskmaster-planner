
import { Proposition, PropositionStatus } from "@/types/proposition";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Loader2 } from "lucide-react";
import PropositionPrintButton from "@/components/printable/connectors/PropositionPrintButton";

interface PropositionTableProps {
  propositions: Proposition[];
  onEdit: (proposition: Proposition) => void;
  onDelete: (propositionId: string) => void;
  isLoading?: boolean;
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const formatMontant = (montant: number): string => {
  return new Intl.NumberFormat("fr-FR").format(montant) + " F CFA";
};

const statusConfig: Record<
  PropositionStatus,
  { label: string; className: string }
> = {
  brouillon: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-700 border-gray-300",
  },
  envoyee: {
    label: "Envoyée",
    className: "bg-blue-100 text-blue-700 border-blue-300",
  },
  acceptee: {
    label: "Acceptée",
    className: "bg-green-100 text-green-700 border-green-300",
  },
};

const PropositionTable = ({
  propositions,
  onEdit,
  onDelete,
  isLoading = false,
}: PropositionTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Chargement des propositions...</span>
      </div>
    );
  }

  return (
    <>
      {/* Vue tableau (desktop) */}
      <div className="hidden md:block rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">N°</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold text-right">Impôts</TableHead>
              <TableHead className="font-semibold text-right">Honoraires</TableHead>
              <TableHead className="font-semibold text-right">Total</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {propositions.length > 0 ? (
              propositions.map((p) => {
                const status = statusConfig[p.status];
                const isAcceptee = p.status === "acceptee";

                return (
                  <TableRow key={p.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{p.numero}</TableCell>
                    <TableCell>{p.client?.nom ?? "-"}</TableCell>
                    <TableCell>{formatDate(p.date)}</TableCell>
                    <TableCell className="text-right">
                      {formatMontant(p.total_impots)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMontant(p.total_honoraires)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatMontant(p.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${status.className}`}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <PropositionPrintButton proposition={p} />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(p)}
                          disabled={isAcceptee}
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(p.id)}
                          disabled={isAcceptee}
                          title="Supprimer"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-gray-500">
                  Aucune proposition trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vue cartes (mobile) */}
      <div className="md:hidden space-y-3">
        {propositions.length > 0 ? (
          propositions.map((p) => {
            const status = statusConfig[p.status];
            const isAcceptee = p.status === "acceptee";

            return (
              <div key={p.id} className="rounded-lg border bg-white p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm truncate">{p.numero}</div>
                    <div className="text-sm text-gray-600 truncate">{p.client?.nom ?? "-"}</div>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-xs ${status.className}`}>
                    {status.label}
                  </Badge>
                </div>

                <div className="text-xs text-gray-500">Émise : {formatDate(p.date)}</div>

                <div className="flex items-end justify-between gap-2 pt-1 border-t border-gray-100">
                  <div className="text-xs text-gray-500 leading-tight">
                    <div>Impôts : {formatMontant(p.total_impots)}</div>
                    <div>Honoraires : {formatMontant(p.total_honoraires)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-gray-400">Total</div>
                    <div className="font-semibold text-sm">{formatMontant(p.total)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
                  <PropositionPrintButton proposition={p} />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(p)}
                    disabled={isAcceptee}
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(p.id)}
                    disabled={isAcceptee}
                    title="Supprimer"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border bg-white text-center py-10 text-gray-500">
            Aucune proposition trouvée
          </div>
        )}
      </div>
    </>
  );
};

export default PropositionTable;
