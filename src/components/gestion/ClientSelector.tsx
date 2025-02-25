
import { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
        <SelectTrigger className="w-full md:w-[400px] bg-white border-[#A8C1AE] focus:border-[#84A98C] focus:ring-[#84A98C]/20">
          <SelectValue placeholder="Choisir un client à gérer..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Clients en gestion</SelectLabel>
            {clients.map((client) => (
              <SelectItem 
                key={client.id} 
                value={client.id}
                className="hover:bg-[#F2FCE2] focus:bg-[#F2FCE2]"
              >
                {client.type === "physique" 
                  ? `${client.nom} (Personne physique)`
                  : `${client.raisonsociale} (Personne morale)`
                }
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
