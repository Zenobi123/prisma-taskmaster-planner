
import { Facture } from "@/types/facture";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Printer, Pencil, Trash2 } from "lucide-react";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface FactureTableProps {
  factures: Facture[];
  formatMontant: (montant: number) => string;
  onViewDetails: (facture: Facture) => void;
  onPrintInvoice: (factureId: string) => void;
  onDownloadInvoice: (factureId: string) => void;
  onUpdateStatus: (factureId: string, newStatus: 'payée' | 'en_attente' | 'envoyée') => void;
  onEditInvoice: (facture: Facture) => void;
  onDeleteInvoice: (factureId: string) => void;
}

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "payée":
      return <Badge className="bg-green-500 hover:bg-green-600 transition-all duration-300">Payée</Badge>;
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
  onUpdateStatus,
  onEditInvoice,
  onDeleteInvoice,
}: FactureTableProps) => {
  // Calculer le montant total des factures
  const totalMontant = factures.reduce((sum, facture) => sum + facture.montant, 0);
  
  return (
    <Card className="mb-6 animate-fade-in shadow-sm hover:shadow transition-all duration-300">
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
                <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
                <TableHead className="whitespace-nowrap hidden md:table-cell">Échéance</TableHead>
                <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
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
                    className="group hover:bg-neutral-50 transition-all duration-300 animate-fade-in"
                  >
                    <TableCell className="font-medium">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.date}</TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">{facture.echeance}</TableCell>
                    <TableCell className="min-w-32">{formatMontant(facture.montant)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 p-0 flex items-center gap-1">
                            {getStatusBadge(facture.status)}
                            <ChevronDown className="h-3 w-3 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[160px]">
                          <DropdownMenuItem 
                            onClick={() => onUpdateStatus(facture.id, 'en_attente')}
                            className={facture.status === 'en_attente' ? 'bg-accent text-accent-foreground' : ''}
                          >
                            En attente
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onUpdateStatus(facture.id, 'envoyée')}
                            className={facture.status === 'envoyée' ? 'bg-accent text-accent-foreground' : ''}
                          >
                            Envoyée
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => onUpdateStatus(facture.id, 'payée')}
                            className={facture.status === 'payée' ? 'bg-accent text-accent-foreground' : ''}
                          >
                            Payée
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetails(facture)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditInvoice(facture)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteInvoice(facture.id)}
                          className={`opacity-70 group-hover:opacity-100 transition-all duration-300 ${
                            facture.status !== 'en_attente' 
                              ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-inherit' 
                              : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          }`}
                          disabled={facture.status !== 'en_attente'}
                          title={facture.status === 'en_attente' ? "Supprimer" : "Seules les factures en attente peuvent être supprimées"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onPrintInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
                          title="Imprimer"
                        >
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDownloadInvoice(facture.id)}
                          className="opacity-70 group-hover:opacity-100 transition-all duration-300 hidden sm:flex"
                          title="Télécharger"
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
