
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormeJuridique } from "@/types/client";

interface CompanyInfoFieldsProps {
  raisonsociale: string;
  sigle?: string;
  numerorccm?: string;
  datecreation?: string;
  lieucreation?: string;
  nomdirigeant?: string;
  formejuridique?: FormeJuridique;
  onChange: (name: string, value: any) => void;
}

export function CompanyInfoFields({ 
  raisonsociale, 
  sigle = "",
  numerorccm = "",
  datecreation = "", 
  lieucreation = "", 
  nomdirigeant = "",
  formejuridique,
  onChange 
}: CompanyInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations de l'entreprise</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="raisonsociale">Raison sociale *</Label>
          <Input
            id="raisonsociale"
            type="text"
            value={raisonsociale}
            onChange={(e) => onChange("raisonsociale", e.target.value)}
            placeholder="Entrez la raison sociale"
            required
          />
        </div>

        <div>
          <Label htmlFor="sigle">Sigle</Label>
          <Input
            id="sigle"
            type="text"
            value={sigle}
            onChange={(e) => onChange("sigle", e.target.value)}
            placeholder="Sigle de l'entreprise"
          />
        </div>

        <div>
          <Label htmlFor="numerorccm">Numéro de RCCM</Label>
          <Input
            id="numerorccm"
            type="text"
            value={numerorccm}
            onChange={(e) => onChange("numerorccm", e.target.value)}
            placeholder="Numéro de RCCM (optionnel)"
          />
        </div>

        <div>
          <Label htmlFor="formejuridique">Forme juridique</Label>
          <Select value={formejuridique} onValueChange={(value) => onChange("formejuridique", value as FormeJuridique)}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez la forme juridique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sa">SA - Société Anonyme</SelectItem>
              <SelectItem value="sarl">SARL - Société à Responsabilité Limitée</SelectItem>
              <SelectItem value="sas">SAS - Société par Actions Simplifiée</SelectItem>
              <SelectItem value="snc">SNC - Société en Nom Collectif</SelectItem>
              <SelectItem value="association">Association</SelectItem>
              <SelectItem value="gie">GIE - Groupement d'Intérêt Économique</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="datecreation">Date de création</Label>
          <Input
            id="datecreation"
            type="date"
            value={datecreation}
            onChange={(e) => onChange("datecreation", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="lieucreation">Lieu de création</Label>
          <Input
            id="lieucreation"
            type="text"
            value={lieucreation}
            onChange={(e) => onChange("lieucreation", e.target.value)}
            placeholder="Lieu de création"
          />
        </div>

        <div>
          <Label htmlFor="nomdirigeant">Nom du dirigeant</Label>
          <Input
            id="nomdirigeant"
            type="text"
            value={nomdirigeant}
            onChange={(e) => onChange("nomdirigeant", e.target.value)}
            placeholder="Nom du dirigeant principal"
          />
        </div>
      </div>
    </div>
  );
}
