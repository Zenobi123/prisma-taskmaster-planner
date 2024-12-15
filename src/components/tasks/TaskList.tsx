import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Données temporaires pour la démo
const tasks = [
  {
    id: "1",
    name: "Bilan annuel",
    client: "SARL Example",
    collaborator: "Marie D.",
    startDate: "2024-02-01",
    endDate: "2024-02-15",
    status: "in_progress",
  },
  {
    id: "2",
    name: "Déclaration TVA",
    client: "SAS Tech",
    collaborator: "Pierre M.",
    startDate: "2024-02-10",
    endDate: "2024-02-12",
    status: "pending",
  },
  {
    id: "3",
    name: "Révision comptable",
    client: "EURL Web",
    collaborator: "Sophie L.",
    startDate: "2024-02-05",
    endDate: "2024-02-20",
    status: "completed",
  },
];

const collaborators = [
  { id: "1", name: "Marie D." },
  { id: "2", name: "Pierre M." },
  { id: "3", name: "Sophie L." },
];

const clients = [
  { id: "1", name: "SARL Example" },
  { id: "2", name: "SAS Tech" },
  { id: "3", name: "EURL Web" },
];

const statuses = [
  { id: "pending", name: "En attente" },
  { id: "in_progress", name: "En cours" },
  { id: "completed", name: "Terminé" },
];

export function TaskList() {
  const [filters, setFilters] = useState({
    collaborator: "all",
    client: "all",
    status: "all",
    search: "",
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesCollaborator =
      filters.collaborator === "all" || task.collaborator === filters.collaborator;
    const matchesClient = 
      filters.client === "all" || task.client === filters.client;
    const matchesStatus = 
      filters.status === "all" || task.status === filters.status;
    const matchesSearch =
      !filters.search ||
      task.name.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCollaborator && matchesClient && matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    const statusObj = statuses.find((s) => s.id === status);
    return statusObj ? statusObj.name : status;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Input
          placeholder="Rechercher une tâche..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />
        <Select
          value={filters.collaborator}
          onValueChange={(value) =>
            setFilters({ ...filters, collaborator: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par collaborateur" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les collaborateurs</SelectItem>
            {collaborators.map((collaborator) => (
              <SelectItem key={collaborator.id} value={collaborator.name}>
                {collaborator.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.client}
          onValueChange={(value) => setFilters({ ...filters, client: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.name}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters({ ...filters, status: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.id} value={status.id}>
                {status.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tâche</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Collaborateur</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.name}</TableCell>
                <TableCell>{task.client}</TableCell>
                <TableCell>{task.collaborator}</TableCell>
                <TableCell>{task.startDate}</TableCell>
                <TableCell>{task.endDate}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(
                      task.status
                    )}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}