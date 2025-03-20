
import { Client } from "@/types/facture";
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
}

const ClientSelector = ({ clients, value, onChange }: ClientSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="client">Client</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un client" />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.nom}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
