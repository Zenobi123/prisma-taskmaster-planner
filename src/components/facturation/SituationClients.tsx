
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
  ArrowUpDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart } from "@/components/ui/chart";

// Données d'exemple pour la situation des clients
const clientsExemple = [
  { 
    id: "C001", 
    nom: "Société ABC", 
    facturesMontant: 750000, 
    paiementsMontant: 450000, 
    solde: 300000,
    status: "partiel"
  },
  { 
    id: "C002", 
    nom: "Entreprise XYZ", 
    facturesMontant: 175000, 
    paiementsMontant: 175000, 
    solde: 0,
    status: "àjour"
  },
  { 
    id: "C003", 
    nom: "Cabinet DEF", 
    facturesMontant: 325000, 
    paiementsMontant: 150000, 
    solde: 175000,
    status: "partiel"
  },
  { 
    id: "C004", 
    nom: "M. Dupont", 
    facturesMontant: 85000, 
    paiementsMontant: 0, 
    solde: 85000,
    status: "retard"
  },
];

// Données pour le graphique
const chartData = [
  {
    name: "À jour",
    total: 1,
  },
  {
    name: "Partiellement payé",
    total: 2,
  },
  {
    name: "En retard",
    total: 1,
  },
];

const SituationClients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("nom");
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };
  
  const filteredClients = clientsExemple
    .filter(client => 
      client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase())
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

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
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
                <TableHead className="w-[100px]">ID</TableHead>
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
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.id}</TableCell>
                    <TableCell>{client.nom}</TableCell>
                    <TableCell>{formatMontant(client.facturesMontant)}</TableCell>
                    <TableCell>{formatMontant(client.paiementsMontant)}</TableCell>
                    <TableCell>{formatMontant(client.solde)}</TableCell>
                    <TableCell>{getStatusBadge(client.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Répartition des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart
            data={chartData}
            index="name"
            categories={["total"]}
            colors={["#84A98C"]}
            yAxisWidth={48}
            height={300}
          />
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                À jour
              </span>
              <span className="font-medium">1</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-amber-500 mr-2"></span>
                Partiellement payé
              </span>
              <span className="font-medium">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                En retard
              </span>
              <span className="font-medium">1</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SituationClients;
