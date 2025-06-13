
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/services/clientService";
import { Client } from "@/types/client";

// Modèles de courriers prédéfinis
const defaultTemplates = [
  {
    id: 'rappel_obligations',
    name: 'Rappel Obligations Fiscales',
    type: 'fiscal',
    description: 'Courrier de rappel pour les obligations fiscales à venir',
    content: `Objet : Rappel des obligations fiscales

Madame, Monsieur [NOM_CLIENT],

Nous vous rappelons que vous avez des obligations fiscales à respecter prochainement.

En tant que contribuable rattaché au [CENTRE_IMPOTS], nous vous invitons à prendre toutes les dispositions nécessaires pour être en règle.

Cordialement,
L'équipe de gestion`
  },
  {
    id: 'convocation_rdv',
    name: 'Convocation Rendez-vous',
    type: 'commercial',
    description: 'Invitation à un rendez-vous pour faire le point sur le dossier',
    content: `Objet : Convocation pour rendez-vous

Madame, Monsieur [NOM_CLIENT],

Nous souhaitons faire le point sur votre dossier et vous invitons à prendre rendez-vous dans nos bureaux.

Votre activité dans le secteur [SECTEUR_ACTIVITE] mérite une attention particulière de notre part.

Dans l'attente de vous rencontrer,
Cordialement`
  },
  {
    id: 'information_nouvelle_reglementation',
    name: 'Information Nouvelle Réglementation',
    type: 'information',
    description: 'Courrier d\'information sur les nouvelles réglementations fiscales',
    content: `Objet : Nouvelle réglementation fiscale

Madame, Monsieur [NOM_CLIENT],

Nous portons à votre connaissance les nouvelles dispositions réglementaires qui entreront en vigueur prochainement.

Ces changements peuvent impacter votre activité dans le secteur [SECTEUR_ACTIVITE].

Nous restons à votre disposition pour toute information complémentaire.

Cordialement,
L'équipe juridique`
  },
  {
    id: 'felicitations_creation',
    name: 'Félicitations Création Entreprise',
    type: 'commercial',
    description: 'Courrier de félicitations pour la création d\'entreprise',
    content: `Objet : Félicitations pour la création de votre entreprise

Madame, Monsieur [NOM_CLIENT],

Nous avons l'honneur de vous féliciter pour la création de votre entreprise.

Votre NIU [NIU] a été enregistré avec succès auprès du [CENTRE_IMPOTS].

Nous sommes ravis de vous accompagner dans cette nouvelle aventure entrepreneuriale.

Très cordialement,
L'équipe commerciale`
  }
];

interface CourrierCriteria {
  type: string;
  regimeFiscal: string;
  secteurActivite: string;
  centreRattachement: string;
  statut: string;
}

export function useCourrierData(criteria: CourrierCriteria) {
  const { data: allClients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const filteredClients = allClients.filter((client: Client) => {
    if (criteria.type && client.type !== criteria.type) return false;
    if (criteria.regimeFiscal && client.regimefiscal !== criteria.regimeFiscal) return false;
    if (criteria.secteurActivite && !client.secteuractivite?.toLowerCase().includes(criteria.secteurActivite.toLowerCase())) return false;
    if (criteria.centreRattachement && client.centrerattachement !== criteria.centreRattachement) return false;
    if (criteria.statut && client.statut !== criteria.statut) return false;
    
    return true;
  });

  return {
    filteredClients,
    templates: defaultTemplates,
    isLoading
  };
}
