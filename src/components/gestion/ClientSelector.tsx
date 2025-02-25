
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
      <h2 className="text-lg font-semibold mb-4 text-[#1A1F2C]">Sélectionner un client</h2>
      <Select value={selectedClientId || ""} onValueChange={onClientSelect}>
        <SelectTrigger className="w-full md:w-[400px] bg-white border-[#E5DEFF] focus:border-[#9b87f5] focus:ring-[#9b87f5]/20">
          <SelectValue placeholder="Choisir un client à gérer..." />
        </SelectTrigger>
        <SelectContent>
          {clients.map((client) => (
            <SelectItem 
              key={client.id} 
              value={client.id}
              className="hover:bg-[#F1F0FB] focus:bg-[#F1F0FB]"
            >
              {client.type === "physique" ? client.nom : client.raisonsociale}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
