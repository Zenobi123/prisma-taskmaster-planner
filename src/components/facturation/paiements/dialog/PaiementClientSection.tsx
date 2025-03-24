
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { User, Users } from "lucide-react";

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
  const [clients, setClients] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from("clients")
        .select("id, nom, raisonsociale, type");

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer la liste des clients."
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Client selection */}
      <div className="grid gap-1.5">
        <Label htmlFor="client_id" className="text-xs font-medium flex items-center gap-1.5">
          <Users size={14} className="text-gray-500" />
          Client
        </Label>
        <Select onValueChange={onClientChange} value={selectedClientId || undefined}>
          <SelectTrigger className="h-9 text-sm bg-white border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary/20">
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id} className="text-sm">
                {client.type === "physique" ? client.nom : client.raisonsociale}
              </SelectItem>
            ))}
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
