/**
 * Contenu du module d'Aide de PRISMA GESTION.
 *
 * ⚠️ MAINTENANCE — À mettre à jour à CHAQUE changement majeur de l'application :
 *   1. Incrémentez `APP_VERSION` et mettez `LAST_UPDATED` à la date du jour.
 *   2. Ajoutez une entrée en tête de `changelog` décrivant les nouveautés.
 *   3. Si une fonctionnalité est ajoutée/modifiée, ajustez la rubrique
 *      correspondante dans `aideSections` (ou ajoutez-en une nouvelle).
 *
 * Tout le contenu est centralisé ici pour que la page `Aide.tsx` reste générique.
 */

export interface AideArticle {
  /** Question / titre court de l'article. */
  question: string;
  /** Réponse détaillée. Le texte est affiché tel quel (sauts de ligne respectés). */
  answer: string;
}

export interface AideSection {
  /** Identifiant stable (utilisé comme clé et ancre). */
  id: string;
  /** Titre de la rubrique. */
  title: string;
  /** Nom de l'icône lucide-react associée (voir mapping dans Aide.tsx). */
  icon: string;
  /** Route de l'application concernée par la rubrique (facultatif). */
  route?: string;
  /** Courte description affichée sous le titre. */
  description: string;
  /** Liste des articles (questions/réponses) de la rubrique. */
  articles: AideArticle[];
}

export interface ChangelogEntry {
  version: string;
  date: string; // format ISO court AAAA-MM-JJ
  title: string;
  changes: string[];
}

/** Version courante de l'application telle qu'affichée dans l'aide. */
export const APP_VERSION = "1.0.0";

/** Date de la dernière mise à jour de l'aide (AAAA-MM-JJ). */
export const LAST_UPDATED = "2026-06-04";

/**
 * Journal des nouveautés : la première entrée est la plus récente.
 * Ajoutez une entrée à chaque changement majeur.
 */
export const changelog: ChangelogEntry[] = [
  {
    version: "1.0.0",
    date: "2026-06-04",
    title: "Lancement du module d'Aide",
    changes: [
      "Ajout du module Aide accessible depuis le menu latéral.",
      "Documentation complète du fonctionnement de chaque module de l'application.",
      "Mise en place d'une recherche dans l'aide et d'un journal des nouveautés.",
    ],
  },
];

/**
 * Rubriques d'aide. Chaque rubrique décrit un module de l'application.
 * L'ordre suit le parcours naturel de l'utilisateur.
 */
