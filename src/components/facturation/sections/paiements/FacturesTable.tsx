
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, CreditCard as PartialIcon } from "lucide-react";
import { Facture, Paiement } from "@/types/facture";

interface FacturesTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onOpenPaymentDialog: (facture: Facture) => void;
  onOpenPartialPaymentDialog: (facture: Facture) => void;
}

export const FacturesTable = ({
  factures,
  formatMontant,
  onOpenPaymentDialog,
  onOpenPartialPaymentDialog
}: FacturesTableProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Partiellement payée</Badge>;
      case "en_attente":
        return <Badge variant="secondary">En attente</Badge>;
      case "envoyée":
        return <Badge variant="outline">Envoyée</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Réf. Facture</TableHead>
            <TableHead className="whitespace-nowrap">Client</TableHead>
            <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
            <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
            <TableHead className="whitespace-nowrap">Déjà payé</TableHead>
            <TableHead className="whitespace-nowrap">Statut</TableHead>
            <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {factures.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Aucune facture en attente de paiement
              </TableCell>
            </TableRow>
          ) : (
            factures.map((facture) => (
              <TableRow key={facture.id} className="group hover:bg-neutral-50">
                <TableCell className="font-medium">{facture.id}</TableCell>
                <TableCell>{facture.client.nom}</TableCell>
                <TableCell className="hidden md:table-cell">{facture.date}</TableCell>
                <TableCell>{formatMontant(facture.montant)}</TableCell>
                <TableCell>
                  {facture.montantPaye ? formatMontant(facture.montantPaye) : "0 FCFA"}
                </TableCell>
                <TableCell>{getStatusBadge(facture.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onOpenPaymentDialog(facture)}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      <span className="hidden sm:inline">Encaisser (Total)</span>
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => onOpenPartialPaymentDialog(facture)}
                      className="flex items-center gap-1"
                    >
                      <PartialIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Paiement partiel</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
