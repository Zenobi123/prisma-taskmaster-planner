import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Client {
  id: string;
  raisonSociale: string;
  siren: string;
  email: string;
  telephone: string;
  adresse: string;
  ville: string;
  secteur: string;
  statut: "actif" | "inactif";
}

interface ClientListProps {
  clients: Client[];
}

export function ClientList({ clients }: ClientListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Raison sociale</TableHead>
          <TableHead>SIREN</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Secteur</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell className="font-medium">{client.raisonSociale}</TableCell>
            <TableCell>{client.siren}</TableCell>
            <TableCell>{client.email}</TableCell>
            <TableCell>{client.telephone}</TableCell>
            <TableCell>{client.ville}</TableCell>
            <TableCell>{client.secteur}</TableCell>
            <TableCell>
              <Badge
                variant={client.statut === "actif" ? "success" : "secondary"}
              >
                {client.statut}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}