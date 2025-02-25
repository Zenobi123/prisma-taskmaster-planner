
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormeJuridique } from "@/types/client";

interface CompanyInfoFieldsProps {
  raisonsociale: string;
  sigle?: string;
  datecreation?: string;
  lieucreation?: string;
  nomdirigeant?: string;
  formejuridique?: FormeJuridique;
  onChange: (name: string, value: any) => void;
}

export function CompanyInfoFields({
  raisonsociale,
  sigle,
  datecreation,
  lieucreation,
  nomdirigeant,
  formejuridique,
  onChange
}: CompanyInfoFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label>Raison sociale</Label>
        <Input 
          required 
          value={raisonsociale}
          onChange={(e) => onChange("raisonsociale", e.target.value)}
        />
      </div>

      <div>
        <Label>Sigle</Label>
        <Input
          value={sigle || ""}
          onChange={(e) => onChange("sigle", e.target.value)}
          placeholder="Sigle de l'entreprise"
        />
      </div>

      <div>
        <Label>Date de création</Label>
        <Input
          type="date"
          value={datecreation || ""}
          onChange={(e) => onChange("datecreation", e.target.value)}
        />
      </div>

      <div>
        <Label>Lieu de création</Label>
        <Input
          value={lieucreation || ""}
          onChange={(e) => onChange("lieucreation", e.target.value)}
          placeholder="Ville de création"
        />
      </div>

      <div>
        <Label>Nom du dirigeant</Label>
        <Input
          value={nomdirigeant || ""}
          onChange={(e) => onChange("nomdirigeant", e.target.value)}
          placeholder="Nom complet du dirigeant"
        />
      </div>

      <div>
        <Label>Forme juridique</Label>
        <Select
          value={formejuridique}
          onValueChange={(value) => onChange("formejuridique", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez la forme juridique" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sa">Société Anonyme (SA)</SelectItem>
            <SelectItem value="sarl">Société à Responsabilité Limitée (SARL)</SelectItem>
            <SelectItem value="sas">Société par Actions Simplifiée (SAS)</SelectItem>
            <SelectItem value="snc">Société en Nom Collectif (SNC)</SelectItem>
            <SelectItem value="association">Association</SelectItem>
            <SelectItem value="gie">Groupement d'Intérêt Économique (GIE)</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
