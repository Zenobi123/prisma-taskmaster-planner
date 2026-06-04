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
export const APP_VERSION = "1.2.0";

/** Date de la dernière mise à jour de l'aide (AAAA-MM-JJ). */
export const LAST_UPDATED = "2026-06-04";

/**
 * Journal des nouveautés : la première entrée est la plus récente.
 * Ajoutez une entrée à chaque changement majeur.
 */
export const changelog: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: "2026-06-04",
    title: "Création de mission opérationnelle",
    changes: [
      "Le bouton « Nouvelle mission » crée désormais réellement une mission (titre, client, collaborateur, dates).",
      "Le formulaire charge les clients et collaborateurs réels et enregistre la mission ; le tableau de bord et le planning sont mis à jour automatiquement.",
    ],
  },
  {
    version: "1.1.0",
    date: "2026-06-04",
    title: "Documentation détaillée de tous les modules",
    changes: [
      "Enrichissement de chaque rubrique avec le fonctionnement détaillé, fidèle à l'application.",
      "Onglet Fiscal de la Gestion entièrement documenté (ACF, immatriculation, impôts directs, IGS, obligations annuelles, enregistrement automatique).",
      "Détail de la Facturation (devis, factures, propositions, paiements, situation clients) et du Courrier (modèles, publipostage, placeholders, historique).",
      "Ajout des règles de calcul fiscal et des conventions de numérotation des documents.",
    ],
  },
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
        question: "Qu'est-ce que l'exercice comptable et le mode lecture seule ?",
        answer:
          "Plusieurs modules (Gestion, Missions…) affichent un sélecteur d'exercice (année). Lorsqu'un exercice a été clôturé depuis les Paramètres, ses données passent en lecture seule : une bannière vous le signale et la saisie est bloquée pour préserver l'historique. Sélectionnez l'exercice en cours pour reprendre la saisie.",
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
    description: "Vue d'ensemble : indicateurs clés, alertes fiscales et tâches.",
    articles: [
      {
        question: "Que montre le tableau de bord ?",
        answer:
          "Il s'organise en trois blocs : un en-tête (avec création rapide de tâche), des statistiques rapides (cartes chiffrées) et un accordéon d'alertes fiscales repliable. C'est le point de départ recommandé chaque matin.",
      },
      {
        question: "Que contiennent les statistiques rapides ?",
        answer:
          "Des cartes chiffrées et cliquables : obligations non régularisées (DARP non déposées, IGS impayés, situation non conforme), clients en gestion, DSF non déposées, patentes impayées, ainsi que l'activité (clients gérés, missions/tâches en cours). Un badge « À régulariser » apparaît dès qu'un compteur est positif ; cliquer sur une carte ouvre le détail.",
      },
      {
        question: "Quelles alertes fiscales sont suivies ?",
        answer:
          "L'accordéon regroupe : IGS non payé, Attestations de Conformité Fiscale (ACF) qui expirent, Patentes non payées, Impôts immobiliers (Bail, PSL, Taxe Foncière), DSF non déposées et DBEF non déposées (personnes morales). Chaque alerte ouvre la liste des clients concernés, avec un bouton « Gérer » qui mène directement à leur onglet fiscal dans le module Gestion.",
      },
      {
        question: "Les données sont-elles à jour ?",
        answer:
          "Le tableau de bord se rafraîchit automatiquement (environ toutes les 2 minutes) et réagit aux changements en temps réel. L'heure de dernière actualisation est affichée en haut ; cliquer dessus force un rafraîchissement immédiat.",
      },
      {
        question: "Comment créer une tâche rapidement ?",
        answer:
          "Le bouton « Nouvelle tâche » dans l'en-tête ouvre un formulaire (client, collaborateur, description). Les tâches créées se retrouvent ensuite dans le module Mission et dans le Planning.",
      },
    ],
  },
  {
    id: "clients",
    title: "Clients",
    icon: "Users",
    route: "/clients",
    description: "Création, suivi et calcul fiscal automatique des clients.",
    articles: [
      {
        question: "Comment est organisée la page Clients ?",
        answer:
          "Elle présente un en-tête (« Ajouter un client », « Corbeille »), une barre de filtres et la liste des clients (tableau sur ordinateur, cartes sur mobile). Chaque ligne affiche le type, le nom/raison sociale, le NIU, le centre des impôts, la ville et des badges fiscaux et immobiliers calculés automatiquement.",
      },
      {
        question: "Comment ajouter ou modifier un client ?",
        answer:
          "Via « Ajouter un client » (ou l'action « Modifier » d'une ligne). Le formulaire est organisé en sections : type (physique/morale), identité, informations professionnelles, situation fiscale, adresse et contact. Pour une personne morale s'ajoutent le capital social et les actionnaires. Le type ne peut plus être changé après la création.",
      },
      {
        question: "Quelles informations fiscales saisir, et que calcule l'application ?",
        answer:
          "Vous renseignez le NIU, le centre de rattachement, le régime fiscal (IGS, Réel, Non Professionnel, OBNL), le chiffre d'affaires, l'adhésion à un CGA et l'éventuelle licence de boissons. À partir de ces données, l'application calcule et affiche en temps réel l'IGS (avec sa classe), la Patente, la TDL, le Solde IR/IS, la Licence, le PSL, le Bail et la Taxe Foncière, ainsi que le total des obligations.",
      },
      {
        question: "Quelle différence entre personne physique et personne morale ?",
        answer:
          "La personne physique se saisit avec nom/prénoms, sexe et état civil ; la personne morale avec raison sociale, forme juridique, dirigeant, capital et actionnaires. Le type influence aussi la fiscalité : le solde d'impôt s'intitule « Solde IS » pour une personne morale et « Solde IR » pour une personne physique. Côté déclarations annuelles, la DARP ne concerne que les personnes physiques et la DBEF que les personnes morales.",
      },
      {
        question: "Comment filtrer ou rechercher un client ?",
        answer:
          "La barre de filtres permet de rechercher par nom et de filtrer par type, régime fiscal, centre des impôts et statut (actif/inactif). Une case « Afficher les clients archivés » permet d'inclure les fiches archivées.",
      },
      {
        question: "Peut-on importer ou exporter des clients ?",
        answer:
          "Oui. L'import se fait par fichier CSV (un modèle est téléchargeable, avec validation ligne par ligne et aperçu avant import). L'export est disponible en CSV, Excel ou JSON, dans un fichier daté.",
      },
      {
        question: "Comment fonctionnent l'archivage et la corbeille ?",
        answer:
          "Plutôt que de supprimer, vous pouvez « Archiver » un client : il est conservé mais retiré des listes actives. La « Corbeille » liste les clients archivés et permet de les restaurer ou de les supprimer définitivement (avec confirmation).",
      },
    ],
  },
  {
    id: "gestion",
    title: "Gestion",
    icon: "FolderOpen",
    route: "/gestion",
    description: "Dossier du client en gestion : fiscal, comptable, contrats, clôture.",
    articles: [
      {
        question: "À quoi sert le module Gestion ?",
        answer:
          "Il centralise le suivi du dossier d'un client pris en gestion par le cabinet. Seuls les clients dont la gestion est externalisée y apparaissent. Vous choisissez un exercice (année) puis un client ; sa sélection est mémorisée pour vos prochaines visites.",
      },
      {
        question: "Quels sont les onglets du dossier ?",
        answer:
          "Cinq onglets : Fiscal (obligations fiscales, ouvert par défaut), Comptable, Contrats (contrats et prestations), Clôture (clôture d'exercice / montage DSF) et Dossier (pièces et informations).",
      },
      {
        question: "Onglet Fiscal — comment s'organise-t-il ?",
        answer:
          "De haut en bas : sélecteur d'année fiscale, alerte de modifications non enregistrées, Attestation de Conformité Fiscale, Attestation d'Immatriculation, Impôts directs, Obligations annuelles, puis le bouton d'enregistrement. Les modifications sont sauvegardées automatiquement environ 3 secondes après votre dernière action ; un enregistrement manuel reste possible.",
      },
      {
        question: "Onglet Fiscal — Attestation de Conformité Fiscale (ACF)",
        answer:
          "Vous saisissez la date de création ; la date de fin de validité est calculée automatiquement. Le champ change de couleur selon l'échéance (rouge si expirée, orange si elle expire sous 4 jours, vert sinon) et un message invite au renouvellement si besoin. Trois interrupteurs pilotent la remontée d'alertes : « Situation fiscale conforme », « Afficher dans les alertes d'expiration » et « Masquer du tableau de bord ».",
      },
      {
        question: "Onglet Fiscal — Attestation d'Immatriculation",
        answer:
          "Sa validité est de 30 jours : à partir de la date de délivrance, la date d'expiration est calculée automatiquement. Un badge indique le statut (« Expirée » ou nombre de jours restants), avec un code couleur (rouge si expirée, orange à 7 jours ou moins, vert au-delà).",
      },
      {
        question: "Onglet Fiscal — Impôts directs et calcul de l'IGS",
        answer:
          "La section liste l'IGS (toujours affiché), la Patente, le Bail Commercial, le Précompte sur Loyer (PSL) et la Taxe Foncière (TPF) ; hormis l'IGS, un impôt n'apparaît que si le client y est assujetti. Pour l'IGS, vous saisissez le chiffre d'affaires et l'adhésion CGA : le montant est calculé selon un barème par classes, réduit de 50 % pour les adhérents CGA, et passe « Hors barème » au-delà de 50 000 000 F CFA. Un échéancier trimestriel (T1 à T4) enregistre le montant et la date de chaque paiement ; l'acompte théorique par trimestre vaut 25 % du montant annuel, et l'application suit le total payé et le solde restant.",
      },
      {
        question: "Onglet Fiscal — Obligations annuelles (DSF, DARP, DBEF)",
        answer:
          "On y suit la DSF (toujours présente), la DARP (personnes physiques uniquement) et la DBEF (personnes morales uniquement). Pour chacune : assujetti ou non, déposé ou non avec date de dépôt, observations et pièces jointes (justificatifs rangés par client et par année). Un bouton « Actions groupées » permet de tout marquer assujetti / non assujetti / traité en une fois.",
      },
      {
        question: "Comment sont calculés les principaux impôts ?",
        answer:
          "Les règles sont centralisées : la Patente vaut 0,283 % du CA (plancher 141 500, plafond 4 500 000 F CFA) ; le Solde IR/IS vaut 0,1 % du CA au-delà de 15 M F CFA ; le Bail est à 5 % pour les clients OBNL/Non Professionnels (10 % sinon), qui sont par ailleurs exonérés de PSL. Les échéances trimestrielles de l'IGS sont fixées au 15 janvier, 15 mars, 15 juillet et 15 octobre.",
      },
    ],
  },
  {
    id: "facturation",
    title: "Facturation",
    icon: "Receipt",
    route: "/facturation",
    description: "Devis, factures, propositions, paiements et situation clients.",
    articles: [
      {
        question: "Comment est organisé le module Facturation ?",
        answer:
          "Il comporte cinq onglets : Devis, Factures, Propositions (de paiement), Paiements et Situation clients. L'accès est réservé aux administrateurs.",
      },
      {
        question: "Comment créer un devis ?",
        answer:
          "Onglet Devis → « Nouveau devis » : vous choisissez le client, les dates (la validité est proposée à +30 jours), l'objet et les lignes de prestations (chaque ligne est de type « impôt » ou « honoraire »). Des boutons rapides injectent automatiquement l'IGS, la Patente, le PSL, la TDL selon le régime du client, ainsi que des honoraires prédéfinis. Un devis peut ensuite être converti en facture.",
      },
      {
        question: "Comment créer une facture ?",
        answer:
          "Onglet Factures → « Nouvelle facture » : client, date de facturation, date d'échéance, statut, mode de paiement et lignes de prestations (mêmes boutons rapides que les devis). La liste est filtrable par numéro/client, statut du document (brouillon, envoyée, annulée) et statut de paiement (non payée, partiellement payée, payée, en retard). Les montants sont ventilés entre impôts et honoraires.",
      },
      {
        question: "À quoi servent les propositions de paiement ?",
        answer:
          "Une proposition ventile un impôt annuel sur une période : chaque ligne indique une base annuelle et la fraction exigible (par exemple un IGS annuel réparti par trimestre). Elle peut être rattachée à un devis ou une facture, et suit les statuts brouillon, envoyée, acceptée.",
      },
      {
        question: "Comment enregistrer un paiement et générer un reçu ?",
        answer:
          "Onglet Paiements → « Nouveau paiement » : client, facture concernée (ou crédit/avance sans facture), date, montant, mode (espèces, virement, Orange Money, MTN Money) et type (total ou partiel, avec ventilation par prestation). Un reçu est généré automatiquement, avec le montant en chiffres et en toutes lettres, imprimable et exportable en PDF.",
      },
      {
        question: "Que montre l'onglet Situation clients ?",
        answer:
          "Une vue consolidée par client (dettes et règlements), avec un graphique et un état des échéances fiscales. Depuis le détail d'un client, vous pouvez appliquer un crédit (avance) à une facture impayée ou déclencher un rappel.",
      },
      {
        question: "Comment sont numérotés les documents ?",
        answer:
          "Chaque type suit un format dédié : Facture « N° NNNN/AAAA/MM », Devis « DEVIS-NNNN/AAAA/MM », Proposition « PROP-NNNN/AAAA/MM » et Reçu « RECU-NNNN/AAAA ». La numérotation est attribuée automatiquement.",
      },
      {
        question: "Pourquoi un document conserve-t-il les anciennes infos d'un client ?",
        answer:
          "C'est volontaire : à l'émission, chaque document fige une copie des informations du client (snapshot). Un document déjà émis n'est donc jamais altéré par une modification ultérieure de la fiche client, ce qui garantit sa valeur juridique. L'impression et l'export PDF utilisent la signature, le cachet et les coordonnées définis dans les Paramètres.",
      },
    ],
  },
  {
    id: "courrier",
    title: "Courrier",
    icon: "Mail",
    route: "/courrier",
    description: "Rédaction de courriers à partir de modèles, en individuel ou en masse.",
    articles: [
      {
        question: "Comment est organisé le module Courrier ?",
        answer:
          "Deux onglets : Rédaction (sélection du modèle, des clients et envoi) et Historique (archive des courriers générés avec leurs statuts).",
      },
      {
        question: "Comment rédiger un courrier ?",
        answer:
          "Dans l'onglet Rédaction : choisissez le mode (individuel ou en masse), sélectionnez le ou les clients, puis un modèle. Une vingtaine de modèles sont répartis par catégories (fiscal/DGI, relances, client, administratif). Vous pouvez ajouter un message personnalisé, choisir le mode d'envoi (remise en main propre, courrier postal, email, fax), prévisualiser, puis « Générer & Enregistrer ».",
      },
      {
        question: "Comment fonctionne l'envoi en masse (publipostage) ?",
        answer:
          "En mode « masse », vous appliquez des critères (type, régime fiscal, secteur, centre de rattachement) pour cibler automatiquement un ensemble de clients. La génération produit alors un courrier par client sélectionné, chacun avec son propre numéro et ses données substituées.",
      },
      {
        question: "Comment les informations du client sont-elles insérées ?",
        answer:
          "Les modèles contiennent des champs dynamiques remplacés automatiquement à la génération : {CLIENT_NOM}, {CLIENT_NIU}, {CLIENT_VILLE}, {CLIENT_QUARTIER}, {CLIENT_CONTACT} et {CIVILITE} (toujours « Madame » ou « Monsieur »). Certains modèles (transmission de devis, rappel des délais, proposition d'avance…) injectent en plus les chiffres fiscaux réels du client, comme la classe et le montant d'IGS ou la Patente.",
      },
      {
        question: "Où retrouver les courriers déjà générés ?",
        answer:
          "Dans l'onglet Historique : chaque courrier porte un numéro au format « CRR-NNNN/AAAA/MM » et un statut (brouillon, envoyé, accusé de réception, classé). Vous pouvez le consulter, l'imprimer, faire évoluer son statut ou le supprimer.",
      },
    ],
  },
  {
    id: "missions",
    title: "Missions",
    icon: "Briefcase",
    route: "/missions",
    description: "Suivi des missions et tâches confiées au cabinet.",
    articles: [
      {
        question: "À quoi sert le module Mission ?",
        answer:
          "Il liste les missions et tâches du cabinet sous forme de cartes (paginées), chacune rattachée à un client et à un collaborateur, avec ses dates et son statut. Comme les autres modules, il suit l'exercice comptable sélectionné.",
      },
      {
        question: "Comment créer une mission ?",
        answer:
          "Cliquez sur « Nouvelle mission » en haut du module : renseignez le titre, choisissez éventuellement un client, assignez un collaborateur (parmi les collaborateurs actifs) et fixez les dates de début et de fin. À l'enregistrement, la mission apparaît dans la liste, alimente le planning et remonte dans le tableau de bord ; son statut initial (en attente ou en cours) est déduit de la date de début.",
      },
      {
        question: "Comment suivre l'avancement d'une mission ?",
        answer:
          "Chaque mission affiche un statut coloré : en attente, en cours, terminée ou en retard. Depuis la carte, un menu « Statut » permet de la faire évoluer. Les missions terminées depuis plus de 30 jours sont masquées des listes courantes pour rester lisible.",
      },
      {
        question: "Comment filtrer les missions ?",
        answer:
          "Une recherche libre (par titre, client ou collaborateur) et un filtre par statut sont disponibles. Les missions sont triées par priorité d'état (en cours, en attente, en retard, puis terminées).",
      },
      {
        question: "Quels documents peut-on rattacher à une mission ?",
        answer:
          "Chaque carte propose de générer un « Ordre de mission » et de téléverser un « Rapport de mission ». La suppression d'une mission est irréversible et supprime ses documents associés (une confirmation est demandée).",
      },
      {
        question: "Quel lien avec le Planning et le Dashboard ?",
        answer:
          "Les tâches et missions alimentent le Planning des collaborateurs et remontent dans les indicateurs et alertes du tableau de bord.",
      },
    ],
  },
  {
    id: "planning",
    title: "Planning",
    icon: "Calendar",
    route: "/planning",
    description: "Vue calendrier des échéances et de la charge de l'équipe.",
    articles: [
      {
        question: "Comment lire le planning ?",
        answer:
          "La page combine un calendrier (à gauche) et la liste des événements du jour sélectionné (à droite). Les journées comportant des événements sont signalées par un point sous la date ; cliquez sur un jour pour afficher ses événements.",
      },
      {
        question: "Que contient un événement ?",
        answer:
          "Les événements proviennent des missions/tâches : ils affichent le titre, le client, le collaborateur, l'heure et un type (Mission ou Réunion). C'est une vue de consultation pour visualiser la charge et anticiper les échéances.",
      },
      {
        question: "Comment filtrer par collaborateur ou exporter ?",
        answer:
          "Un filtre permet de n'afficher que les événements d'un collaborateur (ou de tous). Un bouton « Exporter » est disponible au-dessus de la liste des événements.",
      },
    ],
  },
  {
    id: "collaborateurs",
    title: "Collaborateurs",
    icon: "UserCog",
    route: "/collaborateurs",
    description: "Gestion du personnel et des accès (réservé aux administrateurs).",
    articles: [
      {
        question: "Qui peut gérer les collaborateurs ?",
        answer:
          "Ce module est réservé aux administrateurs. Il liste le personnel (tableau sur ordinateur, cartes sur mobile) avec nom, poste, email, date d'entrée, statut et nombre de tâches en cours. Une recherche et des filtres (statut, poste) sont disponibles.",
      },
      {
        question: "Comment créer ou modifier un collaborateur ?",
        answer:
          "Via « Nouveau collaborateur » ou l'action « Modifier ». Le formulaire couvre les informations personnelles (nom, prénom, email, téléphone, date de naissance), professionnelles (rôle, niveau d'étude, date d'entrée), l'adresse et les permissions d'accès. Une fiche détaillée est accessible pour chaque collaborateur.",
      },
      {
        question: "Quels rôles existent et comment agissent-ils ?",
        answer:
          "Les rôles incluent notamment expert-comptable, comptable, gestionnaire, fiscaliste et assistant, ainsi qu'administrateur. Le rôle détermine les modules visibles et les actions autorisées : par exemple, seuls les administrateurs accèdent à la Facturation, aux Collaborateurs et aux Paramètres.",
      },
      {
        question: "Comment gérer le statut d'un collaborateur ?",
        answer:
          "Depuis le menu d'actions, vous pouvez activer/désactiver un collaborateur, consulter son profil, le modifier ou le supprimer (action irréversible, avec confirmation).",
      },
    ],
  },
  {
    id: "rapports",
    title: "Rapports",
    icon: "FileText",
    route: "/rapports",
    description: "Génération de rapports d'analyse au format PDF.",
    articles: [
      {
        question: "Quels rapports puis-je générer ?",
        answer:
          "Le module propose une vingtaine de rapports répartis en familles : financiers (chiffre d'affaires, facturation, créances, état des devis, des propositions et des reçus), clients (portefeuille, nouveaux clients, activité, personnes morales/physiques, par centre d'impôt, assujettis IGS/Patente, régime du réel), fiscaux (obligations, retards), RH/paie (masse salariale, effectifs) et opérationnels (suivi des tâches, performance des collaborateurs).",
      },
      {
        question: "Comment trouver et générer un rapport ?",
        answer:
          "Utilisez la recherche (sur le titre et la description) et le filtre par type pour cibler le rapport voulu, puis cliquez sur « Générer ». Le document est produit au format PDF et téléchargé automatiquement ; un message vous informe du succès ou d'une éventuelle erreur.",
      },
    ],
  },
  {
    id: "parametres",
    title: "Paramètres",
    icon: "Settings",
    route: "/parametres",
    description: "Configuration du cabinet, des documents et des comptes.",
    articles: [
      {
        question: "Quels réglages trouve-t-on dans les Paramètres ?",
        answer:
          "Les Paramètres sont organisés en onglets : Profil, Cabinet (impressions), Clôture annuelle, Application, Sécurité, Notifications, et Utilisateurs (réservé aux administrateurs). La page n'est accessible qu'aux administrateurs.",
      },
      {
        question: "Onglet Cabinet — que configure-t-on pour les documents ?",
        answer:
          "C'est l'onglet clé pour les impressions : identité du cabinet (nom, slogan, siège, téléphone, NIU), signataire (nom, fonction), images de signature et de cachet (téléversées), mention de pied de page, et coordonnées de paiement par défaut. Ces éléments alimentent automatiquement tous les documents imprimés (factures, devis, reçus, courriers).",
      },
      {
        question: "Onglet Clôture annuelle — à quoi sert-il ?",
        answer:
          "Il permet de clôturer un exercice comptable : ses factures, paiements, missions et états fiscaux cessent alors de s'afficher par défaut et passent en lecture seule. Un « point de clôture » détaillé est généré/imprimé. L'historique des clôtures permet de réimprimer ce point ou de rouvrir un exercice si nécessaire.",
      },
      {
        question: "Onglets Profil, Application, Sécurité et Notifications",
        answer:
          "Profil : vos informations personnelles. Application : préférences d'interface et de comportement (mode sombre, sauvegarde automatique, fréquence de rafraîchissement). Sécurité : changement de mot de passe (l'authentification à deux facteurs est prévue). Notifications : choix des canaux (email, application) et des types d'événements notifiés (factures, paiements, clients, rappels).",
      },
      {
        question: "Onglet Utilisateurs — gestion des comptes",
        answer:
          "Réservé aux administrateurs, il permet de créer des comptes utilisateurs, de leur attribuer un rôle (admin, comptable, gestionnaire, expert-comptable, fiscaliste, assistant) et de les modifier ou supprimer. Le rôle conditionne l'accès aux différents modules.",
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
          "Renseignez soigneusement les fiches clients (type, NIU, régime, chiffre d'affaires, CGA) : tous les calculs fiscaux et les documents en dépendent. Consultez régulièrement les alertes du tableau de bord pour ne manquer aucune échéance.",
      },
      {
        question: "Mes saisies dans l'onglet Fiscal sont-elles enregistrées ?",
        answer:
          "Oui : l'onglet Fiscal de la Gestion enregistre automatiquement vos modifications quelques secondes après votre dernière action, et une alerte signale toute modification non encore enregistrée. Vous pouvez aussi enregistrer manuellement via le bouton dédié en bas de l'onglet.",
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
