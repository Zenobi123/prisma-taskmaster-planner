
import { Client } from "@/types/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ContratPrestationsProps {
  client: Client;
}

export function ContratPrestations({ client }: ContratPrestationsProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFormeJuridiqueLabel = (forme?: string) => {
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

  const getRegimeFiscalLabel = (regime?: string) => {
    switch (regime) {
      case "reel": return "Réel";
      case "simplifie": return "Simplifié";
      case "liberatoire": return "Libératoire";
      case "non_professionnel_public": return "Non professionnel (Secteur public)";
      case "non_professionnel_prive": return "Non professionnel (Secteur privé)";
      case "non_professionnel_autre": return "Non professionnel (Autres)";
      case "non_lucratif": return "Organisme à but non lucratif";
      default: return regime;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identification du client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {client.type === "physique" ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{client.nom}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sexe</p>
                  <p className="font-medium capitalize">{client.sexe}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">État civil</p>
                  <p className="font-medium capitalize">{client.etatcivil}</p>
                </div>
                {client.regimefiscal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Régime fiscal</p>
                    <p className="font-medium">{getRegimeFiscalLabel(client.regimefiscal)}</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Raison sociale</p>
                  <p className="font-medium">{client.raisonsociale}</p>
                </div>
                {client.sigle && (
                  <div>
                    <p className="text-sm text-muted-foreground">Sigle</p>
                    <p className="font-medium">{client.sigle}</p>
                  </div>
                )}
                {client.datecreation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Date de création</p>
                    <p className="font-medium">{formatDate(client.datecreation)}</p>
                  </div>
                )}
                {client.lieucreation && (
                  <div>
                    <p className="text-sm text-muted-foreground">Lieu de création</p>
                    <p className="font-medium">{client.lieucreation}</p>
                  </div>
                )}
                {client.nomdirigeant && (
                  <div>
                    <p className="text-sm text-muted-foreground">Dirigeant</p>
                    <p className="font-medium">{client.nomdirigeant}</p>
                  </div>
                )}
                {client.formejuridique && (
                  <div>
                    <p className="text-sm text-muted-foreground">Forme juridique</p>
                    <p className="font-medium">{getFormeJuridiqueLabel(client.formejuridique)}</p>
                  </div>
                )}
                {client.regimefiscal && (
                  <div>
                    <p className="text-sm text-muted-foreground">Régime fiscal</p>
                    <p className="font-medium">{getRegimeFiscalLabel(client.regimefiscal)}</p>
                  </div>
                )}
              </>
            )}

            {client.situationimmobiliere && (
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">Situation immobilière</p>
                <p className="font-medium">
                  {client.situationimmobiliere.type === "proprietaire" 
                    ? `Propriétaire ${client.situationimmobiliere.valeur 
                      ? `- Valeur : ${client.situationimmobiliere.valeur.toLocaleString('fr-FR')} FCFA` 
                      : ''}`
                    : `Locataire ${client.situationimmobiliere.loyer 
                      ? `- Loyer mensuel : ${client.situationimmobiliere.loyer.toLocaleString('fr-FR')} FCFA` 
                      : ''}`
                  }
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">NIU</p>
              <p className="font-medium">{client.niu}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Centre de rattachement</p>
              <p className="font-medium">{client.centrerattachement}</p>
            </div>
            {client.numerocnps && (
              <div>
                <p className="text-sm text-muted-foreground">Numéro CNPS</p>
                <p className="font-medium">{client.numerocnps}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Secteur d'activité</p>
              <p className="font-medium capitalize">{client.secteuractivite}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
