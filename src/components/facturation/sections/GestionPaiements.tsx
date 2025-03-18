
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileUp, Filter, CreditCard, Clock, ReceiptCheck } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const GestionPaiements = () => {
  // Données mockées pour l'exemple
  const paiementsData = [
    { id: "P2024-001", facture: "F2024-001", client: "SARL TechPro", date: "2024-02-20", montant: 2500000, methode: "Virement bancaire", status: "confirmé" },
    { id: "P2024-002", facture: "F2024-003", client: "EURL ConseilPlus", date: "2024-02-10", montant: 1500000, methode: "Chèque", status: "en_attente" },
    { id: "P2024-003", facture: "F2024-002", client: "SAS WebDev", date: "2024-02-05", montant: 800000, methode: "Espèces", status: "confirmé" },
  ];

  const formatMontant = (montant: number): string => {
    return `${montant.toLocaleString()} F CFA`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmé":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Confirmé</span>;
      case "en_attente":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">En attente</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Rechercher un paiement..." className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="confirmé">Confirmés</SelectItem>
              <SelectItem value="en_attente">En attente</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileUp className="w-4 h-4" />
            Exporter
          </Button>
          <Button className="flex items-center gap-2">
            <span className="w-4 h-4">+</span>
            Nouveau paiement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ReceiptCheck className="w-5 h-5 text-green-600" />
              Paiements confirmés
            </CardTitle>
            <CardDescription>Total des paiements confirmés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMontant(3300000)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Paiements en attente
            </CardTitle>
            <CardDescription>Total des paiements en attente</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMontant(1500000)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
              Méthodes de paiement
            </CardTitle>
            <CardDescription>Répartition par type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Virement</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="flex justify-between">
                <span>Chèque</span>
                <span className="font-medium">25%</span>
              </div>
              <div className="flex justify-between">
                <span>Espèces</span>
                <span className="font-medium">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm hover:shadow transition-all duration-300">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Liste des paiements</CardTitle>
          <CardDescription>
            {paiementsData.length} paiement(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Réf. Paiement</TableHead>
                  <TableHead className="whitespace-nowrap">N° Facture</TableHead>
                  <TableHead className="whitespace-nowrap">Client</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Date</TableHead>
                  <TableHead className="whitespace-nowrap min-w-32">Montant</TableHead>
                  <TableHead className="whitespace-nowrap hidden md:table-cell">Méthode</TableHead>
                  <TableHead className="whitespace-nowrap">Statut</TableHead>
                  <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiementsData.map((paiement) => (
                  <TableRow key={paiement.id} className="group hover:bg-neutral-50">
                    <TableCell className="font-medium">{paiement.id}</TableCell>
                    <TableCell>{paiement.facture}</TableCell>
                    <TableCell>{paiement.client}</TableCell>
                    <TableCell className="hidden md:table-cell">{paiement.date}</TableCell>
                    <TableCell>{formatMontant(paiement.montant)}</TableCell>
                    <TableCell className="hidden md:table-cell">{paiement.methode}</TableCell>
                    <TableCell>{getStatusBadge(paiement.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Détails</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
