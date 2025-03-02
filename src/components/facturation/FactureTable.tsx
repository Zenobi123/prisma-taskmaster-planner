
import { Facture } from "@/types/facture";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
    case "en_attente":
      return <Badge variant="secondary">En attente</Badge>;
    case "envoyée":
      return <Badge variant="outline">Envoyée</Badge>;
    default:
      return null;
  }
};

export const FactureTable = ({
  factures,
  formatMontant,
  onViewDetails,
  onPrintInvoice,
  onDownloadInvoice,
}: FactureTableProps) => {
  // Calculer le montant total des factures
  const totalMontant = factures.reduce((sum, facture) => sum + facture.montant, 0);
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Liste des factures</CardTitle>
        <CardDescription>
          {factures.length} facture(s) trouvée(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {factures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              ) : (
                factures.map((facture) => (
                  <TableRow key={facture.id} className="group">
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell>{facture.date}</TableCell>
                    <TableCell>{facture.echeance}</TableCell>
                    <TableCell>{formatMontant(facture.montant)}</TableCell>
                    <TableCell>{getStatusBadge(facture.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(facture)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPrintInvoice(facture.id)}
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDownloadInvoice(facture.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {factures.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4}>Total</TableCell>
                  <TableCell>{formatMontant(totalMontant)}</TableCell>
                  <TableCell colSpan={2}></TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
