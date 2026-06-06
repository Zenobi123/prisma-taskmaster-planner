# PRISMA GESTION — Description détaillée des fonctionnalités

Cette documentation décrit l'**ensemble des fonctionnalités** de l'application PRISMA GESTION, une plateforme SaaS de gestion fiscale et comptable conçue pour un cabinet d'expertise comptable camerounais. L'application orchestre la gestion du portefeuille clients, le calcul des obligations fiscales (IGS, Patente, TDL, PSL, Bail, etc.), la facturation, la planification des missions, la gestion des ressources humaines et la production de courriers et rapports officiels.

---

## Table des matières

1. [Tableau de bord (Dashboard)](#1-tableau-de-bord-dashboard)
2. [Clients](#2-clients)
3. [Facturation](#3-facturation)
4. [Gestion](#4-gestion)
5. [Courrier](#5-courrier)
6. [Missions](#6-missions)
7. [Planning](#7-planning)
8. [Collaborateurs](#8-collaborateurs)
9. [Rapports](#9-rapports)
10. [Paramètres](#10-paramètres)
11. [Architecture transverse](#11-architecture-transverse)
12. [Tableau récapitulatif des permissions](#12-tableau-récapitulatif-des-permissions)

---

## 1. Tableau de bord (Dashboard)

**Route** : `/` → `src/pages/Index.tsx`

### 1.1. Objectif fonctionnel

Le tableau de bord constitue la **page maître** du cabinet. Il rassemble en un seul écran les **indicateurs clés**, les **alertes fiscales urgentes** et les **tâches en cours**. C'est le poste de pilotage quotidien des utilisateurs.

### 1.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 1.3. Composants et sections

#### a) Barre latérale (`Sidebar`)
Navigation vers tous les modules de l'application (Clients, Facturation, Gestion, Courrier, Missions, Planning, Collaborateurs, Rapports, Paramètres).

#### b) En-tête (`DashboardHeader`)
- Indicateur de **dernière actualisation**.
- Bouton de **rafraîchissement manuel** (invalide les caches React Query).

#### c) Statistiques rapides (`QuickStats`)
Trois sections cliquables :
- **`FiscalStatsSection`** — IGS impayés, DARP non déposées, clients non conformes.
- **`ClientStatsSection`** — Taille du portefeuille, patentes impayées.
- **`ActivityStatsSection`** — Tâches actives et en retard.

#### d) Accordéon d'alertes (`DashboardAccordion`)
Sections rétractables présentant les obligations fiscales en retard :
- **IGS** (`IgsSection`) — clients non-conformes par classe d'imposition.
- **Attestations de Conformité Fiscale** (`ExpiringFiscalAttestations`) — dates d'expiration.
- **Patentes** (`PatenteSection`) — clients impayés.
- **Impôts immobiliers** (`ImpotsImmobiliersSection`) — Bail, PSL, Taxe Foncière.
- **DSF** (`DsfSection`) — Déclarations Statistiques et Fiscales en retard.
- **DBEF** (`DbefSection`) — Déclarations des Bénéficiaires Effectifs.

#### e) Boîtes de dialogue contextuelles
- `UnpaidPatenteDialog` — détail des patentes impayées.
- `UnpaidIgsDialog` — détail des IGS impayés.
- `UnfiledDarpDialog` — DARP non déposées.
- `UnfiledDsfDialog` — DSF non déposées.
- `NonCompliantDialog` — clients non conformes.

### 1.4. Mécanismes techniques

- **Rafraîchissement automatique** toutes les 2 minutes via `setInterval` + `queryClient.invalidateQueries`.
- Pas de refresh sur focus de fenêtre (configuration React Query : `refetchOnWindowFocus: false`).
- Invalidation manuelle exposée via `window.__invalidateFiscalCaches`.

---

## 2. Clients

**Route** : `/clients` → `src/pages/Clients.tsx`

### 2.1. Objectif fonctionnel

Le module Clients est le **référentiel central** du portefeuille du cabinet. Il gère le cycle de vie complet d'un client : création, classification (personne physique / morale), suivi fiscal, archivage et corbeille.

### 2.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 2.3. Interface utilisateur

#### a) En-tête
Fil d'Ariane, boutons d'action : **Ajouter un client**, **Voir la corbeille**, **Importer CSV**, **Exporter**.

#### b) Filtres
- Recherche textuelle sur le nom / raison sociale.
- Filtre par **type** : Personne physique / Personne morale.
- Filtre par **secteur d'activité**.
- Filtre par **régime fiscal** : IGS / Réel.
- Filtre par **statut CDI** (Centre Des Impôts).
- Filtre **archivé / actif**.

#### c) Liste et actions par ligne
- **Voir** — affiche une fiche détaillée.
- **Modifier** — formulaire d'édition complet.
- **Archiver** — soft-delete (`statut: archivé`).
- **Supprimer** — déplace vers la corbeille.

#### d) Corbeille
Vue dédiée aux clients supprimés permettant la **restauration** ou la **suppression définitive**.

### 2.4. Formulaire client

Champs regroupés en sections :
- **Identité** : nom, raison sociale, civilité, type.
- **Adresse** : ville, quartier, BP.
- **Contact** : téléphone, email.
- **Professionnel** : secteur, NIU, RCCM, CDI, régime fiscal.
- **Fiscal** : CA, gestion externalisée (`gestionexternalisee`), CGA, fiscalement assujetti.

### 2.5. Règles métier

- Un client coché **`gestionexternalisee = true`** apparaît automatiquement dans le module **Gestion**.
- Le **type de client** et le **CA** déterminent les obligations fiscales par défaut (IGS, Patente, etc.).
- Archivage = soft-delete réversible ; corbeille = pré-suppression définitive.
- Données persistées dans la table Supabase `clients`.

---

## 3. Facturation

**Route** : `/facturation` → `src/pages/Facturation.tsx`

### 3.1. Objectif fonctionnel

Le module Facturation gère **tous les documents transactionnels** émis par le cabinet : devis, factures, propositions de paiement, paiements et situation financière des clients.

### 3.2. Rôle autorisé

**`admin` uniquement** (module le plus restrictif).

### 3.3. Onglets

L'interface présente **5 onglets horizontaux** avec en-tête collant et sélecteur d'exercice comptable.

#### a) Devis
- Création, édition, suppression de devis.
- Recherche par statut, client.
- **Conversion devis → facture** en un clic.
- Numérotation : `DEVIS-NNNN/YYYY/MM`.

#### b) Factures
- CRUD complet, liste paginée.
- Filtres : statut, statut de paiement, plage de dates.
- Téléchargement PDF (`html2canvas` + jsPDF, scale 2, A4).
- Envoi par email au client.
- Numérotation : `N° NNNN/YYYY/MM`.

#### c) Propositions
- Propositions de paiement (variantes ou alternatives aux factures).
- Numérotation : `PROP-NNNN/YYYY`.

#### d) Paiements
- Enregistrement manuel des paiements clients.
- Recherche, suppression, application d'avoirs.
- Reçus : `RECU-NNNN/YYYY`.

#### e) Situation clients
- Tableau de bord financier consolidé.
- **Vieillissement des créances** (AR aging).
- Statut de paiement par client + graphique.
- Génération de **lettres de relance**.
- Rapport d'échéances fiscales.

### 3.4. Règles métier critiques

- **Snapshot client** : chaque document stocke `client_data` au moment de l'émission, et ne **jamais** relire le client vivant pour l'affichage du document.
- **Exercice verrouillé** : un bandeau « lecture seule » s'affiche si l'exercice est clôturé.
- **Workflow paiement** : devis → facture → reçu ; les propositions sont des variantes.
- Format monétaire : `Math.round(amount).toLocaleString('fr-FR') + ' F CFA'`.

---

## 4. Gestion

**Route** : `/gestion` → `src/pages/Gestion.tsx`

### 4.1. Objectif fonctionnel

Le module Gestion centralise la **situation fiscale d'un client** dont la gestion est externalisée au cabinet. Il calcule, suit et historise toutes les obligations (IGS, Patente, TDL, PSL, Bail, Licence, DSF, etc.).

### 4.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 4.3. Architecture client-centrée

- **Sélecteur de client** en haut (uniquement ceux avec `gestionexternalisee = true`).
- Carte du client sélectionné : NIU, contact, statut.
- Mémorisation du dernier client + onglet sélectionné dans `localStorage`.

### 4.4. Onglets

#### a) Fiscal
- Année fiscale, dates de validité, statuts d'attestation et d'inscription.
- Calcul automatique des **impôts directs** :
  - **IGS** — 10 classes pour CA < 50 M F CFA ; réduction CGA 50%.
  - **Patente** — 0.283% du CA, plancher 141 500, plafond 4 500 000.
  - **TDL** — table par tranches sur l'IGS principal (pré-réduction).
  - **Solde IR/IS** — 0.1% du CA si CA ≥ 15 M ; libellé « Solde IS » pour personnes morales.
  - **PSL** — exonération OBNL/NonPro.
  - **Bail** — 10% (5% pour OBNL/NonPro).
  - **Licence boissons** — 2× IGS ou 2× Patente selon régime.
- **Acomptes trimestriels IGS** : T1 = 15 Jan, T2 = 15 Mar, T3 = 15 Jul, T4 = 15 Oct.
- **Pénalités** : 10% par mois de retard.
- Toggles de statut (déclaré, payé, reporté), pièces jointes justificatives.

#### b) Comptable
Données comptables du client (saisies / importées).

#### c) Contrats / Prestations
Contrats de service signés avec le client, périmètre des missions.

#### d) Clôture d'exercice
Workflow de fin d'exercice en plusieurs étapes (sous-onglets).

#### e) Dossier
Gestion documentaire (pièces jointes, correspondances, contrats).

### 4.5. Mécanismes techniques

- **Auto-save** avec debounce de **3 secondes** via `useUnifiedFiscalSave()`.
- Alerte « modifications non sauvegardées » à la sortie de page.
- Persistance dans `fiscal_obligations` côté Supabase.

---

## 5. Courrier

**Route** : `/courrier` → `src/pages/Courrier.tsx`

### 5.1. Objectif fonctionnel

Le module Courrier permet la **rédaction, prévisualisation et envoi en masse ou unitaire** de lettres officielles depuis ~20 modèles pré-configurés.

### 5.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 5.3. Onglets

#### a) Rédaction
Layout 4 colonnes (desktop) :
1. **Critères de sélection** : type de client, régime fiscal, secteur, centre de rattachement.
2. **Toggle** : mode individuel vs mode masse.
3. **Sélection** : cases à cocher (individuel) ou auto-sélection (masse).
4. **Modèle + actions** : choix du modèle, message personnalisé, mode d'envoi.

Modes d'envoi : **remise en main propre**, **courrier postal**, **email**, **fax**.

Actions : **Prévisualiser** (modal) et **Générer & Enregistrer**.

#### b) Historique (`CourrierHistorique`)
Trace de tous les courriers générés avec dates, statuts et destinataires.

### 5.4. Modèles de courrier

Définis dans `src/lib/spec/courrierTemplates.ts` (~20 modèles répartis en **3 catégories**) :

| Catégorie | Exemples |
|---|---|
| **Fiscal / DGI** | ACF, ATTIM, réclamation, dégrèvement, moratoire, sursis. Destinataire : Chef de Centre Régional des Impôts. |
| **Client** | Lettre de mission, relance paiement, mise en demeure, transmission de documents, proposition d'avance, transmission de devis. |
| **Administratif** | Rappel de délais, annonce de nouvelles taxes, demande de NIU, changement de régime, cessation d'activité, modèle libre. |

### 5.5. Placeholders dynamiques

Substitués au rendu : `{CLIENT_NOM}`, `{CLIENT_NIU}`, `{CLIENT_VILLE}`, `{CLIENT_QUARTIER}`, `{CLIENT_CONTACT}`, `{CIVILITE}` (= `Madame` ou `Monsieur`, jamais abrégé).

Pour les modèles dynamiques, `getDynamicModelePayload()` injecte les figures fiscales calculées en direct.

### 5.6. Stockage

- Table Supabase `courrierrecords`.
- Numérotation : `CRR-NNNN/YYYY/MM`.

---

## 6. Missions

**Route** : `/missions` → `src/pages/Missions.tsx`

### 6.1. Objectif fonctionnel

Le module Missions gère la **création, l'attribution, le suivi et la clôture** des missions confiées aux collaborateurs pour le compte des clients.

### 6.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 6.3. Interface

- **En-tête** : bouton « Nouvelle mission », sélecteur d'exercice comptable.
- **Filtres** : recherche (titre + client + collaborateur), filtre par statut.
- **Liste paginée** : 10 missions/page, triées par priorité (`en_cours` → `en_attente` → `en_retard` → `termine`).
- **Carte de mission** : titre, client, collaborateur assigné, plage de dates, badge de statut, actions.

### 6.4. Cycle de vie des statuts

| Statut | Description | Déclencheur |
|---|---|---|
| `en_attente` | Mission planifiée | Date de début dans le futur |
| `en_cours` | Mission active | Date de début ≤ aujourd'hui |
| `en_retard` | Date de fin dépassée | end_date < aujourd'hui ET ≠ termine |
| `termine` | Mission clôturée | Action manuelle |

Transitions automatiques calculées à chaque `getTasks()` via `updateTaskStatusesBasedOnDates()`.

### 6.5. Création de mission

Formulaire modal :
- **Titre** (obligatoire)
- **Client** (optionnel)
- **Collaborateur assigné** (obligatoire, statut `actif` uniquement)
- **Date de début / date de fin** (obligatoires, fin ≥ début)

À la création : invalidation des caches `missions`, `tasks`, `collaborateurs`.

### 6.6. Actions sur une mission

#### a) Ordre de mission (`OrdreMissionDialog`)
Génère **3 exemplaires** : Missionnaire (instructions), Superviseur (points de contrôle), Contribuable (lettre officielle). Les documents apparaissent dans **Courrier → Historique**.

#### b) Rapport de mission (`RapportMissionUpload`)
Accepte **JSON**, **Markdown** ou **TXT**. Sections : objet, période, travaux réalisés, constatations, anomalies, recommandations, conclusion.
- Version **superviseur** = inclut les anomalies.
- Version **client** = expurgée.
Drag-and-drop, aperçu avant soumission.

#### c) Changement de statut
Menu déroulant : En attente / En cours / Terminée.

#### d) Suppression
Protégée par `AlertDialog` ; supprime également les documents associés.

### 6.7. Intégration exercice comptable

Bandeau « lecture seule » pour les exercices clos ; masquage des missions `termine` créées il y a plus de 30 jours en mode courant.

---

## 7. Planning

**Route** : `/planning` → `src/pages/Planning.tsx`

### 7.1. Objectif fonctionnel

Le Planning offre une **vue calendaire** des missions et événements du cabinet. Il permet la visualisation de la charge de travail par jour et par collaborateur.

### 7.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 7.3. Source des données

Vue dérivée des missions (`tasks`). `usePlanning` transforme les tâches en événements via `transformTasksToEvents()` :
- **Mission** par défaut.
- **Réunion** détectée si le titre contient « réunion ».

### 7.4. Interface

#### a) Colonne gauche — Calendrier (`CalendarView`)
- Calendrier mensuel, sélection simple.
- **Pastille bleue** sous les jours contenant des événements.
- Date sélectionnée affichée en français (« lundi 6 juin 2026 »).

#### b) Colonne droite — Liste des événements (`EventsList`)
- Titre dynamique : « Événements du \[date\] ».
- Bouton d'export.
- Carte par événement : titre, client, collaborateur, plage horaire, badge.
- État vide explicite avec icône.

#### c) Filtre collaborateur (`CollaboratorFilter`)
Menu déroulant : « Tous » ou collaborateur précis.

### 7.5. Export (`ExportOptions`)

- **CSV** : `planning-YYYY-MM-DD.csv`.
- **PDF** : exporté via `exportToPdf()`.

Respecte le filtre actif.

### 7.6. Limites actuelles

- Pas de création directe d'événements (passer par Missions).
- Réunions = convention de nommage, pas d'entité distincte.
- Horaires `start_time` / `end_time` à `00:00` par défaut.

---

## 8. Collaborateurs

**Route** : `/collaborateurs` → `src/pages/Collaborateurs.tsx`

### 8.1. Objectif fonctionnel

Gestion des **ressources humaines** : ajout, modification, désactivation, suppression des comptes, attribution des rôles métier et permissions d'accès.

### 8.2. Rôle autorisé

**`admin` uniquement**.

### 8.3. Structure d'un collaborateur

Type `Collaborateur` (`src/types/collaborateur.ts`) :
- **Identité** : `nom`, `prenom`, `email`, `telephone`, `datenaissance`.
- **Pro** : `poste` (`expert-comptable` / `assistant` / `fiscaliste` / `gestionnaire` / `comptable`), `niveauetude` (BAC à BAC+6+), `dateentree`.
- **Adresse** : `ville`, `quartier`.
- **Statut** : `actif` / `inactif`.
- **`tachesencours`** : compteur auto-synchronisé.
- **`permissions`** : tableau `{module, niveau}`.

### 8.4. Interface

- **En-tête** : bouton « Nouveau collaborateur ».
- **Recherche** sur nom / prénom / email.
- **Filtres** : statut, poste.
- **Liste** : tableau (desktop) avec avatar initiales, ou cartes (mobile).
- **Menu d'actions** par ligne : Voir / Modifier / Activer-Désactiver / Supprimer.

⚠️ La « suppression » est en réalité un **soft-delete** (`statut: inactif`) pour préserver l'intégrité des missions et courriers historiques.

### 8.5. Permissions fines

Pour chacun des 5 modules — `clients`, `taches`, `facturation`, `rapports`, `planning` — l'administrateur choisit :

| Niveau | Description |
|---|---|
| `lecture` | Consultation seule |
| `ecriture` | Création et modification |
| `administration` | Tous droits |

### 8.6. Rôles métier

| Rôle | Description |
|---|---|
| `expert-comptable` | Cadre senior, supervise et signe |
| `comptable` | Tient la compta courante |
| `fiscaliste` | Spécialiste fiscalité, DGI |
| `gestionnaire` | Coordonne dossiers et équipes |
| `assistant` | Appui administratif |

Utilisés pour l'autorisation (`useAuthorization`) et la désignation automatique du superviseur d'ordre de mission (`getSuperviseur()` : expert-comptable > gestionnaire > comptable).

### 8.7. Synchronisation `tachesencours`

Maintenu en temps réel par `taskService.ts` :
- Création/passage en `en_cours` → `incrementCollaborateurTaskCount()`.
- Sortie de `en_cours` ou suppression → `decrementCollaborateurTaskCount()`.
- Réconciliation à chaque `getTasks()` via `updateCollaborateurTaskCounts()`.

---

## 9. Rapports

**Route** : `/rapports` → `src/pages/Rapports.tsx`

### 9.1. Objectif fonctionnel

Galerie de **24 rapports pré-construits** prêts à être générés en PDF.

### 9.2. Rôles autorisés

`admin`, `comptable`, `gestionnaire`, `expert-comptable`, `fiscaliste`, `assistant`.

### 9.3. Interface

- Recherche textuelle.
- Filtre par type.
- Cartes : titre, date, taille estimée, description, icône, bouton « Générer ».

### 9.4. Catégories de rapports

| Catégorie | Nombre | Exemples |
|---|---|---|
| **Financiers** | 7 | Chiffre d'affaires, facturation, créances, devis, propositions, reçus |
| **Clients** | 9 | Portefeuille, nouveaux clients, activité, segmentation (PM/PP, par centre, IGS, Patente, régime réel) |
| **Fiscaux** | 2 | Obligations fiscales, retards fiscaux |
| **RH** | 2 | Masse salariale, effectifs |
| **Opérationnels** | 2 | Suivi tâches, performance collaborateurs |
| **Legacy** | 2 | Activité mensuelle, bilan trimestriel |

### 9.5. Générateurs

Fichiers `src/utils/reports/{financial|client|fiscal|rh|operational|billingDossier|specificClient}Reports.ts`. Chaque générateur produit un PDF via `html2canvas` + `jsPDF`.

---

## 10. Paramètres

**Route** : `/parametres` → `src/pages/Parametres.tsx`

### 10.1. Objectif fonctionnel

Configuration du cabinet et du profil utilisateur, organisée en **6 onglets** (+1 onglet conditionnel pour admin).

### 10.2. Rôle autorisé

`admin`.

### 10.3. Onglets

#### a) Profil (`ProfileSettings`)
Prénom, nom, email, photo d'avatar.

#### b) Cabinet — impressions (`CabinetConfigSettings`)
- Nom du cabinet, slogan, siège social, téléphone, email.
- Coordonnées bancaires.
- **Signature** (PNG, dataURL) avec téléchargement et prévisualisation.
- **Cachet** (PNG).
- **Signataire principal** (nom + qualité).

#### c) Clôture annuelle (`ClotureAnnuelleSettings`)
Paramètres de fin d'exercice : dates limites, alertes.

#### d) Application (`AppSettings`)
Langue, thème, notifications push, format d'export par défaut (PDF/Excel).

#### e) Sécurité (`SecuritySettings`)
Changement de mot de passe, 2FA (TOTP), sessions actives.

#### f) Notifications (`NotificationSettings`)
Préférences email (alertes fiscales, tâches, rapports), canaux (email, SMS, push).

#### g) Utilisateurs (admin uniquement — `UserManagement`)
CRUD complet des collaborateurs, attribution des rôles et permissions par module.

### 10.4. Stockage

- **Profil & Cabinet** : `localStorage` (sérialisé en JSON via `useCabinetConfig()`).
- **Signatures / cachets** : dataURL PNG.
- **Utilisateurs** : table Supabase `auth.users` + `profiles` + table de rôles personnalisée.

---

## 11. Architecture transverse

### 11.1. Stack technique

- **Frontend** : Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui.
- **Backend** : Supabase (Postgres + Auth + Storage).
- **État serveur** : React Query (`staleTime: 5 min`, `gcTime: 30 min`, `retry: 1`, `refetchOnWindowFocus: false`).
- **Routage** : React Router avec `PrivateRoute` wrapper (redirection vers `/login`).
- **Tests** : vitest + jsdom.

### 11.2. Authentification et autorisation

- Authentification Supabase Auth.
- `useAuthorization(rolesAllowed, module, options)` vérifie le rôle de l'utilisateur courant.
- Composant `CollaborateurUnauthorized` affiché en cas de refus.

### 11.3. Logique métier fiscale centralisée

`src/lib/spec/fiscal.ts` est la **source unique de vérité** pour les calculs fiscaux :
- IGS, Patente, TDL, Solde IR/IS, PSL, Bail, Licence boissons.
- Pénalités quarterly IGS.
- Civilité longue (`Madame` / `Monsieur`).

Les constantes (barèmes IGS, taux Patente, tranches TDL) vivent dans `src/lib/spec/fiscal-constants.ts`.

### 11.4. Documents

- Tous les documents transactionnels stockent un **snapshot `client_data`** au moment de l'émission. Ne **jamais** relire le client vivant pour le rendu.
- Numérotation :
  - Facture : `N° NNNN/YYYY/MM`
  - Devis : `DEVIS-NNNN/YYYY/MM`
  - Reçu : `RECU-NNNN/YYYY`
  - Courrier : `CRR-NNNN/YYYY/MM`
- Dates en mode manuel : `new Date(val + 'T12:00:00').toISOString()` (évite le shift UTC).
- PDF : `html2canvas(el, { scale: 2, useCORS: true })` → A4 split → `jsPDF`.
- Impression : hook `usePrint(ref)` ou `react-to-print`.

### 11.5. Conventions UI

- **Couleur primaire** : `#1e3a8a` (`--primary`).
- **Format monétaire** : `Math.round(amount).toLocaleString('fr-FR') + ' F CFA'`.
- **Toasts** : `useToast()` ou `sonner` (success vert, warning ambre, error rouge, info bleu ; durée 3 s).
- **Confirmations destructives** : shadcn `AlertDialog`.
- **Layout** : tous les écrans wrappés dans `<PageLayout>` (`src/components/layout/PageLayout.tsx`).
- **Détection mobile** : `useIsMobile()`.

### 11.6. Exercice comptable

Contexte global (`ExerciceContext`) permettant :
- Sélection de l'année d'exercice consultée.
- Mode **lecture seule** pour les exercices clos (bandeau d'information).
- Filtrage automatique des entités créées dans des exercices clos.

---

## 12. Tableau récapitulatif des permissions

| Module | admin | expert-comptable | comptable | gestionnaire | fiscaliste | assistant |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Clients** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Facturation** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Gestion** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Courrier** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Missions** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Planning** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Collaborateurs** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Rapports** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Paramètres** | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> Ce tableau correspond à l'autorisation **d'accès au module** (vérification `useAuthorization` au niveau page). Les permissions fines configurées dans la fiche collaborateur (`lecture` / `ecriture` / `administration`) peuvent restreindre davantage les actions disponibles à l'intérieur de chaque module.

---

## Annexes

### A. Tables Supabase principales

| Table | Domaine |
|---|---|
| `clients` | Portefeuille clients |
| `tasks` | Missions (référence `client_id`, `collaborateur_id`) |
| `collaborateurs` | Référentiel RH |
| `factures` | Factures émises |
| `devis` | Devis |
| `propositions` | Propositions de paiement |
| `paiements` | Paiements clients |
| `recus` | Reçus de paiement |
| `courrierrecords` | Courriers générés |
| `fiscal_obligations` | Obligations fiscales par client |
| `mission_documents` | Ordres et rapports de mission |
| `users` / `profiles` | Comptes d'authentification |

### B. Fichiers clés par module

| Module | Fichiers principaux |
|---|---|
| **Dashboard** | `src/pages/Index.tsx`, `src/components/dashboard/*` |
| **Clients** | `src/pages/Clients.tsx`, `src/components/clients/*`, `src/services/clientService.ts` |
| **Facturation** | `src/pages/Facturation.tsx`, `src/components/facturation/*`, `src/services/{facture,devis,proposition,paie}Service.ts` |
| **Gestion** | `src/pages/Gestion.tsx`, `src/hooks/fiscal/*`, `src/services/fiscalObligationsService.ts` |
| **Courrier** | `src/pages/Courrier.tsx`, `src/components/courrier/*`, `src/lib/spec/courrierTemplates.ts`, `src/services/courrierService.ts` |
| **Missions** | `src/pages/Missions.tsx`, `src/components/missions/*`, `src/services/taskService.ts`, `src/services/missionDocumentService.ts` |
| **Planning** | `src/pages/Planning.tsx`, `src/components/planning/*`, `src/hooks/usePlanning.tsx`, `src/utils/planningUtils.ts` |
| **Collaborateurs** | `src/pages/Collaborateurs.tsx`, `src/components/collaborateurs/*`, `src/services/collaborateurService.ts`, `src/types/collaborateur.ts` |
| **Rapports** | `src/pages/Rapports.tsx`, `src/utils/reports/*` |
| **Paramètres** | `src/pages/Parametres.tsx`, `src/components/parametres/*`, `src/lib/spec/cabinetConfig.ts` |
| **Logique fiscale** | `src/lib/spec/fiscal.ts`, `src/lib/spec/fiscal-constants.ts` |

### C. Commandes utiles

```bash
npm run dev          # Serveur de dev sur port 8080
npm run build        # Build de production
npm run lint         # ESLint
npx vitest           # Lance tous les tests
```
