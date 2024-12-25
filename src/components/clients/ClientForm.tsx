import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFormProps {
  onSubmit: () => void;
}

export function ClientForm({ onSubmit }: ClientFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Raison sociale</label>
          <Input required />
        </div>
        
        <div>
          <label className="text-sm font-medium">SIREN</label>
          <Input required pattern="[0-9]{9}" title="Le SIREN doit contenir 9 chiffres" />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <Input type="email" required />
        </div>

        <div>
          <label className="text-sm font-medium">Téléphone</label>
          <Input type="tel" required />
        </div>

        <div>
          <label className="text-sm font-medium">Adresse</label>
          <Input required />
        </div>

        <div>
          <label className="text-sm font-medium">Ville</label>
          <Input required />
        </div>

        <div>
          <label className="text-sm font-medium">Secteur d'activité</label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="technologie">Technologie</SelectItem>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Statut</label>
          <Select defaultValue="actif" required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="actif">Actif</SelectItem>
              <SelectItem value="inactif">Inactif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Ajouter le client
      </Button>
    </form>
  );
}