export const aideSections: AideSection[] = [
  {
    id: "demarrage",
    title: "Premiers pas",
    icon: "Rocket",
    description: "Comprendre l'organisation générale de PRISMA GESTION.",
    articles: [
      {
        question: "À quoi sert PRISMA GESTION ?",
        answer:
          "PRISMA GESTION est l'outil de gestion du cabinet : il centralise les clients, leurs obligations fiscales, la facturation, le courrier, les missions et le planning des collaborateurs. L'objectif est de disposer d'une vue unique et fiable sur l'ensemble de l'activité du cabinet.",
      },
      {
        question: "Comment se connecter ?",
        answer:
          "L'accès se fait via la page de connexion avec votre adresse e-mail et votre mot de passe. Toutes les pages sont protégées : sans session active, vous êtes automatiquement redirigé vers l'écran de connexion. Pour vous déconnecter, utilisez le bouton situé en bas du menu latéral.",
      },
      {
        question: "Comment naviguer dans l'application ?",
        answer:
          "Le menu latéral gauche donne accès à tous les modules : Dashboard, Clients, Gestion, Mission, Planning, Facturation, Courrier, Rapports, Paramètres et Aide. Sur mobile, ce menu s'ouvre via le bouton en haut à gauche. Le menu peut être réduit sur ordinateur pour gagner de la place.",
      },
      {
        question: "Certains menus n'apparaissent pas, pourquoi ?",
        answer:
          "L'affichage dépend de votre rôle. Les modules sensibles (Collaborateurs, Facturation, Paramètres) sont réservés aux administrateurs. Si une rubrique vous manque, contactez l'administrateur du cabinet pour vérifier vos droits.",
      },
    ],
  },
  {
    id: "dashboard",
    title: "Tableau de bord",
    icon: "LayoutDashboard",
    route: "/",
    description: "Vue d'ensemble : indicateurs clés, alertes et tâches.",
    articles: [
      {
        question: "Que montre le tableau de bord ?",
        answer:
          "Il rassemble les indicateurs clés (statistiques rapides), les alertes fiscales (patentes impayées, DSF non déposées, IGS en retard, attestations qui expirent) et les tâches en cours. C'est le point de départ recommandé chaque matin.",
      },
      {
        question: "Les données sont-elles à jour ?",
        answer:
          "Le tableau de bord se rafraîchit automatiquement et écoute les changements en temps réel. L'heure de dernière actualisation est affichée en haut ; cliquer dessus force un rafraîchissement immédiat.",
      },
      {
        question: "Comment créer une tâche rapidement ?",
        answer:
          "Le bouton de création de tâche est disponible directement dans l'en-tête du tableau de bord. Les tâches créées se retrouvent ensuite dans le module Mission et le Planning.",
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    icon: "Users",
    route: "/clients",
    description: "Création et suivi des clients et de leurs données fiscales.",
    articles: [
      {
        question: "Comment ajouter ou modifier un client ?",
        answer:
          "Depuis le module Clients, utilisez le formulaire de création/édition pour saisir l'identité (personne physique ou morale), le NIU, le centre des impôts, la ville, le quartier, le contact et le régime fiscal. Ces informations alimentent automatiquement les calculs fiscaux et les documents.",
      },
      {
        question: "Quelle est la différence entre personne physique et personne morale ?",
        answer:
          "Le type de client influence la fiscalité et l'intitulé de certains impôts. Par exemple, le solde d'impôt s'appelle « Solde IS » pour une personne morale et « Solde IR » pour une personne physique. Renseignez ce champ avec soin.",
      },
      {
        question: "Peut-on importer ou exporter des clients ?",
        answer:
          "Oui, le module propose des outils d'import et d'export pour traiter les clients en lot plutôt qu'un par un, ce qui est utile lors de la reprise d'un portefeuille.",
      },
    ],
  },
  {
    id: "gestion",
    title: "Gestion fiscale",
    icon: "FolderOpen",
    route: "/gestion",
    description: "Situation fiscale du client : obligations et paiements.",
    articles: [
      {
        question: "Que permet le module Gestion ?",
        answer:
          "Il présente la situation fiscale complète d'un client : obligations (IGS, Patente, Solde IR/IS, TDL, taxes foncières, licence boissons…), montants calculés, échéances et paiements enregistrés. C'est le cœur du suivi fiscal.",
      },
      {
        question: "Comment les impôts sont-ils calculés ?",
        answer:
          "Les calculs reposent sur des règles officielles centralisées : l'IGS suit un barème par classes (réduction de 50 % pour les adhérents CGA), la Patente vaut 0,283 % du chiffre d'affaires (plancher 141 500 et plafond 4 500 000 F CFA), le Solde IR/IS vaut 0,1 % du CA au-delà de 15 M F CFA, etc. Vous n'avez qu'à saisir les données de base, l'application applique les barèmes.",
      },
      {
        question: "Comment sont gérés les retards de paiement ?",
        answer:
          "Pour l'IGS, les pénalités sont de 10 % par mois de retard, calculées sur les acomptes trimestriels dont les échéances sont fixées au 15 janvier, 15 mars, 15 juillet et 15 octobre. Les clients en retard remontent en alerte sur le tableau de bord.",
      },
    ],
  },
  {
    id: "facturation",
    title: "Facturation",
    icon: "Receipt",
    route: "/facturation",
    description: "Factures, devis, propositions de paiement et reçus.",
    articles: [
      {
        question: "Quels documents puis-je émettre ?",
        answer:
          "Le module Facturation gère quatre types de documents : les factures, les devis (proformas), les propositions de paiement et les reçus. Chacun dispose de sa propre numérotation et de son propre suivi.",
      },
      {
        question: "Comment fonctionne la numérotation des documents ?",
        answer:
          "Chaque type suit un format dédié : Facture « N° NNNN/AAAA/MM », Devis « DEVIS-NNNN/AAAA/MM », Reçu « RECU-NNNN/AAAA » et Courrier « CRR-NNNN/AAAA/MM ». La numérotation est gérée automatiquement.",
      },
      {
        question: "Pourquoi un document conserve-t-il les anciennes infos d'un client ?",
        answer:
          "C'est volontaire : au moment de l'émission, chaque document fige une copie des informations du client. Ainsi un document déjà émis n'est jamais altéré par une modification ultérieure de la fiche client, ce qui garantit sa valeur juridique.",
      },
      {
        question: "Comment imprimer ou exporter en PDF ?",
        answer:
          "Chaque document peut être imprimé ou exporté en PDF (mise en page A4). Le nom du fichier est généré automatiquement à partir du numéro et du client.",
      },
    ],
  },
  {
    id: "courrier",
    title: "Courrier",
    icon: "Mail",
    route: "/courrier",
    description: "Rédaction de courriers à partir de modèles prédéfinis.",
    articles: [
      {
        question: "Comment rédiger un courrier ?",
        answer:
          "Le module Courrier propose une vingtaine de modèles répartis en trois catégories : fiscal/DGI, client et administratif. Sélectionnez un modèle, choisissez le client concerné, et le texte est pré-rempli.",
      },
      {
        question: "Comment les informations du client sont-elles insérées ?",
        answer:
          "Les modèles contiennent des champs dynamiques (nom, NIU, ville, quartier, contact, civilité) qui sont remplacés automatiquement par les données réelles du client au moment de la génération. Certains modèles injectent aussi les chiffres fiscaux à jour.",
      },
    ],
  },
  {
    id: "missions",
    title: "Missions",
    icon: "Briefcase",
    route: "/missions",
    description: "Suivi des missions et des tâches du cabinet.",
    articles: [
      {
        question: "À quoi sert le module Mission ?",
        answer:
          "Il permet de créer et suivre les missions et tâches confiées au cabinet, d'en visualiser l'avancement et de les rattacher à des clients et à des collaborateurs.",
      },
      {
        question: "Quel lien avec le Planning et le Dashboard ?",
        answer:
          "Les tâches créées ici (ou depuis le tableau de bord) alimentent le Planning des collaborateurs et remontent dans les indicateurs du tableau de bord.",
      },
    ],
  },
  {
    id: "planning",
    title: "Planning",
    icon: "Calendar",
    route: "/planning",
    description: "Vue calendrier de l'activité des collaborateurs.",
    articles: [
      {
        question: "Comment lire le planning ?",
        answer:
          "Le Planning offre une vue calendrier de l'activité des collaborateurs : il permet de visualiser la charge, de répartir le travail et d'anticiper les échéances importantes.",
      },
    ],
  },
  {
    id: "collaborateurs",
    title: "Collaborateurs",
    icon: "UserCog",
    route: "/collaborateurs",
    description: "Gestion du personnel du cabinet (réservé aux administrateurs).",
    articles: [
      {
        question: "Qui peut gérer les collaborateurs ?",
        answer:
          "Ce module est réservé aux administrateurs. Il permet de créer les collaborateurs, de définir leur rôle et donc leurs droits d'accès aux différents modules.",
      },
      {
        question: "Comment les rôles influencent-ils l'application ?",
        answer:
          "Le rôle attribué détermine les modules visibles et les actions autorisées. Par exemple, seuls les administrateurs accèdent à la Facturation et aux Paramètres.",
      },
    ],
  },
  {
    id: "rapports",
    title: "Rapports",
    icon: "FileText",
    route: "/rapports",
    description: "Génération de rapports d'analyse détaillés.",
    articles: [
      {
        question: "Quels rapports puis-je générer ?",
        answer:
          "Le module Rapports couvre plusieurs familles : financiers (chiffre d'affaires, facturation, créances), clients (portefeuille, personnes morales/physiques, par centre d'impôt, assujettis IGS/Patente…), fiscaux (obligations, retards), RH (masse salariale, effectifs) et opérationnels (suivi des tâches, performance).",
      },
      {
        question: "Comment télécharger un rapport ?",
        answer:
          "Utilisez la recherche et le filtre par type pour trouver le rapport voulu, puis lancez sa génération. Le fichier est produit et téléchargé automatiquement.",
      },
    ],
  },
  {
    id: "parametres",
    title: "Paramètres",
    icon: "Settings",
    route: "/parametres",
    description: "Configuration du cabinet (réservé aux administrateurs).",
    articles: [
      {
        question: "Que configure-t-on dans les Paramètres ?",
        answer:
          "Les Paramètres permettent de configurer les éléments du cabinet utilisés dans les documents : signature, cachet et signataire. Ces réglages sont réservés aux administrateurs et s'appliquent à l'ensemble des documents émis.",
      },
    ],
  },
  {
    id: "astuces",
    title: "Astuces & bonnes pratiques",
    icon: "Lightbulb",
    description: "Conseils pour tirer le meilleur parti de l'application.",
    articles: [
      {
        question: "Comment garder des données fiables ?",
        answer:
          "Renseignez soigneusement les fiches clients (type, NIU, régime, CA) : tous les calculs fiscaux et les documents en dépendent. Vérifiez les alertes du tableau de bord régulièrement pour ne manquer aucune échéance.",
      },
      {
        question: "Les montants s'affichent-ils toujours de la même façon ?",
        answer:
          "Oui, les montants sont systématiquement arrondis et formatés en francs CFA (par exemple « 1 234 567 F CFA ») pour une lecture homogène dans toute l'application.",
      },
      {
        question: "Où trouver les nouveautés de l'application ?",
        answer:
          "L'onglet « Nouveautés » de cette page d'aide récapitule, version par version, les changements majeurs apportés à l'application. Pensez à le consulter après chaque mise à jour.",
      },
    ],
  },
];
