
import { CheckCircle2, ListChecks, MoreVertical, Eye, Edit, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Collaborateur } from "@/types/collaborateur";

interface CollaborateurListProps {
  collaborateurs: Collaborateur[];
  onDelete: (id: string) => void;
}

export function CollaborateurList({ collaborateurs, onDelete }: CollaborateurListProps) {
  const navigate = useNavigate();

  const handleViewProfile = (id: string) => {
    navigate(`/collaborateurs/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/collaborateurs/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Poste</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Date d'entrée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Tâches en cours</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collaborateurs.map((collaborateur) => (
            <TableRow key={collaborateur.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {collaborateur.prenom[0]}
                      {collaborateur.nom[0]}
                    </span>
                  </div>
                  {collaborateur.prenom} {collaborateur.nom}
                </div>
              </TableCell>
              <TableCell>{collaborateur.poste}</TableCell>
              <TableCell>{collaborateur.email}</TableCell>
              <TableCell>
                {new Date(collaborateur.dateentree).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                    collaborateur.statut === "actif"
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {collaborateur.statut === "actif" ? "Actif" : "Inactif"}
                </span>
              </TableCell>
              <TableCell>
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4 text-neutral-500" />
                  {collaborateur.tachesencours}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleViewProfile(collaborateur.id)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir le profil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => handleEdit(collaborateur.id)}
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600 cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                        >
                          <Trash className="h-4 w-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Cette action est irréversible. Cela supprimera définitivement le collaborateur {collaborateur.prenom} {collaborateur.nom} et toutes ses données associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(collaborateur.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
