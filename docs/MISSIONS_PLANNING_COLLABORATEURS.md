# Documentation des modules : Missions, Planning et Collaborateurs

Cette documentation décrit en détail le fonctionnement des trois modules complémentaires de PRISMA GESTION qui structurent la **gestion opérationnelle du cabinet** : la création et le suivi des missions confiées aux clients, la planification des échéances dans le temps, et la gestion des ressources humaines (collaborateurs) qui les exécutent.

Ces trois modules sont profondément interconnectés : une **mission** est une tâche affectée à un **collaborateur** pour un client, qui apparaît automatiquement dans le **planning** à la date prévue. Les compteurs de charge de travail des collaborateurs sont synchronisés en temps réel avec les statuts des missions.

---

## Table des matières

1. [Module Missions](#1-module-missions)
2. [Module Planning](#2-module-planning)
3. [Module Collaborateurs](#3-module-collaborateurs)
4. [Interactions entre les trois modules](#4-interactions-entre-les-trois-modules)
5. [Tableau récapitulatif des permissions](#5-tableau-récapitulatif-des-permissions)

---

## 1. Module Missions

**Route** : `/missions` → `src/pages/Missions.tsx`

### 1.1. Objectif fonctionnel

Le module Missions permet au cabinet de **créer, attribuer, suivre et clôturer** les missions confiées à ses collaborateurs pour le compte des clients. Une mission est définie par :

- un **titre** (ex. : « Audit fiscal 2025 », « Déclaration DSF »),
- un **client** rattaché (optionnel),
- un **collaborateur assigné** (obligatoire ; uniquement les collaborateurs actifs),
- une **date de début** et une **date de fin**,
- un **statut** qui évolue automatiquement ou manuellement.

Les missions sont stockées dans la table Supabase `tasks` (la dénomination interne « task » s'explique par l'historique technique, mais l'expression métier reste « mission »).

### 1.2. Rôles autorisés

L'accès au module est restreint aux rôles suivants via le hook `useAuthorization` :

- `admin`
- `comptable`
- `gestionnaire`
- `expert-comptable`
- `fiscaliste`
- `assistant`

Les utilisateurs non autorisés sont redirigés vers `CollaborateurUnauthorized`.

### 1.3. Interface utilisateur

#### En-tête (`MissionHeader.tsx`)

- Bouton **« Retour »** vers le tableau de bord.
- Titre **« Missions »** et sous-titre descriptif.
- Bouton **« Nouvelle mission »** ouvrant la boîte de dialogue de création.
- À droite : un **sélecteur d'exercice comptable** (`ExerciceSelector`) permettant de consulter les missions des années antérieures.

#### Filtres (`MissionFilters.tsx`)

- **Recherche textuelle** sur trois champs simultanément :
  - le titre de la mission,
  - le nom du client,
  - le nom du collaborateur assigné.
- **Filtre par statut** : Tous / En attente / En cours / Terminée / En retard.

#### Liste paginée (`MissionList.tsx` + `MissionPagination.tsx`)

- Affichage par **lots de 10 missions** par page.
- Tri automatique par **priorité de statut** :
  1. En cours
  2. En attente
  3. En retard
  4. Terminée

#### Carte de mission (`MissionCard.tsx`)

Chaque mission est représentée par une carte affichant :

- le **titre** et le **client**,
- le **collaborateur assigné** (« Assigné à : »),
- la **plage de dates** (« Du JJ/MM/AAAA au JJ/MM/AAAA »),
- un **badge de statut** coloré,
- les actions disponibles (détaillées ci-dessous).

### 1.4. Cycle de vie d'une mission (statuts)

Le service `taskService.ts` orchestre les transitions de statut :

| Statut | Badge | Description | Déclencheur |
|---|---|---|---|
| `en_attente` | outline (gris) | Mission planifiée mais pas encore démarrée | Date de début dans le futur |
| `en_cours` | secondary | Mission active | Date de début ≤ aujourd'hui |
| `en_retard` | destructive (rouge) | Date de fin dépassée sans clôture | Date de fin < aujourd'hui ET statut ≠ termine |
| `termine` | success (vert) | Mission clôturée | Action manuelle de l'utilisateur |
| `planifiee` | bleu | (Statut UI uniquement, non persisté en base) | — |

**Mise à jour automatique** : à chaque appel de `getTasks()`, la fonction `updateTaskStatusesBasedOnDates()` parcourt l'ensemble des missions et applique les transitions logiques basées sur les dates du jour.

### 1.5. Création d'une mission (`NewMissionDialog.tsx` + `MissionForm.tsx`)

Un formulaire modal demande :

1. **Titre de la mission** (obligatoire, texte libre)
2. **Client** (optionnel ; liste déroulante des clients particuliers et entreprises)
3. **Collaborateur assigné** (obligatoire ; seuls les collaborateurs au statut `actif` sont proposés)
4. **Date de début** (obligatoire)
5. **Date de fin** (obligatoire ; doit être ≥ date de début)

**Validations métier** :

- Tous les champs obligatoires doivent être renseignés.
- `endDate < startDate` est rejeté avec un toast d'erreur.
- À la création, `determineInitialStatus()` calcule le statut initial selon la date de début.

À la création réussie, les caches React Query `["missions"]`, `["tasks"]` et `["collaborateurs"]` sont invalidés pour rafraîchir la page Missions, le tableau de bord, le planning et le compteur de tâches du collaborateur.

### 1.6. Actions disponibles sur une mission

Chaque `MissionCard` propose quatre actions :

#### a) Ordre de mission (`OrdreMissionDialog.tsx`)

Génère automatiquement **3 exemplaires** d'ordres de mission :

- **Missionnaire** — instructions et programme de travail (badge bleu)
- **Superviseur** — copie avec points de contrôle (badge violet)
- **Contribuable** — lettre officielle simplifiée pour le client (badge vert)

Ces documents apparaissent dans le module **Courrier → Historique** et peuvent être imprimés / exportés en PDF. Le dialogue affiche également la liste des ordres déjà générés avec leur référence et leur date.

#### b) Rapport de mission (`RapportMissionUpload.tsx`)

Permet de **soumettre un rapport de mission** au format :

- **JSON** (recommandé, schéma structuré),
- **Markdown** (`.md`),
- **Texte brut** (`.txt`).

Le rapport doit contenir les sections : `objet`, `periode`, `travaux_realises`, `constatations`, `anomalies`, `recommandations`, `conclusion`.

À la soumission, le système génère automatiquement **deux courriers** :

- **Version superviseur** — inclut les anomalies détectées,
- **Version client** — version expurgée (anomalies retirées).

Une zone de dépôt drag-and-drop facilite l'import du fichier, et un **aperçu** du contenu parsé est affiché avant validation.

#### c) Changement de statut

Menu déroulant proposant les transitions manuelles : `En attente`, `En cours`, `Terminée`. L'option correspondant au statut courant est désactivée.

#### d) Suppression

Bouton avec icône poubelle, protégé par un **AlertDialog de confirmation** (« Cette action est irréversible. La mission et ses documents associés seront supprimés »).

### 1.7. Intégration avec l'exercice comptable

Le module respecte la logique de **clôture d'exercice** :

- En mode normal, on n'affiche que les missions de l'exercice en cours.
- Si un exercice clos est consulté, un bandeau « lecture seule » s'affiche et l'historique complet est visible (y compris les missions terminées il y a plus de 30 jours).
- En mode courant, les missions `termine` créées il y a plus de 30 jours sont masquées par défaut pour alléger l'affichage.

---

## 2. Module Planning

**Route** : `/planning` → `src/pages/Planning.tsx`

### 2.1. Objectif fonctionnel

Le module Planning offre une **vue calendaire** des missions et événements du cabinet. Il permet aux gestionnaires de visualiser la **charge de travail** par jour et par collaborateur, et de coordonner les interventions.

Contrairement au module Missions qui présente une liste paginée, le Planning est centré sur l'**axe temporel** : on choisit une date, on voit ce qui s'y passe.

### 2.2. Rôles autorisés

Mêmes rôles que le module Missions :

- `admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 2.3. Source des données

Les événements affichés sont **dérivés des missions** (table `tasks`). Le hook `usePlanning` (`src/hooks/usePlanning.tsx`) :

1. Récupère toutes les tâches via `getTasks()`.
2. Récupère tous les collaborateurs via `getCollaborateurs()`.
3. Transforme les tâches en `Event[]` via `transformTasksToEvents()`.
4. Extrait les dates uniques via `extractDatesWithEvents()` pour les marquer sur le calendrier.

#### Typologie des événements

`transformTasksToEvents()` distingue **deux types** :

- **Mission** (badge gris) — type par défaut.
- **Réunion** (badge contour) — détectée si le titre contient le mot « réunion ».

### 2.4. Interface utilisateur

#### En-tête

- Bouton **« Retour »** vers le tableau de bord.
- Titre **« Planning »** + sous-titre « Consultez le calendrier des échéances et la charge de travail de l'équipe ».
- À droite : **filtre par collaborateur** (`CollaboratorFilter`).

#### Colonne gauche — Calendrier (`CalendarView.tsx`)

- Calendrier mensuel en mode **sélection simple**.
- Les jours qui contiennent au moins un événement sont **marqués d'une pastille bleue** sous le numéro.
- Pied de carte affichant la date sélectionnée formatée en français (« lundi 6 juin 2026 »).

#### Colonne droite — Liste des événements (`EventsList.tsx`)

- Titre dynamique : « Événements du \[date sélectionnée\] ».
- Bouton **« Exporter »** (CSV ou PDF) en haut à droite.
- Chaque événement est une **carte** affichant :
  - le **titre**,
  - le **client**,
  - le **collaborateur** assigné,
  - la **plage horaire** (start_time → end_time, défaut `00:00 - 00:00`),
  - un **badge** indiquant si c'est une mission ou une réunion.
- Si aucun événement n'est trouvé : message « Aucun événement trouvé pour cette date » avec icône calendrier.

### 2.5. Filtrage (`CollaboratorFilter.tsx`)

- Menu déroulant en haut à droite proposant :
  - **« Tous les collaborateurs »** (par défaut),
  - la liste des collaborateurs actifs (prénom + nom).
- Le filtre se combine avec la sélection de date : on ne voit que les missions du collaborateur choisi à la date sélectionnée.

Logique de filtrage (`filterEvents()` dans `src/utils/planningUtils.ts`) :

```
événement visible ⇔ (collaborateur = "all" OU collaborateur = filtre)
                  ET (date_événement = date_sélectionnée)
```

### 2.6. Export (`ExportOptions.tsx`)

Le bouton **« Exporter »** propose deux formats :

- **CSV** — fichier `planning-YYYY-MM-DD.csv` contenant les événements filtrés.
- **PDF** — document intitulé « Planning d'événements » exporté via `exportToPdf()`.

Les exports respectent le filtre actif (collaborateur + date sélectionnée).

### 2.7. Limites actuelles

- Le module **ne permet pas la création** directe d'événements : les missions doivent être créées depuis la page Missions.
- Les **réunions** sont une convention de nommage (titre contenant « réunion ») et non une entité distincte.
- Les **horaires** (start_time / end_time) ne sont pas saisis dans le formulaire de mission standard ; ils s'affichent à `00:00 - 00:00` par défaut.

---

## 3. Module Collaborateurs

**Route** : `/collaborateurs` → `src/pages/Collaborateurs.tsx`

### 3.1. Objectif fonctionnel

Le module Collaborateurs gère les **ressources humaines du cabinet** : ajout, modification, désactivation et suppression des comptes, attribution des rôles métier et configuration des permissions d'accès aux modules.

Il sert également de **référentiel** pour :

- l'assignation des missions (un collaborateur actif = un assignable),
- l'affichage du calendrier de planning (filtre par collaborateur),
- la signature des courriers et la désignation du superviseur de mission.

### 3.2. Rôles autorisés

**Module strictement réservé à l'administrateur** (`["admin"]`). Tous les autres rôles reçoivent l'écran `CollaborateurUnauthorized`.

### 3.3. Structure d'un collaborateur

Le type `Collaborateur` (`src/types/collaborateur.ts`) comporte :

#### Informations personnelles

- `nom`, `prenom` (obligatoires)
- `email` (obligatoire)
- `telephone`
- `datenaissance`

#### Informations professionnelles

- `poste` — l'un des cinq rôles : `expert-comptable`, `assistant`, `fiscaliste`, `gestionnaire`, `comptable`.
- `niveauetude` — BAC, BAC+2, BAC+3, BAC+4, BAC+5, BAC+6 et plus.
- `dateentree` — date d'embauche.

#### Adresse

- `ville`, `quartier`.

#### Statut

- `statut` — `actif` ou `inactif`.
- `tachesencours` — compteur de missions en cours (synchronisé automatiquement, voir §4).

#### Permissions

- `permissions` — tableau d'objets `{ module, niveau }` couvrant 5 modules avec 3 niveaux (voir §3.6).

### 3.4. Interface utilisateur

#### En-tête (`CollaborateurHeader.tsx`)

- Bouton **« Retour »** vers le tableau de bord.
- Titre **« Collaborateurs »** + sous-titre « Gérez votre équipe, leurs postes et leurs accès au système ».
- Bouton **« Nouveau collaborateur »** ouvrant le formulaire de création.

#### Recherche et filtres (`CollaborateurSearch.tsx`)

- Champ **« Rechercher un collaborateur… »** filtrant en temps réel sur nom, prénom et email.
- Bouton **« Filtres »** ouvrant un popover avec deux critères :
  - **Statut** : Tous / Actif / Inactif.
  - **Poste** : Tous + liste dynamique des postes existants.
- Un badge numérique sur le bouton Filtres indique le nombre de filtres actifs.

#### Liste (`CollaborateurList.tsx`)

Deux affichages selon la résolution :

**Desktop** — tableau avec colonnes :

| Nom | Poste | Email | Date d'entrée | Statut | Tâches en cours | Actions |

L'avatar circulaire affiche les initiales (P + N) en couleur primaire.

**Mobile** — cartes empilées contenant les mêmes informations, optimisées pour le tactile.

### 3.5. Actions sur un collaborateur

Menu contextuel `MoreVertical` proposant :

1. **Voir le profil** → navigation vers `/collaborateurs/:id`.
2. **Modifier** → navigation vers `/collaborateurs/:id/edit`.
3. **Activer / Désactiver** (selon le statut actuel) — la « suppression » réelle est une désactivation logique (`statut: 'inactif'`).
4. **Supprimer** — protégé par AlertDialog avec rappel : « Cette action est irréversible. Cela supprimera définitivement le collaborateur \[Prénom Nom\] et toutes ses données associées. »

> ⚠️ Le `deleteCollaborateur()` du service exécute en réalité un **soft-delete** : il bascule le statut à `inactif` plutôt que de supprimer la ligne en base. Cela protège l'intégrité référentielle des missions et courriers historiques signés par ce collaborateur.

### 3.6. Formulaire de création (`CollaborateurForm.tsx`)

Quatre groupes de champs, dans cet ordre :

#### a) Informations personnelles (`PersonalInfoFields.tsx`)

Nom, Prénom, Email, Téléphone, Date de naissance.

#### b) Informations professionnelles (`ProfessionalInfoFields.tsx`)

Rôle (sélecteur), Niveau d'étude (sélecteur), Date d'entrée.

#### c) Adresse (`AddressFields.tsx`)

Ville, Quartier.

#### d) Permissions d'accès (`PermissionsFields.tsx`)

Pour chacun des **5 modules** — `clients`, `taches`, `facturation`, `rapports`, `planning` — l'administrateur choisit l'un des **3 niveaux** d'accès :

| Niveau | Description |
|---|---|
| `lecture` | Consultation seule |
| `ecriture` | Création et modification |
| `administration` | Tous droits, y compris suppression et configuration |

### 3.7. Rôles métier (`CollaborateurRole`)

| Rôle | Description typique |
|---|---|
| `expert-comptable` | Cadre senior, supervise les dossiers et signe les déclarations |
| `comptable` | Tient la comptabilité courante des clients |
| `fiscaliste` | Spécialiste fiscalité, traite les obligations DGI |
| `gestionnaire` | Coordonne les dossiers et les équipes |
| `assistant` | Appui administratif et opérationnel |

Le système utilise ces rôles pour :

- l'**autorisation d'accès** aux différents modules (`useAuthorization`),
- la **désignation automatique du superviseur** pour les ordres de mission (`getSuperviseur()` cherche dans l'ordre : expert-comptable, gestionnaire, comptable).

---

## 4. Interactions entre les trois modules

### 4.1. Schéma de flux

```
┌──────────────────┐    crée     ┌──────────────────┐
│  COLLABORATEURS  │◄───────────►│     MISSIONS     │
│   (référentiel)  │  assigne    │  (table tasks)   │
└──────────────────┘             └────────┬─────────┘
                                          │ alimente
                                          ▼
                                 ┌──────────────────┐
                                 │     PLANNING     │
                                 │   (vue calend.)  │
                                 └──────────────────┘
```

### 4.2. Synchronisation des compteurs

Chaque collaborateur dispose d'un champ `tachesencours` qui est mis à jour automatiquement par `taskService.ts` :

- **Création d'une mission `en_cours`** → `incrementCollaborateurTaskCount()`.
- **Passage `en_cours` → autre statut** → `decrementCollaborateurTaskCount()`.
- **Passage autre statut → `en_cours`** → incrément.
- **Suppression d'une mission `en_cours`** → décrément.
- À chaque chargement de la liste : `updateCollaborateurTaskCounts()` réconcilie le compteur en base.

Ce compteur est affiché :

- dans la liste des collaborateurs (colonne « Tâches en cours »),
- sur le tableau de bord (KPIs de charge),
- dans le profil détaillé d'un collaborateur.

### 4.3. Filtres en cascade

- Dans le **formulaire de mission**, seuls les collaborateurs `statut = actif` apparaissent.
- Dans le **filtre Planning**, on retrouve la liste de tous les collaborateurs actifs récupérés par `getCollaborateurs()`.
- La **désactivation** d'un collaborateur le retire immédiatement des assignations futures, sans toucher aux missions historiques.

### 4.4. Invalidation des caches React Query

Lorsqu'une action est effectuée dans un module, les caches des autres modules sont invalidés pour assurer la cohérence :

| Action | Caches invalidés |
|---|---|
| Créer une mission | `missions`, `tasks`, `collaborateurs` |
| Changer le statut d'une mission | `missions`, `tasks` |
| Supprimer une mission | `missions`, `tasks` |
| Soumettre un rapport de mission | `rapports-mission/:id`, `courriers` |
| Générer un ordre de mission | `mission-docs/:id`, `courriers` |
| Créer/modifier un collaborateur | `collaborateurs` |

---

## 5. Tableau récapitulatif des permissions

| Module | admin | expert-comptable | comptable | gestionnaire | fiscaliste | assistant |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Missions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Planning** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Collaborateurs** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> Note : ce tableau correspond à l'autorisation **d'accès au module** (vérification `useAuthorization` au niveau page). Les permissions fines configurées dans la fiche collaborateur (`lecture` / `ecriture` / `administration`) peuvent restreindre davantage les actions disponibles à l'intérieur de chaque module.

---

## Annexes techniques

### Fichiers clés

| Module | Fichiers principaux |
|---|---|
| **Missions** | `src/pages/Missions.tsx`, `src/components/missions/*`, `src/services/taskService.ts`, `src/services/missionDocumentService.ts`, `src/hooks/useMissionFilter.ts` |
| **Planning** | `src/pages/Planning.tsx`, `src/components/planning/*`, `src/hooks/usePlanning.tsx`, `src/utils/planningUtils.ts` |
| **Collaborateurs** | `src/pages/Collaborateurs.tsx`, `src/components/collaborateurs/*`, `src/services/collaborateurService.ts`, `src/hooks/useCollaborateurs.ts`, `src/types/collaborateur.ts` |

### Tables Supabase impliquées

- `tasks` — missions (avec FK vers `clients` et `collaborateurs`).
- `collaborateurs` — référentiel RH.
- `mission_documents` — documents générés (ordres de mission, rapports).
- `courriers` — courriers automatiquement générés depuis les missions.

### Conventions de l'application

- **Format des dates affichées** : `JJ/MM/AAAA` (locale `fr-FR`).
- **Couleur primaire** : `#1e3a8a` (bleu nuit).
- **Toasts** : sonner (success vert, error rouge, durée 3 s).
- **Confirmations destructives** : shadcn `AlertDialog`.
- **Layout** : tous les écrans utilisent `<PageLayout>` (`src/components/layout/PageLayout.tsx`).
