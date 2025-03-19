
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { ClientStatusBadge } from "./ClientStatusBadge";
import { Facture } from "@/types/facture";

interface ClientTableProps {
  clients: Array<{
    id: string;
    nom: string;
    facturesCount: number;
    montantTotal: number;
    montantPaye: number;
    montantDu: number;
    status: Facture["status"];
    derniereFacture?: string;
  }>;
  onViewClient: (clientId: string) => void;
}

export const ClientTable = ({ clients, onViewClient }: ClientTableProps) => {
  // Fonction pour formater les montants
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR').format(montant) + " XAF";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Factures</TableHead>
          <TableHead>Montant total</TableHead>
          <TableHead>Montant payé</TableHead>
          <TableHead>Montant dû</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.length > 0 ? (
          clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.nom}</TableCell>
              <TableCell>{client.facturesCount}</TableCell>
              <TableCell>{formatMontant(client.montantTotal)}</TableCell>
              <TableCell>{formatMontant(client.montantPaye)}</TableCell>
              <TableCell>{formatMontant(client.montantDu)}</TableCell>
              <TableCell><ClientStatusBadge status={client.status} /></TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onViewClient(client.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {client.derniereFacture && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(`/facturation?tab=factures&id=${client.derniereFacture}`, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Aucun client avec des factures
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
