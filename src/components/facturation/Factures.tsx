
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash 
} from "lucide-react";

// Données d'exemple pour les factures
const facturesExemple = [
  { 
    id: "F-2023-001", 
    client: "Société ABC", 
    date: "15/05/2023", 
    montant: 450000, 
    status: "payée" 
  },
  { 
    id: "F-2023-002", 
    client: "Entreprise XYZ", 
    date: "22/05/2023", 
    montant: 175000, 
    status: "en_attente" 
  },
  { 
    id: "F-2023-003", 
    client: "Cabinet DEF", 
    date: "01/06/2023", 
    montant: 325000, 
    status: "partiellement_payée" 
  },
  { 
    id: "F-2023-004", 
    client: "M. Dupont", 
    date: "12/06/2023", 
    montant: 85000, 
    status: "envoyée" 
  },
];

const Factures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFactures = facturesExemple.filter(facture => 
    facture.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500">Payée</Badge>;
      case "en_attente":
        return <Badge variant="outline">En attente</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-amber-500">Partiellement payée</Badge>;
      case "envoyée":
        return <Badge className="bg-blue-500">Envoyée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5" /> 
          Gestion des factures
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredFactures.length > 0 ? (
              filteredFactures.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell className="font-medium">{facture.id}</TableCell>
                  <TableCell>{facture.client}</TableCell>
                  <TableCell>{facture.date}</TableCell>
                  <TableCell>{formatMontant(facture.montant)}</TableCell>
                  <TableCell>{getStatusBadge(facture.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucune facture trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Factures;
