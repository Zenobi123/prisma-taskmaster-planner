
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
  Wallet, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash,
  CreditCard,
  Building,
  Banknote
} from "lucide-react";

// Données d'exemple pour les paiements
const paiementsExemple = [
  { 
    id: "P-2023-001", 
    facture: "F-2023-001",
    client: "Société ABC", 
    date: "20/05/2023", 
    montant: 450000, 
    mode: "virement" 
  },
  { 
    id: "P-2023-002", 
    facture: "F-2023-003",
    client: "Cabinet DEF", 
    date: "10/06/2023", 
    montant: 150000, 
    mode: "espèces" 
  },
  { 
    id: "P-2023-003", 
    facture: "F-2023-002",
    client: "Entreprise XYZ", 
    date: "15/06/2023", 
    montant: 175000, 
    mode: "chèque" 
  },
];

const Paiements = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredPaiements = paiementsExemple.filter(paiement => 
    paiement.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paiement.facture.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getModePaiementIcon = (mode: string) => {
    switch (mode) {
      case "virement":
        return <Building className="h-4 w-4 mr-1" />;
      case "espèces":
        return <Banknote className="h-4 w-4 mr-1" />;
      case "chèque":
        return <CreditCard className="h-4 w-4 mr-1" />;
      default:
        return <Wallet className="h-4 w-4 mr-1" />;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Wallet className="h-5 w-5" /> 
          Gestion des paiements
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
            <Plus className="mr-2 h-4 w-4" /> Nouveau paiement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Facture</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPaiements.length > 0 ? (
              filteredPaiements.map((paiement) => (
                <TableRow key={paiement.id}>
                  <TableCell className="font-medium">{paiement.id}</TableCell>
                  <TableCell>{paiement.facture}</TableCell>
                  <TableCell>{paiement.client}</TableCell>
                  <TableCell>{paiement.date}</TableCell>
                  <TableCell>{formatMontant(paiement.montant)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getModePaiementIcon(paiement.mode)}
                      <span className="capitalize">{paiement.mode}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
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
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun paiement trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Paiements;
