
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Facture } from "@/types/facture";
import { StatusBadge } from "./table/StatusBadge";
import { 
  MoreHorizontal, 
  Eye, 
  FileText, 
  Download, 
  Printer,
  Edit,
  Trash2,
  CreditCard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { fr } from 'date-fns/locale';
import { downloadFacturePDF, printFacturePDF } from "@/utils/pdfUtils";
import { useNavigate } from "react-router-dom";

interface FacturesTableProps {
  factures: Facture[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDeleteInvoice: (id: string) => void;
  onPaiementClick: (facture: Facture) => void;
}

export const FacturesTable = ({
  factures,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onDeleteInvoice,
  onPaiementClick
}: FacturesTableProps) => {
  const navigate = useNavigate();
  const totalPages = Math.ceil(totalCount / pageSize);

  // Formatage du montant
  const formatMontant = (montant: number) => {
    return montant.toLocaleString('fr-FR') + " FCFA";
  };

  // Formatage de la date
  const formatDate = (dateStr: string) => {
    try {
      // Vérifier si la date est déjà au format ISO
      if (dateStr.includes('T')) {
        return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
      }
      
      // Sinon, essayer de la parser au format YYYY-MM-DD
      return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      // En cas d'erreur, retourner la date telle quelle
      return dateStr;
    }
  };

  // Pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationItem key={page}>
              <PaginationLink 
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  // Message si aucune facture
  if (factures.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Aucune facture trouvée</h3>
        <p className="text-muted-foreground">
          Aucune facture ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factures.map((facture) => (
              <TableRow key={facture.id}>
                <TableCell className="font-medium">{facture.id}</TableCell>
                <TableCell>{facture.client_nom}</TableCell>
                <TableCell>{formatDate(facture.date)}</TableCell>
                <TableCell>{formatDate(facture.echeance)}</TableCell>
                <TableCell className="text-right">{formatMontant(facture.montant)}</TableCell>
                <TableCell><StatusBadge status={facture.status} /></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/facturation/${facture.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </DropdownMenuItem>
                      
                      {facture.status !== "paye" && (
                        <>
                          <DropdownMenuItem onClick={() => navigate(`/facturation/${facture.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Modifier
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem onClick={() => onPaiementClick(facture)}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Enregistrer un paiement
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem onClick={() => printFacturePDF(facture)}>
                        <Printer className="mr-2 h-4 w-4" />
                        Imprimer
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem onClick={() => downloadFacturePDF(facture)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger PDF
                      </DropdownMenuItem>
                      
                      {facture.status !== "paye" && (
                        <>
                          <DropdownMenuSeparator />
                          
                          <DropdownMenuItem 
                            className="text-destructive" 
                            onClick={() => onDeleteInvoice(facture.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {renderPagination()}
    </div>
  );
};
