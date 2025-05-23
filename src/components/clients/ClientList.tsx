
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Archive, RotateCcw, Trash2 } from "lucide-react";
import { Client } from "@/types/client";

interface ClientListProps {
  clients: Client[];
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
  onArchive: (client: Client) => void;
  onRestore?: (client: Client) => void;
  onDelete?: (client: Client) => void;
  isMobile?: boolean;
}

export function ClientList({ clients, onView, onEdit, onArchive, onRestore, onDelete, isMobile }: ClientListProps) {
  // Pour le mode mobile, une présentation adaptée pourrait être ajoutée ici
  // Mais pour cette tâche, nous nous concentrons uniquement sur l'export

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
          <TableRow key={client.id} className={client.statut === 'archive' ? 'opacity-60' : ''}>
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
              <Badge 
                variant={
                  client.statut === "actif" 
                    ? "success" 
                    : client.statut === "archive" 
                      ? "destructive" 
                      : "secondary"
                }
              >
                {client.statut === "archive" ? "Archivé" : client.statut}
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
                  
                  {client.statut !== "archive" && (
                    <>
                      <DropdownMenuItem onClick={() => onEdit(client)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onArchive(client)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archiver
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {client.statut === "archive" && onRestore && (
                    <DropdownMenuItem onClick={() => onRestore(client)}>
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Restaurer
                    </DropdownMenuItem>
                  )}
                  
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(client)}
                        className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
