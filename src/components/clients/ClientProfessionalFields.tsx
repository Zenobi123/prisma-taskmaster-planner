
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RegimeFiscal, Civilite, ModePaiement } from "@/types/client";

interface ClientProfessionalFieldsProps {
  niu: string;
  centrerattachement: string;
  secteuractivite: string;
  numerocnps: string;
  regimefiscal: RegimeFiscal;
  civilite: Civilite;
  chiffreaffaires: string;
  iscga: boolean;
  isvendeurboissons: boolean;
  modepaiementigs: ModePaiement;
  modepaiementpsl: ModePaiement;
  gestionexternalisee: boolean;
  inscriptionfanrharmony2: boolean;
  onChange: (name: string, value: string | boolean) => void;
}

export function ClientProfessionalFields({
  niu,
  centrerattachement,
  secteuractivite,
  numerocnps,
  regimefiscal,
  civilite,
  chiffreaffaires,
  iscga,
  isvendeurboissons,
  modepaiementigs,
  modepaiementpsl,
  gestionexternalisee,
  inscriptionfanrharmony2,
  onChange,
}: ClientProfessionalFieldsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="niu">NIU</Label>
        <Input
          id="niu"
          name="niu"
          value={niu}
          onChange={(e) => onChange("niu", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="centrerattachement">Centre de rattachement</Label>
        <Input
          id="centrerattachement"
          name="centrerattachement"
          value={centrerattachement}
          onChange={(e) => onChange("centrerattachement", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="secteuractivite">Secteur d'activité</Label>
        <Select
          value={secteuractivite}
          onValueChange={(value) => onChange("secteuractivite", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez un secteur d'activité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commerce">Commerce</SelectItem>
            <SelectItem value="service">Service</SelectItem>
            <SelectItem value="industrie">Industrie</SelectItem>
            <SelectItem value="agriculture">Agriculture</SelectItem>
            <SelectItem value="autre">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="numerocnps">Numéro CNPS (optionnel)</Label>
        <Input
          id="numerocnps"
          name="numerocnps"
          value={numerocnps}
          onChange={(e) => onChange("numerocnps", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="regimefiscal">Régime fiscal *</Label>
        <Select
          value={regimefiscal}
          onValueChange={(value) => onChange("regimefiscal", value as RegimeFiscal)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le régime fiscal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reel">Régime Réel</SelectItem>
            <SelectItem value="igs">Impôt Général Synthétique (IGS)</SelectItem>
            <SelectItem value="non_professionnel">Non Professionnel</SelectItem>
            <SelectItem value="obnl">OBNL</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="civilite">Civilité</Label>
        <Select
          value={civilite}
          onValueChange={(value) => onChange("civilite", value as Civilite)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez la civilité" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="M.">M.</SelectItem>
            <SelectItem value="Mme">Mme</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="chiffreaffaires">Chiffre d'affaires</Label>
        <Input
          id="chiffreaffaires"
          name="chiffreaffaires"
          type="number"
          value={chiffreaffaires}
          placeholder="Montant en F CFA"
          onChange={(e) => onChange("chiffreaffaires", e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="iscga"
          checked={iscga}
          onCheckedChange={(checked) =>
            onChange("iscga", checked === true)
          }
        />
        <Label htmlFor="iscga" className="font-medium cursor-pointer">
          Adhérent à un Centre de Gestion Agréé (CGA)
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isvendeurboissons"
          checked={isvendeurboissons}
          onCheckedChange={(checked) =>
            onChange("isvendeurboissons", checked === true)
          }
        />
        <Label htmlFor="isvendeurboissons" className="font-medium cursor-pointer">
          Vendeur de boissons (licence)
        </Label>
      </div>

      {regimefiscal === "igs" && (
        <div>
          <Label htmlFor="modepaiementigs">Mode de paiement IGS</Label>
          <Select
            value={modepaiementigs}
            onValueChange={(value) => onChange("modepaiementigs", value as ModePaiement)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez le mode de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trimestriel">Trimestriel</SelectItem>
              <SelectItem value="annuel">Annuel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="modepaiementpsl">Mode de paiement PSL</Label>
        <Select
          value={modepaiementpsl}
          onValueChange={(value) => onChange("modepaiementpsl", value as ModePaiement)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez le mode de paiement" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trimestriel">Trimestriel</SelectItem>
            <SelectItem value="annuel">Annuel</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="gestionexternalisee"
          checked={gestionexternalisee}
          onCheckedChange={(checked) => 
            onChange("gestionexternalisee", checked === true)
          }
        />
        <Label htmlFor="gestionexternalisee" className="font-medium cursor-pointer">
          Gestion du dossier
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="inscriptionfanrharmony2"
          checked={inscriptionfanrharmony2}
          onCheckedChange={(checked) => 
            onChange("inscriptionfanrharmony2", checked === true)
          }
        />
        <Label htmlFor="inscriptionfanrharmony2" className="font-medium cursor-pointer">
          Inscription FANR harmony2
        </Label>
      </div>
    </div>
  );
}
