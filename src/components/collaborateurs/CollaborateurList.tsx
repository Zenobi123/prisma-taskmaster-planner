
import { CheckCircle2, ListChecks, MoreVertical, Eye, Edit, Trash, UserCheck, UserX } from "lucide-react";
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
  DropdownMenuSeparator,
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
import { useIsMobile } from "@/hooks/use-mobile";

interface CollaborateurListProps {
  collaborateurs: Collaborateur[];
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: "actif" | "inactif") => void;
}

function CollaborateurActions({
  collaborateur,
  onDelete,
  onStatusChange,
}: {
  collaborateur: Collaborateur;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, newStatus: "actif" | "inactif") => void;
}) {
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => navigate(`/collaborateurs/${collaborateur.id}`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Eye className="h-4 w-4" />
          Voir le profil
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigate(`/collaborateurs/${collaborateur.id}/edit`)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Edit className="h-4 w-4" />
          Modifier
        </DropdownMenuItem>

        {onStatusChange && (
          <>
            <DropdownMenuSeparator />
            {collaborateur.statut === "actif" ? (
              <DropdownMenuItem
                onClick={() => onStatusChange(collaborateur.id, "inactif")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserX className="h-4 w-4" />
                Désactiver
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onStatusChange(collaborateur.id, "actif")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <UserCheck className="h-4 w-4" />
                Activer
              </DropdownMenuItem>
            )}
          </>
        )}

        <DropdownMenuSeparator />
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
                Cette action est irréversible. Cela supprimera définitivement le collaborateur{" "}
                {collaborateur.prenom} {collaborateur.nom} et toutes ses données associées.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(collaborateur.id)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CollaborateurList({ collaborateurs, onDelete, onStatusChange }: CollaborateurListProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-3">
        {collaborateurs.map((collaborateur) => (
          <div
            key={collaborateur.id}
            className="bg-white rounded-lg border border-neutral-200 p-3 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-primary font-semibold text-sm">
                {collaborateur.prenom[0]}
                {collaborateur.nom[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">
                    {collaborateur.prenom} {collaborateur.nom}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{collaborateur.poste}</p>
                  <p className="text-xs text-neutral-400 truncate">{collaborateur.email}</p>
                </div>
                <CollaborateurActions
                  collaborateur={collaborateur}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    collaborateur.statut === "actif"
                      ? "bg-primary/10 text-primary"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {collaborateur.statut === "actif" ? "Actif" : "Inactif"}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
                  <ListChecks className="w-3.5 h-3.5" />
                  {collaborateur.tachesencours} tâche(s)
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
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
                <CollaborateurActions
                  collaborateur={collaborateur}
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
