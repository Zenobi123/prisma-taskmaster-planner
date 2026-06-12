# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Vue d'ensemble

PRISMA GESTION est une application web de gestion commerciale pour un cabinet de comptabilité/fiscalité au Cameroun (Yaoundé). Version 2.0. L'application est entièrement frontend (HTML/JavaScript) sans serveur backend, utilisant localStorage pour la persistance des données.

### Documentation interne du dépôt
- **`CLAUDE.md`** : jumeau de ce fichier destiné à Claude Code. Garder les deux **synchronisés** lors d'une mise à jour de la documentation projet.
- **`STANDARD_PRESENTATION_COURRIERS.md`** : standard visuel du rendu courrier (`displayCourrier()`), avec règle de maintenance (mettre à jour le HTML, les `@page` × 2, et ce document).
- **`SPEC_LOVABLE.md`** : spécification produit.
- `clients_2026-01-28.csv` / `.json` : données clients de référence (exemples d'export/import).

## Architecture

### Stack technique
- **HTML5** avec JavaScript vanilla (aucun build, aucun framework)
- **TailwindCSS** : bundle **local** `assets/css/tailwindcss.min.js` (plus de CDN → l'UI fonctionne hors-ligne)
- **Police Inter** : **locale** via `assets/css/inter-font.css` + `assets/fonts/inter-latin.woff2` (plus Google Fonts)
- **jsPDF** et **html2canvas** : toujours **via CDN** (cdnjs) → l'export PDF nécessite Internet
- **SheetJS / xlsx** : via CDN, uniquement dans `clients.html` (import/export Excel des clients)
- **localStorage** pour la persistance des données
- **`prisma-components.js`** : bibliothèque partagée (UI + protection des données), incluse dans tous les modules — voir section dédiée
- **`prisma-print.css`** : feuille d'impression A4 partagée (règles `@page`, palette de couleurs print) liée par `<link>` dans les modules

### Structure des modules

| Fichier | Module | Description |
|---------|--------|-------------|
| `index.html` | Page d'accueil | Menu principal (12 modules) + statistiques globales |
| `clients.html` | Gestion Clients | CRUD clients (PM/PP, NIU, CFLP), régime fiscal et immobilier, import/export Excel. **Corbeille** : la suppression est un *soft delete* (déplacement vers `clientsCorbeille`) ; un client est restaurable **avec son historique** (jamais effacé, rattaché par nom) ou supprimable définitivement. |
| `devis.html` | Devis / Proforma | Devis convertibles en factures |
| `facture-app.html` | Factures | Création de factures avec classification Impôt/Honoraire |
| `avance-app.html` | Propositions | Propositions de paiement (Impôts + Honoraires) |
| `recu-app.html` | Reçus | Reçus de paiement avec conversion montant en lettres |
| `gestion-app.html` | **Gestion** (remplace Situation Client) | Suivi centralisé des clients en **gestion externalisée** (`externalise === 'Oui'`) : sélecteur exercice + client (mémorisés en localStorage + URL params), 5 onglets (Fiscal / Comptable / Contrats / Clôture / Dossier). L'onglet **Fiscal** est le cœur : ACF (90j), ATTIM (30j), IGS détaillé (barème + CGA + échéancier trimestriel), autres impôts directs (Patente, Bail, PSL, TPF), obligations annuelles (DSF / DARP / DBEF) avec pièces jointes et actions groupées. **Auto-save 3s + bouton Enregistrer.** Bannière lecture seule si exercice clôturé. **Stockage des documents** : les pièces jointes (obligations + onglet Dossier) sont écrites sur disque via `PrismaDocStore` (`documents/<client>/<exercice>/Obligations` ou `…/Dossier permanent`, noms horodatés, max 50 Mo) quand le dossier de documents est connecté (bannière dédiée) ; repli base64/localStorage (5 Mo) sinon ; migration en un clic des pièces historiques (snapshot préalable). Métadonnées (`storage:'fs'`, `fsPath`, `fsName`) stockées dans `gestionFiscalData`/`gestionPieces` — l'export JSON ne contient que les références, le dossier `documents/` doit être sauvegardé avec l'application. |
| `situation-app.html` | Situation client *(legacy, conservé pour rétrocompat)* | Ancienne vue consolidée par client. Plus dans le menu principal mais accessible par URL. |
| `courrier-app.html` | Gestion Courrier | Courriers fiscaux, clients, relances avec modèles prédéfinis |
| `parametres-cabinet.html` | Paramètres Cabinet | Signataire, signature et cachet (images) stockés dans `cabinetConfig` |
| `missions.html` | **Missions** | Création, attribution et suivi des missions confiées aux collaborateurs pour le compte des clients. Statuts auto-calculés selon les dates : `en_attente` / `en_cours` / `en_retard` / `termine`. Tri par priorité de statut. Pagination 10/page. Filtres (titre/client/collaborateur, statut, collaborateur, exercice). 4 actions par carte : génération des **3 ordres de mission** (missionnaire/superviseur/contribuable) avec injection automatique dans le module Courrier ; soumission **rapport de mission** (JSON/MD/TXT) qui produit 2 courriers (superviseur + version client expurgée) ; changement de statut ; suppression. Masquage auto des missions `termine` > 30 jours en exercice courant. |
| `planning.html` | **Planning** | Vue calendaire mensuelle des missions. Calendrier custom en HTML pur (offset lundi, navigation mois ±). Pastilles bleues sur les jours avec événements. Sélection d'une date → liste détaillée des événements à droite. Détection auto **Mission / Réunion** (titre contenant "réunion"). Filtre par collaborateur. Synthèse mensuelle (total/en cours/en attente/en retard) sous la liste. Export **CSV** + **PDF** (via impression directe). |
| `collaborateurs.html` | **Collaborateurs** | Référentiel RH du cabinet. Champs : identité (nom, prénom, email, tél, naissance), pro (5 postes : expert-comptable / comptable / fiscaliste / gestionnaire / assistant ; niveau d'étude ; date d'entrée), adresse, permissions (5 modules × 3 niveaux : lecture/écriture/administration). KPIs en haut (total, actifs, inactifs, tâches en cours). Recherche + filtres (statut, poste). Vue desktop (tableau) + mobile (cartes). 4 actions : voir profil (modal), modifier, activer/désactiver (soft-delete avec avertissement si missions actives), supprimer définitivement. **Compteur `tachesencours` calculé à la volée** depuis `missions.filter(m => m.collaborateurId === id && m.statut === 'en_cours').length` — pas de stockage dénormalisé. |
| `aide.html` | **Aide** | Documentation utilisateur intégrée : changelog versionné en tête, sommaire sticky avec scroll-spy, recherche client-side, sections (Démarrage, Modules, Concepts métier, Sauvegardes, Impression, Astuces, FAQ). **À mettre à jour à chaque changement majeur** (constantes `APP_VERSION` + `LAST_UPDATE` en bas du fichier, plus nouvelle entrée dans le bloc Changelog). Pas de stockage localStorage : contenu 100% statique en HTML. |

> `devis.html` est désormais **un module actif** (et non plus « en développement »). Les fichiers `prisma-components.js` et `prisma-print.css` sont des dépendances **partagées**, pas des modules.

### Flux de données (localStorage)

```
clients → devis → factures → recus
              ↘ propositions
```

**Clés localStorage utilisées :**
- `clients` : tableau des clients
- `clientsCorbeille` : (module Clients) clients supprimés en *soft delete* — chaque entrée conserve la fiche client complète + `deletedAt`. Restaurables avec leur historique (factures, devis, reçus, propositions, courriers ne sont jamais effacés ; le rattachement se fait par **nom** de client). Déclarée dans `PrismaBackup.ALL_DATA_KEYS`.
- `devis` : tableau des devis / proformas
- `factures` : tableau des factures
- `recus` : tableau des reçus de paiement
- `propositions` : tableau des propositions de paiement
- `courriers` : tableau des courriers (fiscaux, clients, administratifs)
- `cabinetConfig` : objet `{ signataireNom, signataireTitre, signature (base64), cachet (base64), ... }` partagé par tous les documents
- `attestations` : objet indexé par nom client avec dates ACF et ATTIM
- `prestationRealizationStatus` : objet indexé par uniqueId de prestation (statut: À faire, En cours, Effectué)
- `dossierFiscalStatus` : objet indexé par nom client avec statut des documents fiscaux par année
- `paiementsImpotsDirects` : objet indexé par nom client avec mode de paiement des impôts (non_paye, cabinet, client_direct)
- `gestionFiscalData` : (module Gestion) données fiscales détaillées indexées par `clientId → exercice` (ACF, ATTIM, IGS+trimestres, impôts directs, obligations annuelles avec pièces)
- `gestionExercices` : (module Gestion) statut de clôture par exercice (`{ "2026": { cloture: false }, ... }`)
- `gestionContext` : (module Gestion) dernière sélection de l'utilisateur (`{ clientId, exercice, tab }`) restaurée à l'ouverture
- `gestionPieces` : (module Gestion) pièces jointes du dossier permanent indexées par `clientId → exercice`
- `collaborateurs` : (module Collaborateurs) tableau de collaborateurs `{ id, nom, prenom, email, telephone, dateNaissance, poste, niveauEtude, dateEntree, ville, quartier, statut: 'actif'|'inactif', permissions: { clients/taches/facturation/rapports/planning: 'lecture'|'ecriture'|'administration' } }`
- `missions` : (module Missions) tableau de missions `{ id, titre, clientId, clientName, collaborateurId, collaborateurNom (dénormalisés), dateDebut, dateFin, heureDebut, heureFin, statut: 'en_attente'|'en_cours'|'en_retard'|'termine', exercice, description, rapportSoumis, ordresGeneres: [...] }`
- `missionDocuments` : (module Missions) ordres de mission + rapports générés `{ id, missionId, type: 'ordre-missionnaire'|'ordre-superviseur'|'ordre-contribuable'|'rapport', reference, dateGeneration, contenu, format }`
- Clés de sauvegarde (gérées par `prisma-components.js`) : `_prisma_backup_snapshot`, `_prisma_autobackup_config`, `_prisma_autobackup_history`, `_prisma_backup_corrupted_*`

> **Source de vérité des clés de données** : le tableau `PrismaBackup.ALL_DATA_KEYS` dans `prisma-components.js`. Toute nouvelle clé métier persistée doit y être ajoutée, sinon elle est exclue des sauvegardes/exports.

### Pattern commun dans chaque module

1. `loadClientSelect()` - Charge la liste des clients dans un `<select>`
2. `loadXxx()` - Charge et affiche les données depuis localStorage
3. `saveXxx()` - Sauvegarde via `localStorage.setItem()`
4. `generateXxx()` / `displayXxx()` - Génère l'aperçu imprimable
5. `downloadPDF()` - Export PDF via html2canvas + jsPDF

### Bibliothèque partagée : `prisma-components.js`

Chargée en bas de page dans **tous** les modules (`<script src="prisma-components.js"></script>`). Expose plusieurs objets globaux ; **les utiliser au lieu des API natives** :

| Objet | Rôle | À utiliser au lieu de |
|-------|------|-----------------------|
| `PrismaToast` | Notifications éphémères : `.success/.error/.warning/.info(message)` | — |
| `PrismaModal` | Dialogues : `.confirm()`, `.confirmDelete()`, `.alert()`, `.show({...})` | `confirm()` / `alert()` natifs |
| `PrismaLoader` | Overlay de chargement : `.show()`, `.hide()`, `.wrap(promise)` | — |
| `PrismaAutoSave` | Sauvegarde auto des formulaires en `sessionStorage` : `.init(formId)` | — |
| `PrismaSync` | Synchro entre onglets via l'événement `storage` : `.watch(key, cb)` | — |
| `PrismaBackup` | Protection des données : `.safeParseJSON(key, default)`, `.createSnapshot()`, `.restoreSnapshot()` | `JSON.parse(localStorage…)` brut |
| `PrismaAutoBackup` | Rappels/sauvegardes automatiques (bannière sous la `<nav>`) | — |
| `PrismaDocStore` | Stockage des documents sur le **disque** (File System Access API, Chrome/Edge) : le handle du dossier choisi par l'utilisateur est persisté en IndexedDB, les fichiers sont écrits dans `documents/<client>/<exercice>/…`. Utilisé par `gestion-app.html` (pièces jointes du suivi fiscal), avec repli base64/localStorage si non connecté | — |

**Règles importantes :**
- **Lecture localStorage** : préférer `PrismaBackup.safeParseJSON('clients', [])` — en cas de JSON corrompu, il **préserve** les données (`_prisma_backup_corrupted_*`) et ne les supprime jamais. (Certains modules historiques utilisent encore `JSON.parse` brut ; migrer vers `safeParseJSON` lors d'une modification.)
- Avant toute opération destructive (import, reset, suppression en masse) : appeler `PrismaBackup.createSnapshot()`.
- `PrismaBackup.ALL_DATA_KEYS` est la liste canonique des clés de données (cf. section Flux de données).

### Particularités métier

- **Classification Impôt/Honoraire** : Distinction systématique entre obligations fiscales et prestations intellectuelles
- **Monnaie** : F CFA (formatage via `toLocaleString('fr-FR')`)
- **Numérotation** : Auto-incrémentation (ex: `N° 0001/2026/01`, `RECU-0001/2026`)
- **KPIs fiscaux** : DARP, IGS, DSF, Patentes, FANR Harmony2 (termes fiscaux camerounais)
- **Centres de rattachement fiscal (CFLP / CIME / CSI / DGE)** : cartographie officielle DGI 2026 (99 centres organisés par 11 CRI) + **DGE** (Direction des Grandes Entreprises, service national unique pour les très grandes entreprises) — constante `CENTRES_IMPOTS_DGI` dans `clients.html`. Les anciens libellés `CDI YDE N`, `CIME YDE EST/OUEST`, `CSIPLI MFOUNDI`... sont automatiquement migrés par `normalizeCDI()` / `migrateCDItoCFLP()` (snapshot `PrismaBackup` avant écriture).
- **Filtrage contextuel du dropdown centre fiscal** (`populateCdiSelect(value, {ville, regime})`) : la liste se restreint automatiquement selon : (a) la **ville** → région du Cameroun via `VILLE_TO_REGION` → CRI via `REGION_TO_CRIS` ; (b) le **régime fiscal** via `getAllowedTypesForRegime(regime)` : `IGS` → uniquement les CFLP ; `Réel` → uniquement CIME / CSI / DGE. Les events `oninput` (ville) et `onchange` (régime) appellent `recomputeCdiSelectFromContext()`. Un badge sous le select rappelle les filtres actifs. La DGE est toujours visible pour le régime Réel (service national). La région **Nord (Garoua)** n'est pas dans la cartographie DGI → fallback automatique : pas de filtre régional. Le détail complet est dans `SPEC_LOVABLE.md` §4.2. **Clé localStorage : `cdi`** (préservée pour rétrocompatibilité avec tous les modules qui font `client.cdi`).

### Impôts immobiliers (calcul automatique)

Les clients peuvent avoir un statut immobilier (Locataire, Propriétaire, ou les deux) avec calcul automatique des impôts :

| Impôt | Taux | Applicable à | Base de calcul |
|-------|------|--------------|----------------|
| **PSL** (Précompte sur Loyer) | 10% | Locataires (sauf OBNL/Non Pro) | Loyer annuel |
| **Bail** (Bail Commercial) | 10% ou 5%* | Locataires | Loyer annuel |
| **TPF** (Taxe sur la Propriété Foncière) | 0,1% | Propriétaires | Valeur du bien |

*Le Bail est de **5%** pour les OBNL et Non Professionnels, **10%** pour les autres régimes.

**Champs client concernés :**
- `statutImmo` : "Locataire", "Proprietaire", "Les deux", ou vide
- `loyerMensuel` : montant du loyer mensuel saisi (F CFA)
- `loyerAnnuel` : calculé automatiquement (`loyerMensuel × 12`)
- `valeurBien` : valeur de l'immeuble ou terrain (F CFA)
- `psl`, `bail`, `tf` : montants calculés automatiquement (la clé de données reste `tf` ; l'acronyme **affiché** est **TPF**)

**Fonctionnalités :**
- Affichage en temps réel des impôts calculés dans le formulaire client
- Badges PSL/Bail/TPF dans la liste des clients
- KPIs dédiés dans la page d'accueil
- Boutons d'ajout rapide dans le formulaire de facture

### Situation fiscale (IGS & Patente)

Chaque client peut avoir un régime d'imposition avec calcul automatique des impôts :

**Régimes disponibles :**
- **IGS** (Impôt Général Synthétique) : Pour CA < 50 000 000 F CFA
- **Réel** (Patente) : Pour CA ≥ 50 000 000 F CFA ou sur option
- **Non Professionnel** : Revenus non professionnels (pas soumis à IGS/Patente, Bail à 5%)
- **OBNL** : Organismes à But Non Lucratif (pas soumis à IGS/Patente, Bail à 5%)

**Barème IGS (Article C 40 LPF) :**

| Classe | Chiffre d'affaires | Montant |
|--------|-------------------|---------|
| 1 | < 500 000 | 20 000 |
| 2 | 500 000 - 999 999 | 30 000 |
| 3 | 1 000 000 - 1 499 999 | 40 000 |
| 4 | 1 500 000 - 1 999 999 | 50 000 |
| 5 | 2 000 000 - 2 499 999 | 60 000 |
| 6 | 2 500 000 - 4 999 999 | 150 000 |
| 7 | 5 000 000 - 9 999 999 | 300 000 |
| 8 | 10 000 000 - 19 999 999 | 500 000 |
| 9 | 20 000 000 - 29 999 999 | 1 000 000 |
| 10 | 30 000 000 - 49 999 999 | 2 000 000 |

**Avantage CGA :** Réduction de 50% pour les adhérents à un Centre de Gestion Agréé

**Barème Patente (Moyennes Entreprises) :**
- Taux : **0,283%** du chiffre d'affaires
- Plancher : **141 500 F CFA** (minimum)
- Plafond : **4 500 000 F CFA** (maximum)

**Champs client concernés :**
- `regimeFiscal` : "IGS", "Reel", "NonPro", "OBNL"
- `chiffreAffaires` : CA de l'année passée ou prévisionnel
- `isCGA` : booléen (adhérent CGA)
- `isVendeurBoissons` : booléen (déclenche la Licence)
- `igs`, `igsClasse`, `patente`, `tdl`, `licence` : montants calculés automatiquement

### Taxes additionnelles (calcul automatique dans `clients.html`)

Constantes et fonctions définies dans `clients.html` (et dupliquées sous `*_COURRIER` dans `courrier-app.html` pour les modèles de courrier) :

- **Licence (vente de boissons)** : `2 × IGS` (régime IGS) ou `2 × Patente` (régime Réel), uniquement si `isVendeurBoissons`. Badge « Licence » dans la liste clients.
- **TDL (Taxe de Développement Local)** : barème par tranches `BAREME_TDL`, indexé sur **l'IGS en principal** (avant réduction CGA de 50 %) via `calculateTDL(montantIGSPrincipal)`. Rétro-compatible : `client.tdl || calculateTDL(igsPrincipal)`.

  | IGS en principal (F CFA) | TDL annuel |
  |--------------------------|-----------|
  | ≤ 30 000 | 7 500 |
  | ≤ 60 000 | 9 000 |
  | ≤ 100 000 | 15 000 |
  | ≤ 150 000 | 22 500 |
  | ≤ 200 000 | 30 000 |
  | ≤ 300 000 | 45 000 |
  | ≤ 400 000 | 60 000 |
  | ≤ 500 000 | 75 000 |
  | > 500 000 | 90 000 |

- **Solde IR** : `0,1 % du CA` (`SOLDE_IR_TAUX = 0.001`) à partir d'un CA ≥ 15 000 000 F CFA (`SOLDE_IR_SEUIL`).
- **Intérêts de retard IGS** : `PENALITE_TAUX = 0.10` (**10 % par mois** de retard), adaptés au mode de paiement du client.
- **Civilité** : `normalizeCivilite()` normalise vers `M.` / `Mme` ; utilisée dans les courriers, notes et fiches (« À l'attention de Monsieur/Madame »).
- **Fiche incomplète** : `verifierFicheClient()` renvoie les champs obligatoires manquants (nom, type, NIU, ville, contact, régime) → avertissement non bloquant via `PrismaToast.warning`.

### Modèle multi-agences (`clients.html`)

Un client peut exercer sur **plusieurs agences / établissements**. La source de vérité est `client.agences[]`, chaque entrée portant : `libelle`, `ville`, `quartier`, `principale`, `chiffreAffaires`, `statutImmo`, `loyerMensuel`, `loyerAnnuel`, `valeurBien`, `psl`, `bail`, `tf`.

- **IGS / Patente / TDL / Licence / Solde IR** : calculés sur le **CA cumulé** (`Σ agences.chiffreAffaires`) — un seul contribuable, un seul régime.
- **PSL / Bail / TPF** : calculés **par bien** (`computeAgencyImmo`) puis cumulés.
- **Compatibilité descendante** : les champs à plat `client.chiffreAffaires`, `psl`, `bail`, `tf`, `igs`, `patente`, `loyerAnnuel`, `valeurBien`, `statutImmo` restent renseignés comme **cumuls/dérivés** → `facture-app`, `courrier-app`, `situation-app` lisent ces totaux sans changement.
- **Migration** : `getAgences(client)` synthétise une agence unique à partir des anciens champs plats pour les clients antérieurs.
- Création/édition via `buildClientPayload()` ; recalcul live via `recomputeAll()` (les fonctions historiques `toggleImmoFields` / `calculateImmoTaxes` / `calculateFiscalTaxes` en sont désormais des alias).
- **Agence principale** : `agences[0]` (`principale: true`) est le **siège** — non supprimable (seulement modifiable), toujours présent. Son libellé par défaut suit la **localisation** du client (`Siège (ville)`, via `defaultPrincipaleLibelle()` / `syncPrincipaleLocation()`) tant qu'il n'est pas édité (drapeau `data-auto-libelle`).
- **Localisation par agence** : le siège **hérite** des `ville`/`quartier` du client ; chaque **agence secondaire** saisit ses propres `ville`/`quartier`. Le bloc « Récapitulatif des agences » (`renderAgencesRecap`, conteneur `#agencesRecap`) liste, pour chaque agence, sa localisation + CA + total immobilier.
- **Ventilation par bien dans les documents** : `devis.html` et `facture-app.html` génèrent **un bouton d'ajout par bien** (`getClientBiensImmo(client)` → `buildImmoTaxLabel(acronyme, bien)`). Les impôts immobiliers sont libellés **`Impôt_Ville/Quartier`** (acronymes **Bail / PSL / TPF**) — ex. `Bail_Yaoundé/Bastos`, `PSL_Douala/Akwa`, `TPF_Yaoundé/Centre` ; repli sur le libellé du bien puis sur l'acronyme seul si aucune localisation n'est renseignée. `courrier-app.html` itémise de même les obligations (helper local `buildImmoTaxLabel`). `situation-app.html` et `recu-app.html` **héritent** du détail via les lignes de facture (désignation en saisie libre). L'échéancier `getEcheanceForImpot` matche par sous-chaîne : `Bail` et `PSL` matchent directement ; **`TPF` ne contient pas `TF`**, donc une clé `'TPF'` a été ajoutée à `ECHEANCES_FISCALES` dans `situation-app.html` — les anciennes clés `'TF'`/`'Taxe Foncière'` sont conservées pour rétrocompat des documents historiques.

### Module Situation Client (`situation-app.html`)

Le module situation offre une vue consolidée par client avec plusieurs sections :

**Sections disponibles :**
- **Rapport d'Échéances** : Vue synthétique des impôts et honoraires impayés avec :
  - Statistiques (en retard, à payer)
  - Liste détaillée avec échéances et statut (EN RETARD, URGENT, jours restants)
  - Génération PDF du rapport
- **Dossier Fiscal Annuel** : Tous les impôts facturés (prestations de type "Impôt") avec :
  - Mode de paiement (Non payé / Via Cabinet / Payé par client)
  - Statut de réalisation (À faire / En cours / Effectué)
  - Documents associés (avis, reçus, quittances)
- **Honoraires Cabinet** : Uniquement les prestations de type "Honoraire" avec état de paiement et de réalisation
- **Historique des factures** : Liste des factures avec statut calculé automatiquement
- **Historique des paiements** : Liste des reçus de paiement
- **Suivi des Attestations** : Gestion des dates ACF (90 jours) et ATTIM (30 jours) avec alertes d'expiration

**Types de vue :**
- `globale` : Affiche toutes les sections
- `cabinet` : Affiche uniquement factures, paiements et prestations
- `fiscale` : Affiche uniquement dossier fiscal et attestations

**Calcul automatique des statuts de paiement :**
Les paiements (reçus) sont appliqués aux factures chronologiquement, avec distinction Impôts/Honoraires. Le statut de chaque facture est calculé dynamiquement (émise, partielle, payée).

**Modes de paiement des impôts :**
Pour chaque impôt, trois modes de paiement sont possibles :
- `non_paye` : Impôt non encore réglé
- `cabinet` : Impôt payé par le cabinet pour le compte du client (avec référence reçu)
- `client_direct` : Le client a payé directement ses impôts (avec date, référence quittance, commentaire)

### Échéances fiscales

| Obligation | Échéance | Mode de paiement |
|------------|----------|------------------|
| **IGS** | 15 Janvier, 15 Mars, 15 Juillet, 15 Octobre | Trimestriel ou annuel |
| **PSL** | 15 Janvier, 15 Mars, 15 Juillet, 15 Octobre | Trimestriel ou annuel |
| **Patente** | 28 Février | Annuel (unique) |
| **Bail Commercial** | Annuel | Paiement unique |
| **Taxe Foncière (TPF)** | Annuel | Paiement unique |
| **DSF** | 15 Mars | Déclaration annuelle |
| **DARP** | 30 Juin | Déclaration annuelle |
| **DBEF** | 30 Juin | Déclaration annuelle |

**Constante JavaScript :**
```javascript
const ECHEANCES_TRIMESTRIELLES = [
    { trimestre: 1, date: '15 Janvier' },
    { trimestre: 2, date: '15 Mars' },
    { trimestre: 3, date: '15 Juillet' },
    { trimestre: 4, date: '15 Octobre' }
];
```

## Développement

### Exécution
Ouvrir directement `index.html` dans un navigateur (aucun serveur requis).

### Ajout d'un nouveau module
1. Créer un fichier HTML avec la structure standard (nav, formulaire, zone d'aperçu)
2. Dans le `<head>` : `assets/css/tailwindcss.min.js`, `assets/css/inter-font.css`, `prisma-print.css` (et jsPDF + html2canvas via CDN si export PDF)
3. En bas de page : `<script src="prisma-components.js"></script>` (avant le script du module) pour disposer de `PrismaToast`/`PrismaModal`/`PrismaBackup`…
4. Ajouter la carte de lien dans `index.html`
5. Utiliser le même pattern localStorage que les autres modules ; lire via `PrismaBackup.safeParseJSON` et déclarer toute nouvelle clé dans `PrismaBackup.ALL_DATA_KEYS`
6. **Mettre à jour `aide.html`** (voir ci-dessous)

### Mise à jour du module Aide (à chaque changement majeur)
Le module `aide.html` doit refléter l'état courant de l'application. À chaque changement significatif (nouveau module, refonte d'un workflow, modification d'un barème, etc.) :
1. **Ajouter une entrée dans le bloc Changelog** (`<section id="changelog">` — en haut du contenu) avec : version, date, badges (new/update/fix/breaking), liste des changements détaillée.
2. **Mettre à jour les constantes** en bas du `<script>` : `APP_VERSION` (ex. `'2.4'`) et `LAST_UPDATE` (ISO `'AAAA-MM-JJ'`).
3. **Mettre à jour la section concernée** (Modules / Concepts métier / FAQ) si nécessaire.
4. Si un nouveau concept fiscal est introduit, ajouter une sous-section sous `#concepts` avec un id `concept-xxx` + entrée correspondante dans le sommaire (sticky aside).
5. Si une nouvelle question récurrente apparaît, l'ajouter dans la FAQ (`<section id="faq">`).

### Styles CSS
- Police : Inter, servie **localement** (`assets/css/inter-font.css` + `assets/fonts/inter-latin.woff2`)
- Couleur principale : `#1e3a8a` (blue-900)
- Classes d'impression : `.no-print`, `.print-area`
- `prisma-print.css` : feuille d'impression A4 **partagée** (règles `@page`, et variables de palette `--print-*` activées sous `@media print`) — la modifier impacte tous les modules qui la lient

---

## Système d'impression directe (OBLIGATOIRE)

Dans **toutes les applications** (anciennes et nouvelles), l'impression doit se faire **directement** en ouvrant le menu d'impression du navigateur, **sans ouvrir une nouvelle fenêtre ou un nouvel onglet**.

### Principe

Remplacer `window.open('', '_blank')` par le mécanisme suivant :

1. Créer un `<style>` temporaire avec les CSS d'impression et l'injecter dans `document.head`
2. Sauvegarder le contenu actuel : `const originalContent = document.body.innerHTML`
3. Remplacer le body par le contenu à imprimer : `document.body.innerHTML = bodyContent`
4. Déclencher l'impression : `window.print()`
5. Restaurer le body : `document.body.innerHTML = originalContent`
6. Supprimer le style temporaire : `document.getElementById('xxx-print-style').remove()`
7. Réinitialiser les événements : `init()`

### Modèle de référence

```javascript
function printQuelqueChose() {
    // 1. Style temporaire injecté dans <head>
    const printStyle = document.createElement('style');
    printStyle.id = 'xxx-print-style';
    printStyle.textContent = `
        @page { size: A4; margin: 1.5cm; }
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        body { font-family: Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; }
        /* ... autres styles avec préfixe unique pour éviter les conflits ... */
    `;
    document.head.appendChild(printStyle);

    // 2. Contenu à imprimer (body uniquement, sans <html><head><body>)
    const bodyContent = `
        <div class="xxx-print-header">...</div>
    `;

    // 3. Remplacement temporaire + impression directe
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = bodyContent;
    window.print();

    // 4. Restauration
    document.body.innerHTML = originalContent;
    document.getElementById('xxx-print-style').remove();
    init();
}
```

### Règles importantes

- **Ne jamais utiliser** `window.open('', '_blank')` ni `window.open('', '', 'width=...,height=...')` pour l'impression
- Le contenu passé à `document.body.innerHTML` ne doit contenir **que le body** (pas de `<!DOCTYPE>`, `<html>`, `<head>`, `<body>`)
- Les classes CSS du style temporaire doivent avoir un **préfixe unique** (ex: `teams-`, `dc82-`, `rpt-`) pour éviter les conflits avec les styles existants de la page
- Si la page possède une règle `@media print { body { display: none; } }`, l'ajouter en override dans le style temporaire : `@media print { body { display: block !important; } }`
- Toujours appeler `init()` après restauration pour réattacher les événements
