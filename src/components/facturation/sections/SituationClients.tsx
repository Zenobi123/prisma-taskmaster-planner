import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileUp, Filter, UserCheck, AlertTriangle, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const SituationClients = () => {
  // Données mockées pour l'exemple
  const clientsData = [
    { id: "client-001", nom: "SARL TechPro", encours: 2500000, solde: 0, statut: "à jour", retard: 0 },
    { id: "client-002", nom: "SAS WebDev", encours: 3800000, solde: 1800000, statut: "en_retard", retard: 15 },
    { id: "client-003", nom: "EURL ConseilPlus", encours: 3200000, solde: 3200000, statut: "impayé", retard: 30 },
    { id: "client-004", nom: "SA Construct", encours: 1500000, solde: 500000, statut: "en_retard", retard: 5 },
    { id: "client-005", nom: "SARL MédiaGroup", encours: 4200000, solde: 0, statut: "à jour", retard: 0 },
  ];

  const formatMontant = (montant: number): string => {
    return `${montant.toLocaleString()} F CFA`;
  };

  const getStatutClient = (statut: string) => {
    switch (statut) {
      case "à jour":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">À jour</span>;
      case "en_retard":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">En retard</span>;
      case "impayé":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Impayé</span>;
      default:
        return null;
    }
  };

  const totalEncours = clientsData.reduce((total, client) => total + client.encours, 0);
  const totalSolde = clientsData.reduce((total, client) => total + client.solde, 0);
  const tauxRecouvrement = ((totalEncours - totalSolde) / totalEncours) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Rechercher un client..." className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-2">
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
            Nouvelle relance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              Clients à jour
            </CardTitle>
            <CardDescription>Nombre de clients sans impayés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clientsData.filter(c => c.statut === "à jour").length} clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Clients en retard
            </CardTitle>
            <CardDescription>Nombre de clients en retard de paiement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {clientsData.filter(c => c.statut === "en_retard").length} clients
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Impayés
            </CardTitle>
            <CardDescription>Total des impayés clients</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMontant(totalSolde)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Taux de recouvrement</h3>
            <p className="text-sm text-muted-foreground">Pourcentage des factures recouvrées</p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm font-medium">{tauxRecouvrement.toFixed(1)}%</span>
            </div>
            <Progress value={tauxRecouvrement} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Total facturé</p>
              <p className="text-lg font-medium">{formatMontant(totalEncours)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reste à payer</p>
              <p className="text-lg font-medium">{formatMontant(totalSolde)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="tous" className="w-full">
        <TabsList>
          <TabsTrigger value="tous">Tous les clients</TabsTrigger>
          <TabsTrigger value="jour">À jour</TabsTrigger>
          <TabsTrigger value="retard">En retard</TabsTrigger>
          <TabsTrigger value="impayes">Impayés</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tous" className="mt-4">
          <Card className="shadow-sm hover:shadow transition-all duration-300">
            <CardContent className="p-0">
              <div className="rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Client</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Total facturé</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Solde dû</TableHead>
                      <TableHead className="whitespace-nowrap">Statut</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Retard (jours)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData.map((client) => (
                      <TableRow key={client.id} className="group hover:bg-neutral-50">
                        <TableCell className="font-medium">{client.nom}</TableCell>
                        <TableCell>{formatMontant(client.encours)}</TableCell>
                        <TableCell>{formatMontant(client.solde)}</TableCell>
                        <TableCell>{getStatutClient(client.statut)}</TableCell>
                        <TableCell className="whitespace-nowrap hidden md:table-cell">
                          {client.retard > 0 ? client.retard : "-"}
                        </TableCell>
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
        </TabsContent>
        
        <TabsContent value="jour" className="mt-4">
          <Card className="shadow-sm hover:shadow transition-all duration-300">
            <CardContent className="p-0">
              <div className="rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Client</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Total facturé</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Solde dû</TableHead>
                      <TableHead className="whitespace-nowrap">Statut</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Retard (jours)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData
                      .filter(client => client.statut === "à jour")
                      .map((client) => (
                        <TableRow key={client.id} className="group hover:bg-neutral-50">
                          <TableCell className="font-medium">{client.nom}</TableCell>
                          <TableCell>{formatMontant(client.encours)}</TableCell>
                          <TableCell>{formatMontant(client.solde)}</TableCell>
                          <TableCell>{getStatutClient(client.statut)}</TableCell>
                          <TableCell className="whitespace-nowrap hidden md:table-cell">-</TableCell>
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
        </TabsContent>
        
        <TabsContent value="retard" className="mt-4">
          <Card className="shadow-sm hover:shadow transition-all duration-300">
            <CardContent className="p-0">
              <div className="rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Client</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Total facturé</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Solde dû</TableHead>
                      <TableHead className="whitespace-nowrap">Statut</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Retard (jours)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData
                      .filter(client => client.statut === "en_retard")
                      .map((client) => (
                        <TableRow key={client.id} className="group hover:bg-neutral-50">
                          <TableCell className="font-medium">{client.nom}</TableCell>
                          <TableCell>{formatMontant(client.encours)}</TableCell>
                          <TableCell>{formatMontant(client.solde)}</TableCell>
                          <TableCell>{getStatutClient(client.statut)}</TableCell>
                          <TableCell className="whitespace-nowrap hidden md:table-cell">{client.retard}</TableCell>
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
        </TabsContent>
        
        <TabsContent value="impayes" className="mt-4">
          <Card className="shadow-sm hover:shadow transition-all duration-300">
            <CardContent className="p-0">
              <div className="rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Client</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Total facturé</TableHead>
                      <TableHead className="whitespace-nowrap min-w-32">Solde dû</TableHead>
                      <TableHead className="whitespace-nowrap">Statut</TableHead>
                      <TableHead className="whitespace-nowrap hidden md:table-cell">Retard (jours)</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientsData
                      .filter(client => client.statut === "impayé")
                      .map((client) => (
                        <TableRow key={client.id} className="group hover:bg-neutral-50">
                          <TableCell className="font-medium">{client.nom}</TableCell>
                          <TableCell>{formatMontant(client.encours)}</TableCell>
                          <TableCell>{formatMontant(client.solde)}</TableCell>
                          <TableCell>{getStatutClient(client.statut)}</TableCell>
                          <TableCell className="whitespace-nowrap hidden md:table-cell">{client.retard}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
