
import { Facture } from "@/types/facture";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Printer, Trash2 } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onDeleteFacture: (factureId: string) => void;
  isLoading: boolean;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500 hover:bg-green-600 transition-all duration-300">Payée</Badge>;
    case "partiellement_payée":
      return <Badge className="bg-amber-500 hover:bg-amber-600 transition-all duration-300">Partiellement payée</Badge>;
    case "en_attente":
      return <Badge variant="secondary" className="transition-all duration-300">En attente</Badge>;
    case "envoyée":
      return <Badge variant="outline" className="transition-all duration-300">Envoyée</Badge>;
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
  onDeleteFacture,
  isLoading,
}: FactureTableProps) => {
  // Calculer le montant total des factures
  const totalMontant = factures.reduce((sum, facture) => sum + facture.montant, 0);
  
  return (
    <Card className="mb-6 animate-fade-in shadow-sm hover:shadow transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Liste des factures</CardTitle>
        <CardDescription>
          {!isLoading && `${factures.length} facture(s) trouvée(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">N° Facture</TableHead>
                <TableHead className="whitespace-nowrap">Client</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Échéance</TableHead>
                <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
                <TableHead className="whitespace-nowrap">Statut</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Squelette de chargement
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8 hidden sm:block" />
                        <Skeleton className="h-8 w-8 hidden sm:block" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : factures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              ) : (
                factures.map((facture) => (
                  <TableRow 
                    key={facture.id} 
                    className="group hover:bg-neutral-50 transition-all duration-300 animate-fade-in"
                  >
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.date}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.echeance}</TableCell>
                    <TableCell className="min-w-32">{formatMontant(facture.montant)}</TableCell>
                    <TableCell>{getStatusBadge(facture.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(facture)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPrintInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDownloadInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        {/* N'afficher le bouton de suppression que si la facture n'est pas payée */}
                        {facture.status !== "payée" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDeleteFacture(facture.id)}
                            className="opacity-70 group-hover:opacity-100 transition-all duration-300 text-destructive hidden sm:flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            {factures.length > 0 && !isLoading && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold">Total</TableCell>
                  <TableCell colSpan={1} className="hidden md:table-cell"></TableCell>
                  <TableCell className="font-semibold min-w-32">{formatMontant(totalMontant)}</TableCell>
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
