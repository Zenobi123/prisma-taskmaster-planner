
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

interface ClientDateFormProps {
  clientId: string;
  setClientId: (value: string) => void;
  dateEmission: string;
  setDateEmission: (value: string) => void;
  dateEcheance: string;
  setDateEcheance: (value: string) => void;
}

export const ClientDateForm = ({
  clientId,
  setClientId,
  dateEmission,
  setDateEmission,
  dateEcheance,
  setDateEcheance
}: ClientDateFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="client">Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger>
            <SelectValue placeholder={isLoading ? "Chargement des clients..." : "Sélectionner un client"} />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.type === "physique" 
                  ? client.nom 
                  : client.raisonsociale || "Client sans nom"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="date">Date d'émission</Label>
          <Input 
            id="date" 
            type="date" 
            value={dateEmission}
            onChange={(e) => setDateEmission(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="echeance">Date d'échéance</Label>
          <Input 
            id="echeance" 
            type="date"
            value={dateEcheance}
            onChange={(e) => setDateEcheance(e.target.value)}
          />
        </div>
      </div>
    </>
  );
};
