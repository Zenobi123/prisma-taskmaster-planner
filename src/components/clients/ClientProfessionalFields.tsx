
import { useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { RegimeFiscal, Civilite, ModePaiement } from "@/types/client";
import { calculateAllTaxes, formatMoney, FiscalInput } from "@/utils/fiscalCalculations";

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
  contact_principal: string;
  situationimmobiliere?: {
    type: "proprietaire" | "locataire" | "les_deux";
    loyer?: number;
    valeur?: number;
  };
  onChange: (name: string, value: string | boolean) => void;
}

// Source : DGI — https://www.impots.cm/fr/cartographie-des-centres-regionaux-des-impots
// Yaoundé 3 et 4 absents de la cartographie officielle (12 CFLP numérotés 1,2,5–14)
const CFLP_OPTIONS = [
  {
    group: "Yaoundé",
    options: [
      { value: "CFLP YAOUNDE 1",  label: "CFLP Yaoundé 1" },
      { value: "CFLP YAOUNDE 2",  label: "CFLP Yaoundé 2" },
      { value: "CFLP YAOUNDE 5",  label: "CFLP Yaoundé 5" },
      { value: "CFLP YAOUNDE 6",  label: "CFLP Yaoundé 6" },
      { value: "CFLP YAOUNDE 7",  label: "CFLP Yaoundé 7" },
      { value: "CFLP YAOUNDE 8",  label: "CFLP Yaoundé 8" },
      { value: "CFLP YAOUNDE 9",  label: "CFLP Yaoundé 9" },
      { value: "CFLP YAOUNDE 10", label: "CFLP Yaoundé 10" },
      { value: "CFLP YAOUNDE 11", label: "CFLP Yaoundé 11" },
      { value: "CFLP YAOUNDE 12", label: "CFLP Yaoundé 12" },
      { value: "CFLP YAOUNDE 13", label: "CFLP Yaoundé 13" },
      { value: "CFLP YAOUNDE 14", label: "CFLP Yaoundé 14" },
    ],
  },
  {
    group: "Douala",
    options: [
      { value: "CFLP DOUALA 1", label: "CFLP Douala 1" },
      { value: "CFLP DOUALA 2", label: "CFLP Douala 2" },
      { value: "CFLP DOUALA 3", label: "CFLP Douala 3" },
    ],
  },
  {
    group: "Autres Régions",
    options: [
      { value: "CFLP BAFOUSSAM", label: "CFLP Bafoussam" },
      { value: "CFLP BAMENDA",   label: "CFLP Bamenda" },
      { value: "CFLP GAROUA",    label: "CFLP Garoua" },
      { value: "CFLP MAROUA",    label: "CFLP Maroua" },
      { value: "CFLP BERTOUA",   label: "CFLP Bertoua" },
      { value: "CFLP EBOLOWA",   label: "CFLP Ebolowa" },
    ],
  },
  {
    group: "Centres Spéciaux",
    options: [
      { value: "CFLP MEFOU ET AFAMBA", label: "CFLP Mefou et Afamba" },
    ],
  },
  {
    group: "",
    options: [
      { value: "Autre", label: "Autre" },
    ],
  },
];

function getIGSEcheances(modePaiement: ModePaiement, year: number) {
  if (modePaiement === "trimestriel") {
    return [
      { label: "1er trim.", echeance: new Date(year, 0, 15), part: "25%" },
      { label: "2e trim.", echeance: new Date(year, 2, 15), part: "25%" },
      { label: "3e trim.", echeance: new Date(year, 6, 15), part: "25%" },
      { label: "4e trim.", echeance: new Date(year, 9, 15), part: "25%" },
    ];
  }
  return [
    { label: "Annuel", echeance: new Date(year, 2, 1), part: "100%" },
  ];
}

