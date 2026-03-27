
import { Devis, DevisStatus } from "@/types/devis";
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
import { Edit, Trash2, FileText, Loader2 } from "lucide-react";

interface DevisTableProps {
  devis: Devis[];
  onEdit: (devis: Devis) => void;
  onDelete: (devisId: string) => void;
  onConvert: (devis: Devis) => void;
  isLoading?: boolean;
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("fr-FR");
};

const formatMontant = (montant: number): string => {
  return (
    new Intl.NumberFormat("fr-FR").format(montant) + " F CFA"
  );
};

const statusConfig: Record<
  DevisStatus,
  { label: string; className: string }
> = {
  brouillon: {
    label: "Brouillon",
    className: "bg-gray-100 text-gray-700 border-gray-300",
  },
  envoye: {
    label: "Envoy\u00e9",
    className: "bg-blue-100 text-blue-700 border-blue-300",
  },
  accepte: {
    label: "Accept\u00e9",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  refuse: {
    label: "Refus\u00e9",
    className: "bg-red-100 text-red-700 border-red-300",
  },
  converti: {
    label: "Converti",
    className: "bg-purple-100 text-purple-700 border-purple-300",
  },
};

const DevisTable = ({
  devis,
  onEdit,
  onDelete,
  onConvert,
  isLoading = false,
}: DevisTableProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Chargement des devis...</span>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold">N°</TableHead>
            <TableHead className="font-semibold">Client</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Validit\u00e9</TableHead>
            <TableHead className="font-semibold">Objet</TableHead>
            <TableHead className="font-semibold text-right">Imp\u00f4ts</TableHead>
            <TableHead className="font-semibold text-right">Honoraires</TableHead>
            <TableHead className="font-semibold text-right">Total</TableHead>
            <TableHead className="font-semibold">Statut</TableHead>
            <TableHead className="font-semibold text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devis.length > 0 ? (
            devis.map((d) => {
              const status = statusConfig[d.status];
              const isConverti = d.status === "converti";

              return (
                <TableRow key={d.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{d.numero}</TableCell>
                  <TableCell>{d.client?.nom ?? "-"}</TableCell>
                  <TableCell>{formatDate(d.date)}</TableCell>
                  <TableCell>{formatDate(d.date_validite)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {d.objet}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMontant(d.montant_impots)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatMontant(d.montant_honoraires)}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatMontant(d.montant_total)}
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(d)}
                        disabled={isConverti}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(d.id)}
                        disabled={isConverti}
                        title="Supprimer"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {d.status === "accepte" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onConvert(d)}
                          title="Convertir en facture"
                          className="text-purple-500 hover:text-purple-700"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-10 text-gray-500">
                Aucun devis trouv\u00e9
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DevisTable;
