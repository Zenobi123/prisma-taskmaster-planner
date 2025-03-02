
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
      return <Badge className="bg-green-500 hover:bg-green-600 transition-colors">Payée</Badge>;
    case "en_attente":
      return <Badge variant="secondary" className="transition-colors">En attente</Badge>;
    case "envoyée":
      return <Badge variant="outline" className="transition-colors">Envoyée</Badge>;
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
    <Card className="mb-6 animate-fade-in shadow-sm hover:shadow transition-all duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Liste des factures</CardTitle>
        <CardDescription>
          {factures.length} facture(s) trouvée(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">N° Facture</TableHead>
                <TableHead className="whitespace-nowrap">Client</TableHead>
                <TableHead className="whitespace-nowrap">Date</TableHead>
                <TableHead className="whitespace-nowrap">Échéance</TableHead>
                <TableHead className="whitespace-nowrap">Montant</TableHead>
                <TableHead className="whitespace-nowrap">Statut</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
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
                  <TableRow 
                    key={facture.id} 
                    className="group hover:bg-neutral-50 transition-colors duration-200"
                  >
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell className="whitespace-nowrap">{facture.date}</TableCell>
                    <TableCell className="whitespace-nowrap">{facture.echeance}</TableCell>
                    <TableCell>{formatMontant(facture.montant)}</TableCell>
                    <TableCell>{getStatusBadge(facture.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(facture)}
                          className="opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPrintInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-opacity"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDownloadInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-opacity"
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
                  <TableCell colSpan={4} className="font-semibold">Total</TableCell>
                  <TableCell className="font-semibold">{formatMontant(totalMontant)}</TableCell>
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