function getEcheanceStatus(echeance: Date) {
  const now = new Date();
  const graceDate = new Date(echeance);
  graceDate.setDate(graceDate.getDate() + 30);

  if (now < echeance) return { label: "À venir", color: "bg-blue-100 text-blue-700" };
  if (now < graceDate) return { label: "En délai", color: "bg-yellow-100 text-yellow-700" };
  return { label: "En retard", color: "bg-red-100 text-red-700" };
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
  contact_principal,
  situationimmobiliere,
  onChange,
}: ClientProfessionalFieldsProps) {
  const ca = parseFloat(chiffreaffaires) || 0;

  const fiscalInput: FiscalInput = useMemo(() => ({
    regimeFiscal: regimefiscal,
    chiffreAffaires: ca,
    isCGA: iscga,
    isVendeurBoissons: isvendeurboissons,
    modePaiementIGS: modepaiementigs,
    situationImmobiliere: situationimmobiliere ? {
      type: situationimmobiliere.type,
      loyerMensuel: situationimmobiliere.loyer,
      valeurBien: situationimmobiliere.valeur,
    } : undefined,
    modePaiementPSL: modepaiementpsl,
  }), [regimefiscal, ca, iscga, isvendeurboissons, modepaiementigs, situationimmobiliere, modepaiementpsl]);

  const taxes = useMemo(() => calculateAllTaxes(fiscalInput), [fiscalInput]);

  const showFiscalPreview = ca > 0 && regimefiscal !== "non_professionnel" && regimefiscal !== "obnl";
  const currentYear = new Date().getFullYear();
  const echeances = regimefiscal === "igs" ? getIGSEcheances(modepaiementigs, currentYear) : [];

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900">Informations professionnelles</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

        {regimefiscal === "igs" && (
          <div>
            <Label htmlFor="centrerattachement">CFLP (Centre de rattachement fiscal) *</Label>
            <Select
              value={centrerattachement}
              onValueChange={(value) => onChange("centrerattachement", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un CFLP" />
              </SelectTrigger>
              <SelectContent>
                {CFLP_OPTIONS.map((group) =>
                  group.group ? (
                    <SelectGroup key={group.group}>
                      <SelectLabel>{group.group}</SelectLabel>
                      {group.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ) : (
                    group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        )}

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
          <Label htmlFor="gestionexternalisee">Gestion de dossiers clients en portefeuille</Label>
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

      {/* Section fiscale */}
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 pt-3 sm:pt-4 border-t">Situation fiscale</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

      {/* Calculs fiscaux automatiques */}
      {showFiscalPreview && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm font-semibold text-primary mb-3">Impôts calculés automatiquement</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              {regimefiscal === "igs" && taxes.igs > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">IGS (Classe {taxes.igsClasse})</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.igs)}</p>
                  {iscga && <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">CGA -50%</Badge>}
                </div>
              )}
              {regimefiscal === "reel" && taxes.patente > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Patente</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.patente)}</p>
                </div>
              )}
              {taxes.tdl > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">TDL</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.tdl)}</p>
                </div>
              )}
              {taxes.soldeIR > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Solde IR/IS</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.soldeIR)}</p>
                </div>
              )}
              {taxes.licence > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Licence</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.licence)}</p>
                </div>
              )}
              {taxes.psl > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">PSL</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.psl)}</p>
                </div>
              )}
              {taxes.bail > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Bail ({taxes.tauxBail}%)</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.bail)}</p>
                </div>
              )}
              {taxes.tf > 0 && (
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Taxe Foncière</p>
                  <p className="text-sm font-semibold">{formatMoney(taxes.tf)}</p>
                </div>
              )}
            </div>

            {/* Total */}
            {(() => {
              const total = taxes.igs + taxes.patente + taxes.tdl + taxes.soldeIR + taxes.licence + taxes.psl + taxes.bail + taxes.tf;
              return total > 0 ? (
                <div className="mt-3 pt-2 border-t border-primary/20 flex justify-between items-center">
                  <span className="text-sm font-medium">Total obligations fiscales</span>
                  <span className="text-sm font-bold text-primary">{formatMoney(total)}</span>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}

      {/* Échéancier paiement IGS */}
      {regimefiscal === "igs" && ca > 0 && taxes.igs > 0 && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-sm font-semibold text-amber-800 mb-3">
              Échéancier IGS {currentYear} ({modepaiementigs === "trimestriel" ? "Trimestriel" : "Annuel"})
            </p>
            <div className="space-y-2">
              {echeances.map((ech, i) => {
                const status = getEcheanceStatus(ech.echeance);
                const montant = modepaiementigs === "trimestriel" ? Math.round(taxes.igs / 4) : taxes.igs;
                return (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-[10px] ${status.color}`}>
                        {status.label}
                      </Badge>
                      <span className="text-muted-foreground">{ech.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {ech.echeance.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="font-medium">{formatMoney(montant)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {modepaiementigs === "trimestriel" && (
              <p className="text-[10px] text-muted-foreground mt-2">
                Pénalité de retard : 10% par mois après 30 jours de grâce
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Indicateur CA hors barème IGS */}
      {regimefiscal === "igs" && ca >= 50000000 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="py-3">
            <p className="text-sm font-medium text-red-700">
              CA de {formatMoney(ca)} hors barème IGS (max 50 000 000 F CFA). Ce client devrait passer au Régime Réel.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
