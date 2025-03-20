
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
import { generatePDF } from "@/utils/pdfUtils";
import { Facture } from "@/types/facture";

// Données d'exemple pour les factures
const facturesExemple = [
  { 
    id: "F-2023-001", 
    client_id: "client1",
    client: {
      nom: "Société ABC",
      adresse: "123 Rue Principale, Douala",
      telephone: "694123456",
      email: "contact@societeabc.com"
    }, 
    date: "15/05/2023",
    echeance: "15/06/2023", 
    montant: 450000, 
    montant_paye: 450000,
    status: "payée",
    prestations: [
      { description: "Prestation 1", quantite: 1, montant: 250000 },
      { description: "Prestation 2", quantite: 2, montant: 100000 }
    ]
  },
  { 
    id: "F-2023-002", 
    client_id: "client2",
    client: {
      nom: "Entreprise XYZ",
      adresse: "456 Avenue Centrale, Yaoundé",
      telephone: "677654321",
      email: "info@xyz.com"
    }, 
    date: "22/05/2023",
    echeance: "22/06/2023", 
    montant: 175000,
    montant_paye: 0, 
    status: "en_attente",
    prestations: [
      { description: "Consultation", quantite: 1, montant: 175000 }
    ]
  },
  { 
    id: "F-2023-003", 
    client_id: "client3",
    client: {
      nom: "Cabinet DEF",
      adresse: "789 Boulevard Ouest, Bafoussam",
      telephone: "698765432",
      email: "cabinet@def.com"
    }, 
    date: "01/06/2023",
    echeance: "01/07/2023", 
    montant: 325000,
    montant_paye: 150000, 
    status: "partiellement_payée",
    prestations: [
      { description: "Audit comptable", quantite: 1, montant: 325000 }
    ]
  },
  { 
    id: "F-2023-004", 
    client_id: "client4",
    client: {
      nom: "M. Dupont",
      adresse: "101 Rue des Jardins, Limbé",
      telephone: "651234567",
      email: "dupont@mail.com"
    }, 
    date: "12/06/2023",
    echeance: "12/07/2023", 
    montant: 85000,
    montant_paye: 0, 
    status: "envoyée",
    prestations: [
      { description: "Conseil fiscal", quantite: 1, montant: 85000 }
    ]
  },
];

const Factures = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredFactures = facturesExemple.filter(facture => 
    facture.client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "payée":
        return <Badge className="bg-green-500 hover:bg-green-600">Payée</Badge>;
      case "en_attente":
        return <Badge variant="outline" className="text-neutral-600 border-neutral-400">En attente</Badge>;
      case "partiellement_payée":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Partiellement payée</Badge>;
      case "envoyée":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Envoyée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  const handleVoirFacture = (facture: any) => {
    generatePDF(facture as Facture);
  };

  const handleTelechargerFacture = (facture: any) => {
    generatePDF(facture as Facture, true);
  };

  return (
    <Card className="shadow-sm border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 bg-gray-50 border-b">
        <CardTitle className="text-xl flex items-center gap-2 text-gray-800">
          <FileText className="h-5 w-5 text-[#84A98C]" /> 
          Gestion des factures
        </CardTitle>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-9 w-64 border-gray-300 focus:border-[#84A98C] focus:ring-[#84A98C]/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-[#84A98C] hover:bg-[#6B8E74] shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="font-medium text-gray-700">N° Facture</TableHead>
                <TableHead className="font-medium text-gray-700">Client</TableHead>
                <TableHead className="font-medium text-gray-700">Date</TableHead>
                <TableHead className="font-medium text-gray-700">Montant</TableHead>
                <TableHead className="font-medium text-gray-700">Statut</TableHead>
                <TableHead className="text-right font-medium text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFactures.length > 0 ? (
                filteredFactures.map((facture) => (
                  <TableRow key={facture.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-800">{facture.id}</TableCell>
                    <TableCell>{facture.client.nom}</TableCell>
                    <TableCell>{facture.date}</TableCell>
                    <TableCell className="font-medium">{formatMontant(facture.montant)}</TableCell>
                    <TableCell>{getStatusBadge(facture.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleVoirFacture(facture)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 hover:bg-green-50" onClick={() => handleTelechargerFacture(facture)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-amber-500 hover:text-amber-700 hover:bg-amber-50">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default Factures;
