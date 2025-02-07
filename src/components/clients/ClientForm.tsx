
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ClientType } from "@/types/client";

interface ClientFormProps {
  onSubmit: () => void;
  type: ClientType;
  onTypeChange: (value: ClientType) => void;
}

export function ClientForm({ onSubmit, type, onTypeChange }: ClientFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Type de client</Label>
          <Select value={type} onValueChange={onTypeChange} required>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="physique">Personne Physique</SelectItem>
              <SelectItem value="morale">Personne Morale</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "physique" ? (
          <>
            <div>
              <Label>Nom et prénoms</Label>
              <Input required />
            </div>
            <div>
              <Label>Nom commercial</Label>
              <Input />
            </div>
          </>
        ) : (
          <>
            <div>
              <Label>Raison sociale</Label>
              <Input required />
            </div>
            <div>
              <Label>Sigle</Label>
              <Input />
            </div>
            <div>
              <Label>Nom du gérant</Label>
              <Input required />
            </div>
            <div>
              <Label>Téléphone du gérant</Label>
              <Input type="tel" required />
            </div>
          </>
        )}

        <div>
          <Label>NIU</Label>
          <Input required />
        </div>

        <div>
          <Label>Centre de Rattachement</Label>
          <Input required />
        </div>

        <div>
          <Label>Ville</Label>
          <Input required />
        </div>

        <div>
          <Label>Quartier</Label>
          <Input required />
        </div>

        <div>
          <Label>Lieu-dit</Label>
          <Input />
        </div>

        <div>
          <Label>Téléphone</Label>
          <Input type="tel" required />
        </div>

        <div>
          <Label>Email</Label>
          <Input type="email" required />
        </div>

        <div>
          <Label>Secteur d'activité</Label>
          <Select required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commerce">Commerce</SelectItem>
              <SelectItem value="services">Services</SelectItem>
              <SelectItem value="industrie">Industrie</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Numéro CNPS (optionnel)</Label>
          <Input />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Ajouter le client
      </Button>
    </form>
  );
}
