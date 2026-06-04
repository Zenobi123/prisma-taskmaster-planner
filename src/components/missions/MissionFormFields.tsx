
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MissionFormFieldsProps {
  clients: { id: string; type?: string; nom?: string; raisonsociale?: string }[];
  collaborateurs: { id: string; nom?: string; prenom?: string; statut?: string }[];
}

export const MissionFormFields = ({ clients, collaborateurs }: MissionFormFieldsProps) => {
  // On ne propose que les collaborateurs actifs pour l'assignation.
  const activeCollaborateurs = collaborateurs.filter(
    (collab) => collab.statut === "actif"
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titre de la mission</Label>
        <Input id="title" name="title" placeholder="Entrez le titre de la mission" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="client_id">Client (optionnel)</Label>
        <Select name="client_id">
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un client (optionnel)" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              {clients.map((client) => (
                <SelectItem
                  key={client.id}
                  value={client.id}
                  className="cursor-pointer hover:bg-neutral-100"
                >
                  {client.type === "physique"
                    ? `${client.nom} (Particulier)`
                    : `${client.raisonsociale} (Entreprise)`}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="collaborateur_id">Assigné à</Label>
        <Select name="collaborateur_id" required>
          <SelectTrigger className="w-full bg-background border-input">
            <SelectValue placeholder="Sélectionnez un collaborateur" />
          </SelectTrigger>
          <SelectContent position="popper" className="w-full bg-white shadow-lg border z-50">
            <ScrollArea className="h-[200px] w-full">
              {activeCollaborateurs.map((collab) => (
                <SelectItem
                  key={collab.id}
                  value={collab.id}
                  className="cursor-pointer hover:bg-neutral-100"
                >
                  {collab.prenom} {collab.nom}
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="start_date">Date de début</Label>
          <Input type="date" id="start_date" name="start_date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="end_date">Date de fin</Label>
          <Input type="date" id="end_date" name="end_date" required />
        </div>
      </div>
    </div>
  );
};
