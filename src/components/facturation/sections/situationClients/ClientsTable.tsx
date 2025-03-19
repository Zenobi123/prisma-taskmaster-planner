
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Facture } from "@/types/facture";
import { getStatutClient } from "./utils";

interface ClientsTableProps {
  clients: any[];
  factures: Facture[];
  formatMontant: (montant: number) => string;
}

export const ClientsTable = ({ clients, factures, formatMontant }: ClientsTableProps) => {
  return (
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
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
