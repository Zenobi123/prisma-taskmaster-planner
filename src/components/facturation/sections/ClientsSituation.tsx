
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { facturesMockData, formatMontant } from "@/data/factureData";

export const ClientsSituation = () => {
  // Regrouper les factures par client
  const clientsFactures = facturesMockData.reduce((acc, facture) => {
    const clientId = facture.client.id;
    if (!acc[clientId]) {
      acc[clientId] = {
        client: facture.client,
        montantTotal: 0,
        montantPaye: 0,
        factures: []
      };
    }
    
    acc[clientId].factures.push(facture);
    acc[clientId].montantTotal += facture.montant;
    if (facture.status === 'payée') {
      acc[clientId].montantPaye += facture.montant;
    }
    
    return acc;
  }, {} as Record<string, {
    client: typeof facturesMockData[0]['client'],
    montantTotal: number,
    montantPaye: number,
    factures: typeof facturesMockData
  }>);

  // Transformer en tableau et trier par montant dû (décroissant)
  const clientsArray = Object.values(clientsFactures)
    .map(data => ({
      ...data,
      montantDu: data.montantTotal - data.montantPaye
    }))
    .sort((a, b) => b.montantDu - a.montantDu);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Situation clients</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Balance des comptes clients</CardTitle>
          <CardDescription>
            Montants dus par client
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Factures</TableHead>
                <TableHead className="text-right">Montant total</TableHead>
                <TableHead className="text-right">Montant payé</TableHead>
                <TableHead className="text-right">Solde dû</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsArray.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Aucune donnée disponible
                  </TableCell>
                </TableRow>
              ) : (
                clientsArray.map((clientData) => (
                  <TableRow key={clientData.client.id} className="group hover:bg-neutral-50">
                    <TableCell className="font-medium">{clientData.client.nom}</TableCell>
                    <TableCell>{clientData.factures.length}</TableCell>
                    <TableCell className="text-right">{formatMontant(clientData.montantTotal)}</TableCell>
                    <TableCell className="text-right text-green-600">{formatMontant(clientData.montantPaye)}</TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                      {formatMontant(clientData.montantDu)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
