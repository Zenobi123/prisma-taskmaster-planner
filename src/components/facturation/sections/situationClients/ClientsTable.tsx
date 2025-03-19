
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ClientsTableProps {
  clients: any[];
  formatMontant: (montant: number) => string;
  getStatutClient: (statut: string) => JSX.Element | null;
}

export const ClientsTable = ({ clients, formatMontant, getStatutClient }: ClientsTableProps) => {
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
              {clients.map((client) => (
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
  );
};
