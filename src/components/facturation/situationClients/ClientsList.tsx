
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Users, 
  Search, 
  Eye, 
  ArrowUpDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMontant } from "@/utils/formatUtils";
import { ClientFinancialSummary } from "@/types/clientFinancial";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ClientsListProps {
  clientsSummary: ClientFinancialSummary[];
  isLoading: boolean;
  onViewDetails: (clientId: string) => void;
}

const ClientsList = ({ clientsSummary, isLoading, onViewDetails }: ClientsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nom");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const filteredClients = clientsSummary
    .filter(client => 
      client.nom?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof typeof a];
      const bValue = b[sortColumn as keyof typeof b];
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      return 0;
    });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "àjour":
        return <Badge className="bg-green-500">À jour</Badge>;
      case "partiel":
        return <Badge className="bg-amber-500">Partiellement payé</Badge>;
      case "retard":
        return <Badge variant="destructive">En retard</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Users className="h-5 w-5" /> 
          Situation financière des clients
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher un client..."
            className="pl-8 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                  onClick={() => handleSort('nom')}>
                  Client
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                  onClick={() => handleSort('facturesMontant')}>
                  Total facturé
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                  onClick={() => handleSort('paiementsMontant')}>
                  Total payé
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" className="p-0 font-semibold flex items-center gap-1"
                  onClick={() => handleSort('solde')}>
                  Solde
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Chargement des données...
                </TableCell>
              </TableRow>
            ) : paginatedClients.length > 0 ? (
              paginatedClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.nom}</TableCell>
                  <TableCell>{formatMontant(client.facturesMontant)}</TableCell>
                  <TableCell>{formatMontant(client.paiementsMontant)}</TableCell>
                  <TableCell className={client.solde >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatMontant(client.solde)}
                  </TableCell>
                  <TableCell>{getStatusBadge(client.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => onViewDetails(client.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucun client trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink 
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientsList;
