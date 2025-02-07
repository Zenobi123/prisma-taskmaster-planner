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
import { useToast } from "@/components/ui/use-toast";
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

interface Collaborateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  dateEntree: string;
  statut: "actif" | "inactif";
  tachesEnCours: number;
  permissions: {
    module: string;
    niveau: string;
  }[];
}

interface CollaborateurListProps {
  collaborateurs: Collaborateur[];
}

export function CollaborateurList({ collaborateurs }: CollaborateurListProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewProfile = (id: string) => {
    navigate(`/collaborateurs/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/collaborateurs/${id}/edit`);
  };

  const handleDelete = (collaborateur: Collaborateur) => {
    toast({
      title: "Collaborateur supprimé",
      description: `${collaborateur.prenom} ${collaborateur.nom} a été supprimé avec succès.`,
    });
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
                {new Date(collaborateur.dateEntree).toLocaleDateString()}
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
                  {collaborateur.tachesEnCours}
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
                      className="flex items-center gap-2"
                      onClick={() => handleViewProfile(collaborateur.id)}
                    >
                      <Eye className="h-4 w-4" />
                      Voir le profil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2"
                      onClick={() => handleEdit(collaborateur.id)}
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem 
                          className="flex items-center gap-2 text-red-600"
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
                            onClick={() => handleDelete(collaborateur)}
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
