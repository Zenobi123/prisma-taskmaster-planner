
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "@/services/facture/clientService";
import { useFactures } from "@/hooks/useFactures";
import { StatusBadge } from "@/components/facturation/table/StatusBadge";
import { formatDate, formatMontant } from "@/components/facturation/table/utils/formatters";

export const ClientsSituation = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | undefined>(undefined);
  
  // Récupération des clients
  const { data: clients = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });

  // Récupération des factures du client sélectionné
  const { factures, isLoading } = useFactures({ 
    clientId: selectedClientId
  });

  // Calcul des statistiques du client
  const stats = {
    totalFactures: factures.length,
    totalMontant: factures.reduce((sum, f) => sum + f.montant, 0),
    totalPaye: factures.reduce((sum, f) => sum + (f.montant_paye || 0), 0),
    enRetard: factures.filter(f => 
      f.status !== "paye" && 
      new Date(f.echeance) < new Date()
    ).length,
  };
  
  // Factures par statut
  const facturesPayees = factures.filter(f => f.status === "paye");
  const facturesNonPayees = factures.filter(f => f.status === "non_paye");
  const facturesPartielles = factures.filter(f => f.status === "partiellement_paye");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Situation des clients</CardTitle>
          <CardDescription>
            Consultez l'état des paiements pour chaque client.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <Label htmlFor="clientSelect">Sélectionner un client</Label>
            <Select 
              onValueChange={(value) => setSelectedClientId(value)} 
              value={selectedClientId}
            >
              <SelectTrigger id="clientSelect" className="w-full md:w-1/2">
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedClientId ? (
            isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Chargement des données...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{formatMontant(stats.totalMontant)}</div>
                      <p className="text-muted-foreground">Montant total facturé</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{formatMontant(stats.totalPaye)}</div>
                      <p className="text-muted-foreground">Montant total payé</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">{formatMontant(stats.totalMontant - stats.totalPaye)}</div>
                      <p className="text-muted-foreground">Reste à payer</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold text-orange-500">{stats.enRetard}</div>
                      <p className="text-muted-foreground">Factures en retard</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Tabs defaultValue="toutes" className="w-full">
                  <TabsList>
                    <TabsTrigger value="toutes">Toutes ({factures.length})</TabsTrigger>
                    <TabsTrigger value="payees">Payées ({facturesPayees.length})</TabsTrigger>
                    <TabsTrigger value="partielles">Partiellement payées ({facturesPartielles.length})</TabsTrigger>
                    <TabsTrigger value="nonpayees">Non payées ({facturesNonPayees.length})</TabsTrigger>
                  </TabsList>
                  
                  {["toutes", "payees", "partielles", "nonpayees"].map(tab => {
                    let facturesToShow;
                    switch(tab) {
                      case "payees": facturesToShow = facturesPayees; break;
                      case "partielles": facturesToShow = facturesPartielles; break;
                      case "nonpayees": facturesToShow = facturesNonPayees; break;
                      default: facturesToShow = factures;
                    }
                    
                    return (
                      <TabsContent key={tab} value={tab}>
                        {facturesToShow.length === 0 ? (
                          <div className="text-center p-8 border rounded-md">
                            <p className="text-muted-foreground">Aucune facture à afficher</p>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[120px]">N° Facture</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Échéance</TableHead>
                                <TableHead className="text-right">Montant</TableHead>
                                <TableHead className="text-right">Montant payé</TableHead>
                                <TableHead>Statut</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {facturesToShow.map((facture) => (
                                <TableRow key={facture.id}>
                                  <TableCell>{facture.id}</TableCell>
                                  <TableCell>{formatDate(facture.date)}</TableCell>
                                  <TableCell>{formatDate(facture.echeance)}</TableCell>
                                  <TableCell className="text-right">{formatMontant(facture.montant)}</TableCell>
                                  <TableCell className="text-right">{formatMontant(facture.montant_paye || 0)}</TableCell>
                                  <TableCell>
                                    <StatusBadge status={facture.status} />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </div>
            )
          ) : (
            <div className="text-center p-8 border rounded-md">
              <p className="text-lg mb-2">Sélectionnez un client</p>
              <p className="text-muted-foreground">Veuillez sélectionner un client pour voir sa situation.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
