import { useState } from "react";
import { Plus, Search, Filter, MoreVertical, CheckCircle2, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Collaborateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  dateEntree: string;
  statut: "actif" | "inactif";
  tachesEnCours: number;
}

const collaborateursData: Collaborateur[] = [
  {
    id: "1",
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@cabinet.fr",
    poste: "Expert Comptable",
    dateEntree: "2023-01-01",
    statut: "actif",
    tachesEnCours: 5,
  },
  {
    id: "2",
    nom: "Martin",
    prenom: "Pierre",
    email: "pierre.martin@cabinet.fr",
    poste: "Comptable",
    dateEntree: "2023-03-15",
    statut: "actif",
    tachesEnCours: 3,
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@cabinet.fr",
    poste: "Assistante comptable",
    dateEntree: "2023-06-01",
    statut: "actif",
    tachesEnCours: 4,
  },
];

export default function Collaborateurs() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCollaborateurs = collaborateursData.filter(
    (collab) =>
      collab.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collab.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">
              Collaborateurs
            </h1>
            <p className="text-neutral-600 mt-1">
              Gérez votre équipe et leurs accès
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau collaborateur
          </Button>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
            <Input
              type="text"
              placeholder="Rechercher un collaborateur..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtres
          </Button>
        </div>

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
              {filteredCollaborateurs.map((collaborateur) => (
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
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Voir le profil</DropdownMenuItem>
                        <DropdownMenuItem>Modifier</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}