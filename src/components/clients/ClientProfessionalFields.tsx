
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
  contact_principal: string;
  onChange: (name: string, value: string | boolean) => void;
}

const CDI_OPTIONS = [
  {
    group: "Yaoundé",
    options: [
      { value: "CDI YAOUNDE 1", label: "CDI Yaoundé 1" },
      { value: "CDI YAOUNDE 2", label: "CDI Yaoundé 2" },
      { value: "CDI YAOUNDE 3", label: "CDI Yaoundé 3" },
      { value: "CDI YAOUNDE 4", label: "CDI Yaoundé 4" },
    ],
  },
  {
    group: "Douala",
    options: [
      { value: "CDI DOUALA 1", label: "CDI Douala 1" },
      { value: "CDI DOUALA 2", label: "CDI Douala 2" },
      { value: "CDI DOUALA 3", label: "CDI Douala 3" },
    ],
  },
  {
    group: "Autres Régions",
    options: [
      { value: "CDI BAFOUSSAM", label: "CDI Bafoussam" },
      { value: "CDI BAMENDA", label: "CDI Bamenda" },
      { value: "CDI GAROUA", label: "CDI Garoua" },
      { value: "CDI MAROUA", label: "CDI Maroua" },
      { value: "CDI BERTOUA", label: "CDI Bertoua" },
      { value: "CDI EBOLOWA", label: "CDI Ebolowa" },
    ],
  },
  {
    group: "Centres Spéciaux",
    options: [
      { value: "CDI MEFOU ET AFAMBA", label: "CDI Mefou et Afamba" },
    ],
  },
];

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
  contact_principal,
  onChange,
}: ClientProfessionalFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations professionnelles</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="niu">NIU *</Label>
          <Input
            id="niu"
            name="niu"
            value={niu}
            onChange={(e) => onChange("niu", e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="centrerattachement">Centre de rattachement fiscal *</Label>
          <Select
            value={centrerattachement}
            onValueChange={(value) => onChange("centrerattachement", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un CDI" />
            </SelectTrigger>
            <SelectContent>
              {CDI_OPTIONS.map((group) => (
                <SelectGroup key={group.group}>
                  <SelectLabel>{group.group}</SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
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
          <Label htmlFor="contact_principal">Nom du contact principal</Label>
          <Input
            id="contact_principal"
            name="contact_principal"
            value={contact_principal}
            onChange={(e) => onChange("contact_principal", e.target.value)}
            placeholder="Nom du contact principal"
          />
        </div>

        <div>
          <Label htmlFor="secteuractivite">Secteur d'activité *</Label>
          <Input
            id="secteuractivite"
            name="secteuractivite"
            value={secteuractivite}
            onChange={(e) => onChange("secteuractivite", e.target.value)}
            placeholder="Ex: commerce, service, industrie..."
            required
          />
        </div>

        <div>
          <Label htmlFor="numerocnps">Numéro CNPS</Label>
          <Input
            id="numerocnps"
            name="numerocnps"
            value={numerocnps}
            onChange={(e) => onChange("numerocnps", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="gestionexternalisee">Gestion externalisée</Label>
          <Select
            value={gestionexternalisee ? "Oui" : "Non"}
            onValueChange={(value) => onChange("gestionexternalisee", value === "Oui")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Non">Non</SelectItem>
              <SelectItem value="Oui">Oui</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

      {/* Section fiscale */}
      <h3 className="text-lg font-semibold text-gray-900 pt-4 border-t">Situation fiscale</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <SelectItem value="igs">Impôt Général Synthétique (IGS)</SelectItem>
              <SelectItem value="reel">Régime Réel</SelectItem>
              <SelectItem value="non_professionnel">Non Professionnel</SelectItem>
              <SelectItem value="obnl">OBNL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="chiffreaffaires">Chiffre d'affaires (F CFA)</Label>
          <Input
            id="chiffreaffaires"
            name="chiffreaffaires"
            type="number"
            value={chiffreaffaires}
            placeholder="Montant en F CFA"
            onChange={(e) => onChange("chiffreaffaires", e.target.value)}
          />
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <SelectItem value="annuel">Annuel</SelectItem>
                <SelectItem value="trimestriel">Trimestriel</SelectItem>
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
              <SelectItem value="annuel">Annuel</SelectItem>
              <SelectItem value="trimestriel">Trimestriel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
