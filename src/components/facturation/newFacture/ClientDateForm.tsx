
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="client">Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="client-001">SARL TechPro</SelectItem>
            <SelectItem value="client-002">SAS WebDev</SelectItem>
            <SelectItem value="client-003">EURL ConseilPlus</SelectItem>
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
