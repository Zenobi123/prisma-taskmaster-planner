
import { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ClientSelectorProps {
  clients: Client[];
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
}

const ClientSelector = ({ clients, value, onChange, includeEmpty = false }: ClientSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="client" className="text-sm">Client</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-8 text-sm">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {includeEmpty && (
            <SelectItem value="">Tous les clients</SelectItem>
          )}
          {clients.length === 0 ? (
            <SelectItem value="empty" disabled>Aucun client disponible</SelectItem>
          ) : (
            clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.type === "physique" 
                  ? client.nom 
                  : client.raisonsociale || client.nom}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
