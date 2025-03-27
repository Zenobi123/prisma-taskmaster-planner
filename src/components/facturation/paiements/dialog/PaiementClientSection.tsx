
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { usePaiementClients } from "./hooks/usePaiementClients";
import { User, Users, Loader2 } from "lucide-react";
import { Client } from "@/types/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PaiementClientSectionProps {
  selectedClientId: string | null;
  estCredit: boolean;
  onClientChange: (clientId: string) => void;
  onCreditChange: (checked: boolean) => void;
}

export const PaiementClientSection = ({
  selectedClientId,
  estCredit,
  onClientChange,
  onCreditChange
}: PaiementClientSectionProps) => {
  const { clients, isLoading, error } = usePaiementClients();

  return (
    <div className="space-y-3">
      {/* Client selection */}
      <div className="grid gap-1.5">
        <Label htmlFor="client_id" className="text-xs font-medium flex items-center gap-1.5">
          <Users size={14} className="text-gray-500" />
          Client
        </Label>
        <Select onValueChange={onClientChange} value={selectedClientId || undefined} disabled={isLoading}>
          <SelectTrigger className="h-9 text-sm bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-gray-400" />
                <span>Chargement des clients...</span>
              </div>
            ) : (
              <SelectValue placeholder="Sélectionner un client" />
            )}
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {error ? (
              <div className="p-2 text-sm text-red-500">Erreur lors du chargement des clients</div>
            ) : clients.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">Aucun client disponible</div>
            ) : (
              <ScrollArea className="h-[250px]">
                {clients.map((client: Client) => (
                  <SelectItem key={client.id} value={client.id} className="text-sm">
                    {client.type === "physique" ? client.nom : client.raisonsociale}
                  </SelectItem>
                ))}
              </ScrollArea>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Credit checkbox */}
      <div className="flex items-center space-x-2 py-1">
        <Checkbox 
          id="est_credit" 
          checked={estCredit} 
          className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          onCheckedChange={(checked) => onCreditChange(checked === true)}
        />
        <Label htmlFor="est_credit" className="text-sm text-gray-700 cursor-pointer">
          Paiement en avance (crédit client)
        </Label>
      </div>
    </div>
  );
};
