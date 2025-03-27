
import { Client } from "@/types/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClientSelectorProps {
  clients: Client[];
  value: string;
  onChange: (value: string) => void;
  includeEmpty?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  error?: any;
}

const ClientSelector = ({ 
  clients, 
  value, 
  onChange, 
  includeEmpty = false,
  disabled = false,
  isLoading = false,
  error = null
}: ClientSelectorProps) => {
  return (
    <div className="space-y-1">
      <Label htmlFor="client" className="text-sm">Client</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
        <SelectTrigger className="w-full h-8 text-sm">
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
          <ScrollArea className="h-[200px]">
            {error ? (
              <SelectItem value="error" disabled>Erreur lors du chargement des clients</SelectItem>
            ) : (
              <>
                {includeEmpty && (
                  <SelectItem value="all">Tous les clients</SelectItem>
                )}
                {clients.length === 0 ? (
                  <SelectItem value="no-clients" disabled>Aucun client disponible</SelectItem>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nom || client.raisonsociale}
                    </SelectItem>
                  ))
                )}
              </>
            )}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ClientSelector;
