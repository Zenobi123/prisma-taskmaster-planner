
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";
import { Client } from "@/types/client";

interface ClientListProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientList({ clients, onView, onEdit, onDelete }: ClientListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Nom/Raison sociale</TableHead>
          <TableHead>NIU</TableHead>
          <TableHead>Centre</TableHead>
          <TableHead>Ville</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Secteur</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client.id}>
            <TableCell>
              <Badge 
                variant="outline"
                className={
                  client.type === "physique"
                    ? "bg-[#D3E4FD] border-[#D3E4FD] text-blue-700"
                    : "bg-[#FEC6A1] border-[#FEC6A1] text-orange-700"
                }
              >
                {client.type === "physique" ? "Physique" : "Morale"}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {client.type === "physique" ? client.nom : client.raisonsociale}
            </TableCell>
            <TableCell>{client.niu}</TableCell>
            <TableCell>{client.centrerattachement}</TableCell>
            <TableCell>{client.adresse.ville}</TableCell>
            <TableCell>{client.contact.telephone}</TableCell>
            <TableCell>{client.secteuractivite}</TableCell>
            <TableCell>
              <Badge variant={client.statut === "actif" ? "success" : "secondary"}>
                {client.statut}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Ouvrir le menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(client)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir le profil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEdit(client)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(client)}>
                    <Trash className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
