
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormeJuridique, RegimeFiscal } from "@/types/client";
import { InfoIcon, CheckCircle2, XCircle } from "lucide-react";

interface GeneralInfoCardProps {
  client: Client;
}

function InfoField({ label, value, colSpan }: { label: string; value?: string | null; colSpan?: number }) {
  return (
    <div className={colSpan === 2 ? "col-span-2 space-y-1" : "space-y-1"}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "-"}</p>
    </div>
  );
}

function BooleanField({ label, value }: { label: string; value?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-1.5">
        {value ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-muted-foreground" />
        )}
        <p className="font-medium">{value ? "Oui" : "Non"}</p>
      </div>
    </div>
  );
}

export function GeneralInfoCard({ client }: GeneralInfoCardProps) {
  const getFormeJuridiqueLabel = (forme: FormeJuridique) => {
    switch (forme) {
      case "sa": return "Société Anonyme (SA)";
      case "sarl": return "Société à Responsabilité Limitée (SARL)";
      case "sas": return "Société par Actions Simplifiée (SAS)";
      case "snc": return "Société en Nom Collectif (SNC)";
      case "association": return "Association";
      case "gie": return "Groupement d'Intérêt Économique (GIE)";
      case "autre": return "Autre";
      default: return forme;
    }
  };

  const getRegimeFiscalLabel = (regime: RegimeFiscal) => {
    switch (regime) {
      case "reel": return "Régime du Réel";
      case "igs": return "Impôt Général Synthétique (IGS)";
      case "non_professionnel": return "Non Professionnel";
      default: return regime;
    }
  };

  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'decimal' }).format(montant) + ' F CFA';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSexeLabel = (sexe?: string) => {
    switch (sexe) {
      case "homme": return "Homme";
      case "femme": return "Femme";
      default: return sexe || "-";
    }
  };

  const getEtatCivilLabel = (etat?: string) => {
    switch (etat) {
      case "celibataire": return "Célibataire";
      case "marie": return "Marié(e)";
      case "divorce": return "Divorcé(e)";
      case "veuf": return "Veuf/Veuve";
      default: return etat || "-";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <InfoIcon className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">Informations générales</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
          {/* Identity section */}
          {client.type === "physique" ? (
            <>
              <InfoField label="Nom" value={client.nom} />
              <InfoField label="Sexe" value={getSexeLabel(client.sexe)} />
              <InfoField label="État civil" value={getEtatCivilLabel(client.etatcivil)} />
            </>
          ) : (
            <>
              <InfoField label="Raison sociale" value={client.raisonsociale} />
              {client.nomcommercial && (
                <InfoField label="Nom commercial" value={client.nomcommercial} />
              )}
              {client.sigle && (
                <InfoField label="Sigle" value={client.sigle} />
              )}
              {client.formejuridique && (
                <InfoField label="Forme juridique" value={getFormeJuridiqueLabel(client.formejuridique)} />
              )}
              {client.nomdirigeant && (
                <InfoField label="Dirigeant" value={client.nomdirigeant} />
              )}
              {client.datecreation && (
                <InfoField label="Date de création" value={formatDate(client.datecreation)} />
              )}
              {client.lieucreation && (
                <InfoField label="Lieu de création" value={client.lieucreation} />
              )}
            </>
          )}

          {/* Fiscal & administrative section */}
          <InfoField label="NIU" value={client.niu} />
          {client.numerorccm && (
            <InfoField label="N RCCM" value={client.numerorccm} />
          )}
          {client.numerocnps && (
            <InfoField label="Numéro CNPS" value={client.numerocnps} />
          )}
          <InfoField label="Centre de rattachement" value={client.centrerattachement} />
          <InfoField label="Régime fiscal" value={getRegimeFiscalLabel(client.regimefiscal)} />
          <InfoField label="Secteur d'activité" value={client.secteuractivite} />

          {/* Real estate section */}
          {client.situationimmobiliere && (
            <div className="col-span-2 md:col-span-3 space-y-1 pt-2 border-t">
              <p className="text-sm text-muted-foreground">Situation immobilière</p>
              <p className="font-medium">
                {client.situationimmobiliere.type === "proprietaire" ? (
                  <>
                    Propriétaire
                    {client.situationimmobiliere.valeur &&
                      ` - Valeur : ${formatMontant(client.situationimmobiliere.valeur)}`
                    }
                  </>
                ) : (
                  <>
                    Locataire
                    {client.situationimmobiliere.loyer &&
                      ` - Loyer mensuel : ${formatMontant(client.situationimmobiliere.loyer)}`
                    }
                  </>
                )}
              </p>
            </div>
          )}

          {/* Management flags */}
          <div className="col-span-2 md:col-span-3 pt-2 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
              <BooleanField label="Gestion externalisée" value={client.gestionexternalisee} />
              {client.inscriptionfanrharmony2 !== undefined && (
                <BooleanField label="Inscription FANR Harmony 2" value={client.inscriptionfanrharmony2} />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
