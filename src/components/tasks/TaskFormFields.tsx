
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskFormFieldsProps {
  clients: any[];
  collaborateurs: any[];
}

export const TaskFormFields = ({ clients, collaborateurs }: TaskFormFieldsProps) => {
  // Filtrer les collaborateurs actifs
  const activeCollaborateurs = collaborateurs.filter(
    (collab) => collab.statut === "actif"
  );

  return (
    <>
      <div>
        <Label htmlFor="title">Titre de la tâche</Label>
        <Input id="title" name="title" required />
      </div>
      <div>
        <Label htmlFor="client_id">Client</Label>
        <Select name="client_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.type === "physique" ? client.nom : client.raisonsociale}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="collaborateur_id">Assigné à</Label>
        <Select name="collaborateur_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un collaborateur" />
          </SelectTrigger>
          <SelectContent>
            {activeCollaborateurs.map((collab) => (
              <SelectItem key={collab.id} value={collab.id}>
                {collab.prenom} {collab.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};
