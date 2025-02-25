
import { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientSelectorProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientSelect: (clientId: string) => void;
}

export function ClientSelector({ clients, selectedClientId, onClientSelect }: ClientSelectorProps) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">Sélectionner un client</h2>
      <Select value={selectedClientId || ""} onValueChange={onClientSelect}>
        <SelectTrigger className="w-full md:w-[400px]">
          <SelectValue placeholder="Choisir un client à gérer..." />
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
  );
}
