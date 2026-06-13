# SPEC_LOVABLE.md — Portage fidèle PRISMA GESTION vers Lovable.dev

> **Objet** : Document de spécification exhaustif pour reproduire à l'identique les modules **Clients**, **Factures**, **Devis/Proforma**, **Proposition de paiement**, **Reçu de paiement** et **Courrier** du projet local PRISMA GESTION (HTML/JS vanilla + localStorage) dans un projet **Lovable.dev** (typiquement Vite + React + TypeScript + Supabase).
>
> **Principe directeur** : chaque état d'écran, chaque calcul fiscal, chaque rendu imprimable doit être bit-pour-bit équivalent au comportement local. Aucune simplification, aucune omission.

---

## Table des matières

1. [Architecture cible](#1-architecture-cible)
2. [Constantes fiscales partagées (source unique de vérité)](#2-constantes-fiscales-partagées)
3. [Configuration cabinet (signature, cachet, signataire)](#3-configuration-cabinet)
4. [Module Clients](#4-module-clients)
5. [Module Factures](#5-module-factures)
6. [Module Devis / Proforma](#6-module-devis--proforma)
7. [Module Proposition de paiement](#7-module-proposition-de-paiement)
8. [Module Reçu de paiement](#8-module-reçu-de-paiement)
9. [Module Courrier](#9-module-courrier)
10. [Conventions transversales](#10-conventions-transversales)
11. [Checklist d'acceptation](#11-checklist-dacceptation)
12. [Audit de fidélité au code local](#12-audit-de-fidélité-au-code-local)

---

## 1. Architecture cible

### 1.1 Stack recommandée Lovable.dev

| Couche | Local (HTML vanilla) | Lovable.dev (cible) |
|---|---|---|
| UI | Tailwind via CDN, HTML statique | React + TailwindCSS + shadcn/ui |
| Police | Inter (Google Fonts) | Inter (idem) |
| Couleur primaire | `#1e3a8a` (blue-900) | `--primary: 222 47% 32%` (HSL) |
| Persistance | `localStorage` (clés JSON par module) | Supabase Postgres (tables équivalentes) ou KV équivalent |
| PDF | jsPDF + html2canvas (CDN) | jsPDF + html2canvas (npm) ou `react-to-print` |
| Fichiers | un HTML autonome par module | une route React par module |

### 1.2 Modèle de stockage Supabase (équivalent localStorage)

| Clé localStorage | Table Supabase | Description |
|---|---|---|
| `clients` | `clients` | Fiches clients |
| `factures` | `factures` | Factures émises |
| `devis` | `devis` | Devis / proforma |
| `recus` | `recus` | Reçus de paiement |
| `propositions` | `propositions` | Propositions de paiement |
| `courriers` | `courriers` | Courriers |
| `cabinetConfig` | `cabinet_config` (1 ligne) | Identité cabinet, signataire, signature, cachet (base64) |
| `prestationRealizationStatus` | `prestation_status` | Statut À faire/En cours/Effectué par prestation |
| `dossierFiscalStatus` | `dossier_fiscal_status` | Statut documents fiscaux par client/année |
| `paiementsImpotsDirects` | `paiements_impots_directs` | Mode paiement impôts (cabinet/client_direct) |
| `attestations` | `attestations` | Dates ACF (90j) et ATTIM (30j) par client |

**Convention cible Lovable** : chaque table doit posséder un champ `client_data jsonb` (snapshot du client au moment de l'émission) pour les modules factures/devis/recus/propositions. Les reçus locaux legacy ne stockent pas encore `clientData` et relisent le client par nom ; Lovable doit stocker le snapshot pour les nouveaux reçus tout en conservant un fallback par nom pour relire les données existantes. Pour factures, devis et propositions, ne jamais lire le client en live au rendu : le document conserve l'état du client tel qu'il était à l'émission.

### 1.3 Routes React suggérées

```
/                          → Tableau de bord (équivalent index.html)
/clients                   → Module Clients
/factures                  → Liste + onglet création (facture-app.html)
/devis                     → Module Devis/Proforma
/propositions              → Module Proposition de paiement (avance-app.html)
/recus                     → Module Reçu de paiement
/courriers                 → Module Courrier
/parametres                → Configuration cabinet
```

---

## 2. Constantes fiscales partagées

> **À placer dans `src/lib/fiscal-constants.ts`. Source UNIQUE de vérité — toute duplication est interdite.**

```typescript
// === BARÈME IGS (Article C 40 alinéa 1 LPF) ===
export const BAREME_IGS = [
  { classe: 1,  min: 0,        max: 499999,    montant: 20000 },
  { classe: 2,  min: 500000,   max: 999999,    montant: 30000 },
  { classe: 3,  min: 1000000,  max: 1499999,   montant: 40000 },
  { classe: 4,  min: 1500000,  max: 1999999,   montant: 50000 },
  { classe: 5,  min: 2000000,  max: 2499999,   montant: 60000 },
  { classe: 6,  min: 2500000,  max: 4999999,   montant: 150000 },
  { classe: 7,  min: 5000000,  max: 9999999,   montant: 300000 },
  { classe: 8,  min: 10000000, max: 19999999,  montant: 500000 },
  { classe: 9,  min: 20000000, max: 29999999,  montant: 1000000 },
  { classe: 10, min: 30000000, max: 49999999,  montant: 2000000 },
] as const;

// === PATENTE (Moyennes Entreprises, régime Réel) ===
export const PATENTE_TAUX     = 0.00283;    // 0,283 %
export const PATENTE_PLANCHER = 141500;     // F CFA
export const PATENTE_PLAFOND  = 4500000;    // F CFA

// === SOLDE IR / IS ===
export const SOLDE_IR_TAUX    = 0.001;       // 0,1 %
export const SOLDE_IR_SEUIL   = 15000000;    // applicable si CA ≥ ce seuil

// === BARÈME TDL (Taxe Développement Local — sur IGS principal) ===
export const BAREME_TDL = [
  { max: 30000,    montant: 7500 },
  { max: 60000,    montant: 9000 },
  { max: 100000,   montant: 15000 },
  { max: 150000,   montant: 22500 },
  { max: 200000,   montant: 30000 },
  { max: 300000,   montant: 45000 },
  { max: 400000,   montant: 60000 },
  { max: 500000,   montant: 75000 },
  { max: Infinity, montant: 90000 },
] as const;

// === PÉNALITÉS IGS ===
export const PENALITE_IGS_TAUX = 0.10;       // 10 % par mois de retard

// === IMPÔTS IMMOBILIERS ===
// PSL : 10 % du loyer annuel (sauf OBNL/NonPro qui sont exonérés)
// Bail : 10 % normal, 5 % pour OBNL/NonPro (paiement unique annuel)
// TPF : 0,1 % de la valeur du bien

// === RÉDUCTION CGA ===
// 50 % de l'IGS pour les adhérents à un Centre de Gestion Agréé
// La TDL est calculée sur l'IGS PRINCIPAL (avant réduction CGA)

// === LICENCE BOISSONS ===
// 2 × IGS si régime IGS et vendeur de boissons
// 2 × Patente si régime Réel et vendeur de boissons

// === ÉCHÉANCES TRIMESTRIELLES IGS / PSL ===
export const ECHEANCES_TRIMESTRIELLES = [
  { trimestre: 1, mois: 0,  jour: 15, label: '15 Janvier' },
  { trimestre: 2, mois: 2,  jour: 15, label: '15 Mars' },
  { trimestre: 3, mois: 6,  jour: 15, label: '15 Juillet' },
  { trimestre: 4, mois: 9,  jour: 15, label: '15 Octobre' },
] as const;

// Échéance annuelle IGS : 1er Mars (péribilité au 1er Avril)
// Patente : annuelle 28 Février
// Bail Commercial / TPF : annuel
// DSF : 15 Mars
// DARP : 30 Juin
// DBEF : 30 Juin
```

### 2.1 Fonctions de calcul (à placer dans `src/lib/fiscal.ts`)

```typescript
export function calculateIGS(ca: number, isCGA: boolean) {
  for (const t of BAREME_IGS) {
    if (ca >= t.min && ca <= t.max) {
      const montantPrincipal = t.montant;
      const montant = isCGA ? Math.round(montantPrincipal / 2) : montantPrincipal;
      return { montant, montantPrincipal, classe: t.classe, horsBareme: false };
    }
  }
  // CA > 50 000 000 → IGS hors barème (le client doit basculer en Réel)
  return { montant: 0, montantPrincipal: 0, classe: 0, horsBareme: true };
}

export function calculatePatente(ca: number) {
  const montantCalcule = Math.round(ca * PATENTE_TAUX);
  let montant = montantCalcule;
  if (montantCalcule < PATENTE_PLANCHER) montant = PATENTE_PLANCHER;
  else if (montantCalcule > PATENTE_PLAFOND) montant = PATENTE_PLAFOND;
  return { montant, montantCalcule, taux: PATENTE_TAUX * 100, plancher: PATENTE_PLANCHER, plafond: PATENTE_PLAFOND };
}

export function calculateSoldeIR(ca: number) {
  const applicable = ca >= SOLDE_IR_SEUIL;
  return { montant: applicable ? Math.round(ca * SOLDE_IR_TAUX) : 0, applicable };
}

export function calculateTDL(montantIGSPrincipal: number) {
  const m = Math.round(montantIGSPrincipal || 0);
  if (m <= 0) return 0;
  const t = BAREME_TDL.find(item => m <= item.max);
  return t ? t.montant : 0;
}

export function calculateImmoTaxes(client) {
  const isOBNLorNonPro = client.regimeFiscal === 'OBNL' || client.regimeFiscal === 'NonPro';
  let psl = 0, bail = 0, tf = 0, tauxBail = 10;
  if (client.statutImmo === 'Locataire' || client.statutImmo === 'Les deux') {
    if (!isOBNLorNonPro) psl = Math.round(client.loyerAnnuel * 0.10);
    tauxBail = isOBNLorNonPro ? 5 : 10;
    bail = Math.round(client.loyerAnnuel * (tauxBail / 100));
  }
  if (client.statutImmo === 'Proprietaire' || client.statutImmo === 'Les deux') {
    tf = Math.round(client.valeurBien * 0.001);
  }
  return { psl, bail, tf, tauxBail };
}

// Solde tax label : "Solde IS" pour Personne morale, sinon "Solde IR"
export function getSoldeTaxLabel(client) {
  return client?.type === 'Personne morale' ? 'Solde IS' : 'Solde IR';
}

export function formatMoney(amount: number) {
  return `${Math.round(amount || 0).toLocaleString('fr-FR')} F CFA`;
}

// Normalisation civilité (pour cohérence avec import CSV)
export function normalizeCivilite(value: string, fallback = 'M.'): 'M.' | 'Mme' {
  const n = String(value || '').trim().toLowerCase();
  if (['mme', 'madame', 'f', 'femme', 'feminin', 'féminin'].includes(n)) return 'Mme';
  if (['m.', 'm', 'mr', 'monsieur', 'h', 'homme', 'masculin'].includes(n)) return 'M.';
  return fallback as 'M.' | 'Mme';
}
```

---

## 3. Configuration cabinet

### 3.1 Modèle `cabinetConfig`

```typescript
interface CabinetConfig {
  // Identité
  nomCabinet: string;          // Défaut: "PRISMA GESTION"
  slogan: string;              // Défaut: "Comptabilité - Finance - Fiscalité"
  siege: string;               // Défaut: "Yaoundé - Bata Longkak"
  telephone: string;           // Défaut: "(237) 656 752 475 / 671 050 546"
  niu: string;                 // Défaut: "M052116042979Z"
  // Signataire par défaut
  signataireNom: string;       // Défaut: "OBIANG TIME Nathan"
  signataireTitre: string;     // Défaut: "Directeur Associé"
  // Visuels (data URL base64)
  signature?: string;          // image/png|jpg en base64
  cachet?: string;             // image/png|jpg en base64
  // Pied de page
  signaturePromo: string;      // Défaut: "PRISMA Manager — PRISMA GESTION : L'expertise qui sécurise votre gestion."
}
```

### 3.2 Coordonnées de paiement par défaut

```
Mode de paiement : Mobile Money / Espèces
Numéros : 656 75 24 75 / 694 31 05 54 — OBIANG TIME Nathan
Échéance facture : 30 jours à compter de la date d'émission
```

Ces données s'affichent automatiquement dans tous les rendus imprimables.

---

## 4. Module Clients

### 4.1 Modèle de données complet

```typescript
interface Client {
  id: number;                          // timestamp Date.now()
  // === GÉNÉRAL ===
  type: 'Personne morale' | 'Personne physique';
  name: string;                        // Nom / Raison sociale (obligatoire)
  niu: string;                         // Ex: M052116042979Z (obligatoire)
  cdi: string;                         // Centre de rattachement fiscal (obligatoire)
  // === LOCALISATION ===
  ville: string;                       // (obligatoire)
  quartier: string;                    // (obligatoire)
  // === COORDONNÉES ===
  phone: string;                       // (obligatoire)
  email?: string;
  contact?: string;                    // Nom du contact principal
  civilite: 'M.' | 'Mme';              // Stocké normalisé
  // === MÉTIER ===
  secteur: string;                     // (obligatoire)
  cnps?: string;
  externalise: 'Oui' | 'Non';          // Défaut: Non
  statut: 'Actif' | 'Inactif';         // Défaut: Actif
  // === SITUATION IMMOBILIÈRE ===
  statutImmo?: '' | 'Locataire' | 'Proprietaire' | 'Les deux';
  loyerMensuel?: number;
  loyerAnnuel?: number;                // Calculé: loyerMensuel × 12
  valeurBien?: number;
  // Calculés (immo) :
  psl?: number;                        // 10% loyer annuel (0 si OBNL/NonPro)
  bail?: number;                       // 10% normal, 5% OBNL/NonPro
  tauxBail?: 10 | 5;
  tf?: number;                         // 0,1% valeur bien
  // === SITUATION FISCALE ===
  regimeFiscal?: '' | 'IGS' | 'Reel' | 'NonPro' | 'OBNL';
  chiffreAffaires?: number;
  isCGA?: boolean;                     // Adhérent CGA → réduction 50% IGS
  isVendeurBoissons?: boolean;         // Licence = 2× IGS ou 2× Patente
  modePaiementIGS: 'annuel' | 'trimestriel';   // Défaut: annuel
  modePaiementPSL: 'annuel' | 'trimestriel';   // Défaut: annuel
  // Calculés (fiscal) :
  igs?: number;
  igsClasse?: number;                  // 1 à 10
  patente?: number;
  tdl?: number;                        // calculé sur IGS principal
  soldeIR?: number;                    // 0,1% du CA si CA ≥ 15M
  licence?: number;                    // 2× IGS ou 2× Patente
  // === MÉTA ===
  createdAt: string;                   // ISO 8601
}
```

### 4.2 Liste des centres de rattachement fiscal (cartographie DGI 2026)

Liste à fournir dans le `<Select>` avec **optgroups** groupés par **Centre Régional des Impôts (CRI)**. Source officielle : https://www.impots.cm/fr/cartographie-des-centres-regionaux-des-impots — 99 centres.

**Sigles :**
- **CIME** : Centre des Impôts des Moyennes Entreprises (cible Régime Réel)
- **CFLP** : Centre de Fiscalité Locale et des Particuliers (**cible IGS** et particuliers)
- **CSI** : Centre Spécialisé des Impôts

**CRI Centre 1 — Yaoundé urbain et centres spécialisés (16 centres) :**
- CIME Yaoundé-Est, CIME Yaoundé-Ouest
- CFLP Yaoundé 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 _(Yaoundé 3 et 4 ne figurent pas dans la cartographie DGI 2026)_
- CSI EPA-CTD Yaoundé, CSI Professions Libérales et Immobilier Yaoundé

**CRI Centre 2 — Yaoundé extérieur et départements (13 centres) :**
- CIME Yaoundé-Extérieur
- CFLP Obala, Haute Sanaga, Mefou et Afamba, Mefou et Akono, Mbandjock, Monatélé, Sa'a, Mbam et Inoubou, Mbam et Kim, Nyong et Kelle, Nyong et Mfoumou, Nyong et So'o

**CRI Littoral 1 — Douala urbain (11 centres) :**
- CIME Douala-Akwa 1, CIME Douala-Akwa 2, CIME Douala-Bonanjo
- CFLP Douala 1, 2, 10, 11, 12, 13, 14
- CSI Professions Libérales et Immobilier Douala

**CRI Littoral 2 — Douala extérieur (7 centres) :**
- CIME Douala-Extérieur
- CFLP Bonaberi, Bonaberi 2, Sanaga Maritime, Mbanga, Moungo, Nkam

**CRI Ouest — Bafoussam (9 centres) :**
- CIME Bafoussam
- CFLP Foumbot, Menoua, Bamboutos, Hauts-Plateaux, Haut Nkam, Koung-Khi, Ndé, Noun

**CRI Nord-Ouest — Bamenda (8 centres, exclusivement CFLP) :**
- CFLP Bamenda, Mezam, Momo, Menchum, Ngoketunjia, Boyo, Bui, Donga Mantug

**CRI Sud-Ouest — Buea / Limbe (11 centres) :**
- CIME Limbe
- CFLP Buea, Limbe, Tiko, Muyuka, Bakassi, Ekondo Titi, Manyu, Meme, Koupé-Manengouba, Lebialem

**CRI Sud — Ebolowa / Kribi (7 centres, exclusivement CFLP) :**
- CFLP Kribi, Océan, Mvila, Dja et Lobo, Ntem, Meyomessala, Zoétélé

**CRI Est — Bertoua (5 centres) :**
- CIME Bertoua
- CFLP Lom et Djerem, Kadey, Boumba et Ngoko, Haut Nyong

**CRI Adamaoua — Ngaoundéré (6 centres) :**
- CIME Ngaoundéré
- CFLP Vina, Djerem, Faro & Deo, Mayo-Banyo, Mbere

**CRI Extrême-Nord — Maroua (6 centres) :**
- CIME Maroua
- CFLP Diamaré, Logone et Chari, Mayo Danay, Mayo Kani, Mayo Tsanaga

**DGE — Direction des Grandes Entreprises (national)** : un seul centre (`DGE Yaoundé`), service national pour les très grandes entreprises (CA > 3 Md F CFA typiquement). **Toujours visible** pour le régime Réel, indépendamment de la région.

**Autre** (saisie libre, conserve toute valeur hors cartographie DGI)

#### Filtrage contextuel du dropdown (ville + régime)

La liste se **restreint automatiquement** selon le contexte saisi :

| Champ | Filtre appliqué |
|---|---|
| `ville` → région via `VILLE_TO_REGION` | Seuls les CRI de la région correspondante sont conservés (la DGE reste toujours visible). |
| `regimeFiscal = IGS` | Seuls les **CFLP** sont conservés (tous les contribuables IGS relèvent d'un CFLP). |
| `regimeFiscal = Reel` | Seuls les **CIME**, **CSI** et la **DGE** sont conservés. |
| `regimeFiscal = NonPro / OBNL` ou vide | Aucun filtre par type. |
| Région **Nord** (Garoua) | Aucun CRI listé en DGI → fallback : pas de filtre régional. |

**Implémentation :**
- Constante `VILLE_TO_REGION` : mappe les villes du Cameroun (capitales + localités DGI) vers leur région.
- Constante `REGION_TO_CRIS` : mappe chaque région vers les libellés des CRI correspondants.
- Fonction `populateCdiSelect(value, { ville, regime })` : reconstruit le `<select>` avec les filtres.
- Fonction `recomputeCdiSelectFromContext()` : appelée par les events `oninput` (champ ville) et `onchange` (champ régime fiscal).
- Si la valeur courante est exclue par les filtres, elle est conservée comme **"valeur hors filtre"** en tête du select (badge ⚠ visible).
- Un **badge sous le select** (`#clientCdiFilterBadge`) rappelle les filtres actifs et le nombre de centres compatibles.

> **Note de migration :** les anciens libellés (`CDI YDE N`, `CDI MEFOU ET AFAMBA`, `CIME YDE EST/OUEST`, `CSIPLI MFOUNDI`, `CDI Douala/Bafoussam/Garoua`...) sont automatiquement reconnus et convertis vers leur équivalent officiel par `normalizeCDI()` / `migrateCDItoCFLP()` dans `clients.html`. La constante de référence est `CENTRES_IMPOTS_DGI` (tableau organisé par CRI + groupe DGE). La région **Nord (Garoua)** n'apparaît pas dans la cartographie DGI 2026 consultée — les anciennes valeurs `CDI Garoua` restent stockées telles quelles et apparaissent comme "valeur historique" en tête du dropdown à l'édition.

### 4.3 Comportements UI obligatoires

#### Affichage conditionnel des champs

| Sélection | Champs visibles |
|---|---|
| `statutImmo = Locataire` | Loyer mensuel + Loyer annuel (calculé) + Mode paiement PSL (sauf OBNL/NonPro) |
| `statutImmo = Proprietaire` | Valeur du bien |
| `statutImmo = Les deux` | Tous les champs ci-dessus |
| `regimeFiscal = IGS` | CA + CGA + Mode paiement IGS + Vendeur boissons |
| `regimeFiscal = Reel` | CA + Vendeur boissons |
| `regimeFiscal = NonPro/OBNL` | (rien de plus) ; PSL = 0 ; Bail = 5 % |

#### Calcul en temps réel

Dès qu'un champ pertinent change (CA, CGA, statut immo, loyer, valeur bien, régime, mode paiement) :
- Recalculer `loyerAnnuel = loyerMensuel × 12`
- Recalculer immo (`psl`, `bail`, `tf`)
- Recalculer fiscal (`igs`, `igsClasse`, `patente`, `tdl`, `soldeIR`, `licence`)
- Afficher le **dashboard fiscal** (cartes de calcul détaillé) si CA > 0

#### Dashboard fiscal (régime IGS / Réel)

Composé de :
1. **Cartes par impôt** (IGS, TDL, Solde IR/IS, Licence, Patente) avec :
   - Type, label, montant principal, note de calcul, sous-note, badge
2. **Total fiscal** (somme + barre de répartition colorée)
3. **Calendrier IGS** si régime IGS :
   - Si annuel : 1 carte échéance 01/03, pénalités à partir du 01/04
   - Si trimestriel : 4 cartes (T1/15-01, T2/15-03, T3/15-07, T4/15-10), pénalités 30 jours après chaque échéance
   - Statuts : `ok` (vert, X jours restants), `grace` (orange, période de grâce avec progression), `retard` (rouge, mois de retard × 10 % de pénalité)

#### Alerte hors barème

Si `regimeFiscal = IGS` et `CA > 50 000 000` → afficher carte d'alerte rouge :
> "CA hors barème IGS. Le chiffre d'affaires dépasse 50 000 000 F CFA. Le client doit basculer au régime Réel pour la patente."

### 4.4 Liste des clients

Tableau avec colonnes :

| Type | Nom / Raison sociale | NIU | CDI | Ville | Immo | Fiscal | Statut | Actions |
|---|---|---|---|---|---|---|---|---|

- **Type** : badge `PM` (bleu) / `PP` (violet)
- **Immo** : badges PSL (bleu), Bail (vert avec taux), TPF (orange), `-` si aucun
- **Fiscal** : badges
  - IGS Cn (vert) + TDL (teal) + Solde IR/IS (indigo) + Licence (rose) si régime IGS
  - Patente (ambre) + Solde IR/IS + Licence si régime Réel
  - "Non Pro" (gris) ou "OBNL" (violet) selon le cas
- **Statut** : badge vert (Actif) / gris (Inactif)
- **Actions** : Modifier ✏️ / Supprimer 🗑️

#### Filtres en haut de liste

- Recherche textuelle (sur name, niu, cdi, ville, quartier, email, phone, contact)
- Filtre régime (Tous / IGS / Reel / NonPro / OBNL)
- Filtre statut (Tous / Actif / Inactif / Prospect)
- Bouton "Réinitialiser filtres"
- Affichage compteur "X client(s) trouvé(s) sur Y" si filtres actifs

### 4.5 Import CSV / XLSX / JSON

**Colonnes attendues** (insensibles à la casse, alias acceptés) :

| Colonne canonique | Alias acceptés |
|---|---|
| `name` (obligatoire) | nom, raison sociale, raison_sociale |
| `niu` (obligatoire) | (idem) |
| `type` | type client, type_client |
| `cdi` | centre fiscal, centre rattachement, centre des impôts, centrerattachement |
| `ville` | adresse, city |
| `quartier` | (idem) |
| `phone` | telephone, téléphone, tel |
| `email` | e-mail, mail, courriel |
| `contact` | personne contact, contact principal |
| `civilite` | civilité, genre, sexe |
| `secteur` | activité, activite, secteur d'activité, sector |
| `statut` | status, état, etat |
| `cnps` | numerocnps, numero_cnps, numéro cnps |
| `externalise` | externe, externalisé, gestion externalisée |

**Workflow** :
1. Bouton "Importer" → ouvre formulaire
2. Sélection fichier (CSV/XLSX/JSON) → preview en tableau (max 64 lignes scrollables)
3. Validation : NIU et nom obligatoires
4. Lignes invalides marquées en rouge
5. Bouton "Importer les clients" actif si ≥ 1 ligne valide
6. Bouton "Télécharger un modèle CSV" pour exporter un template

### 4.6 Vérification de fiche complète

Champs obligatoires pour qu'un document (facture/devis) puisse être émis :
- `name`, `type`, `niu`, `ville`, `contact`, `regimeFiscal`

Si manquant, **bloquer l'émission** et afficher toast d'erreur avec liste des champs.
Lors de la sélection d'un client incomplet (sans bloquer encore), afficher un toast warning.

---

## 5. Module Factures

### 5.1 Modèle de données

```typescript
interface Facture {
  id: number;                                  // Date.now()
  number: string;                              // Format auto: "N° 0001/2026/01"
  client: string;                              // Nom client (pour affichage rapide)
  clientData: Client;                          // SNAPSHOT complet du client à l'émission
  prestations: Prestation[];
  total: number;
  totalImpots: number;
  totalHonoraires: number;
  date: string;                                // ISO 8601
  isManual: boolean;                           // Mode manuel ?
  status: 'émise' | 'partiellement_payée' | 'payée' | 'annulée';
  fromDevis: boolean;                          // Créée depuis un devis ?
  fromDevisId?: number | null;
  fromDevisNumber?: string | null;
  dateModified?: string;                        // ISO, uniquement en édition locale
}

interface Prestation {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  qty: number;                                 // Défaut 1
  price: number;                               // Prix unitaire
  total: number;                               // qty × price
}
```

### 5.2 Numérotation automatique

```typescript
// Si mode auto :
const num = String(factures.length + 1).padStart(4, '0');
const month = String(new Date().getMonth() + 1).padStart(2, '0');
const number = `N° ${num}/${new Date().getFullYear()}/${month}`;
```

### 5.3 Onglets de l'écran

- **Onglet "+ Nouvelle Facture"** (défaut)
- **Onglet "Liste des Factures"**

### 5.4 Mode Auto/Manuel (toggle)

| Mode | Comportement |
|---|---|
| **Auto** (bleu) | N° et date générés automatiquement |
| **Manuel** (orange) | Champ N° éditable + champ Date du document obligatoire |

### 5.5 Liste prédéfinie d'**impôts** (15 entrées)

```typescript
const LISTE_IMPOTS = [
  { designation: 'Précompte sur Loyer (PSL)', montant: 0 },
  { designation: 'Bail Commercial', montant: 0 },
  { designation: 'Taxe Foncière (TPF)', montant: 0 },
  { designation: 'Impôt Général Synthétique (IGS)', montant: 0 },
  { designation: 'Taxe de Développement Local (TDL)', montant: 0 },
  { designation: 'Solde IR', montant: 0 },          // remplacé par "Solde IS" si PM
  { designation: 'Patente', montant: 0 },
  { designation: 'Impôt sur le Revenu des Personnes Physiques (IRPP)', montant: 0 },
  { designation: 'Taxe sur la Valeur Ajoutée (TVA)', montant: 0 },
  { designation: 'Acompte Impôt sur les Sociétés (AIS)', montant: 0 },
  { designation: 'Contribution au Crédit Foncier (CCF)', montant: 0 },
  { designation: 'Centimes Additionnels Communaux (CAC)', montant: 0 },
  { designation: 'Redevance Audiovisuelle (RAV)', montant: 0 },
  // CGA :
  { designation: 'Inscription au Centre de Gestion Agréé', montant: 75000 },
  { designation: 'Cotisation Annuelle au CGA', montant: 50000 },
];
```

### 5.6 Listes prédéfinies d'**honoraires**

#### Honoraires communs (tous régimes)
```typescript
const HONORAIRES_COMMUNS = [
  { designation: 'Déclaration Annuelle des Revenus des Particuliers (DARP)', montant: 5000 },
  { designation: 'Déclaration des Bénéficiaires Effectifs (DBEF)', montant: 5000 },
  { designation: 'Obtention ACF (Attestation de Conformité Fiscale)', montant: 2100 },
  { designation: 'Obtention ATTIM (Attestation Immatriculation)', montant: 2100 },
  { designation: 'Conseil fiscal', montant: 25000 },
  { designation: "Création d'entreprise", montant: 75000 },
  { designation: 'Modification statutaire', montant: 50000 },
];
```

#### Honoraires par régime fiscal
```typescript
const HONORAIRES_PAR_REGIME = {
  Reel: [
    { designation: 'Renouvellement du dossier fiscal', montant: 15000 },
    { designation: 'Montage et mise en ligne DSF', montant: 100000 },
    { designation: 'Forfait suivi gestion fiscal', montant: 120000 },
    { designation: 'Tenue de comptabilité mensuelle', montant: 100000 },
    { designation: 'Établissement des états financiers', montant: 150000 },
    { designation: 'Assistance contrôle fiscal', montant: 200000 },
  ],
  IGS: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10000 },
    { designation: 'Montage et mise en ligne DSF', montant: 30000 },
    { designation: 'Forfait suivi gestion fiscal', montant: 60000 },
    { designation: 'Tenue de comptabilité mensuelle', montant: 50000 },
    { designation: 'Établissement des états financiers', montant: 75000 },
    { designation: 'Assistance contrôle fiscal', montant: 100000 },
  ],
  NonPro: [
    { designation: 'Déclaration des revenus fonciers', montant: 15000 },
    { designation: 'Suivi fiscal annuel', montant: 30000 },
  ],
  OBNL: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10000 },
    { designation: 'Montage et mise en ligne DSF', montant: 50000 },
    { designation: 'Tenue de comptabilité', montant: 60000 },
  ],
};
```

**Règle** : la liste honoraires affichée dans le `<select>` est :
`[...HONORAIRES_PAR_REGIME[client.regimeFiscal || 'IGS'], ...HONORAIRES_COMMUNS]`.

### 5.7 Boutons rapides "Impôts du client et CGA"

Dès qu'un client est sélectionné, afficher une rangée de boutons (couleurs codées) :

| Bouton | Couleur | Action | Condition |
|---|---|---|---|
| + PSL | bleu | Ajoute une ligne `PSL_Ville/Quartier` au montant du bien — **ventilé par agence** (`buildImmoTaxLabel`) | bien.psl > 0 |
| + Bail | teal | Ajoute une ligne `Bail_Ville/Quartier` au montant du bien — **ventilé par agence** | bien.bail > 0 |
| + TPF | orange | Ajoute une ligne `TPF_Ville/Quartier` au montant du bien — **ventilé par agence** | bien.tf > 0 |
| + IGS Cn | vert | **Cas spécial** : ajoute IGS + TDL + Pénalités IGS (cf. ci-dessous) | client.igs > 0 |
| + TDL | teal | Ajoute ligne TDL | tdl > 0 |
| + Solde IR / + Solde IS | indigo | Ajoute selon type client | soldeIR > 0 |
| + Patente | ambre | Ajoute `Patente (Régime Réel)` | client.patente > 0 |
| + Inscription CGA | sky | Ajoute ligne 75 000 F | (toujours) |
| + Cotisation CGA | sky | Ajoute ligne 50 000 F | (toujours) |

#### Cas spécial IGS (cascade)

Lorsque l'on clique sur **+ IGS** :
1. Ajouter ligne `Impôt Général Synthétique (IGS) - Classe N` (avec suffixe ` (CGA)` si client.isCGA)
2. **Automatiquement** ajouter ligne TDL si `tdl > 0` et pas déjà présente
3. **Automatiquement** ajouter ligne(s) "Pénalités IGS - T1 (X mois)" pour chaque échéance dépassée :
   - Calcul : `Math.round(montantTrimestre × 0.10 × moisRetard)` où `moisRetard` ≥ 1
   - Ne jamais ajouter de ligne avec montant ≤ 0
   - Ne pas dupliquer si déjà présente

### 5.8 Boutons rapides "Prestations selon le régime fiscal"

Dès qu'un client est sélectionné, afficher :
- En **violet** : prestations spécifiques au régime du client (`PRESTATIONS_REGIME[client.regimeFiscal]`)
- En **indigo** : prestations communes (DARP, DBEF, ACF, ATTIM)

```typescript
const PRESTATIONS_COMMUNES = [
  { designation: 'Déclaration Annuelle des Revenus des Particuliers (DARP)', montant: 5000, type: 'Honoraire' },
  { designation: 'Déclaration des Bénéficiaires Effectifs (DBEF)', montant: 5000, type: 'Honoraire' },
  { designation: 'Obtention ACF (Attestation de Conformité Fiscale)', montant: 2100, type: 'Honoraire' },
  { designation: 'Obtention ATTIM (Attestation Immatriculation)', montant: 2100, type: 'Honoraire' },
];

const PRESTATIONS_REGIME = {
  Reel: [
    { designation: 'Renouvellement du dossier fiscal', montant: 15000, type: 'Honoraire' },
    { designation: 'Montage et mise en ligne DSF', montant: 100000, type: 'Honoraire' },
    { designation: 'Forfait suivi gestion fiscal', montant: 120000, type: 'Honoraire' },
  ],
  IGS: [
    { designation: 'Renouvellement du dossier fiscal', montant: 10000, type: 'Honoraire' },
    { designation: 'Montage et mise en ligne DSF', montant: 30000, type: 'Honoraire' },
    { designation: 'Forfait suivi gestion fiscal', montant: 60000, type: 'Honoraire' },
  ],
  NonPro: [],
  OBNL: [],
};
```

### 5.9 Lignes de prestation (formulaire)

Chaque ligne occupe une grille **12 colonnes** :

| col-span | Champ | Comportement |
|---|---|---|
| 2 | Type (`Honoraire` / `Impôt`) | Change la liste désignations |
| 4 | Désignation | `<select>` (liste prédéfinie) + option "Autre (saisie libre)" qui révèle un `<input>` |
| 1 | Quantité | min 1, défaut 1 |
| 2 | Prix unitaire | auto-rempli depuis liste, modifiable |
| 2 | Total | readonly = qty × price |
| 1 | Bouton ✕ | Supprime la ligne |

**Cas IGS dans la liste** : si on sélectionne une désignation contenant "IGS" / "Impôt général synthétique", utiliser `client.igs` (pas le montant 0 de la liste générique) ; déclencher automatiquement l'ajout de TDL + Pénalités.

### 5.10 Import depuis un devis

Au sommet du formulaire, sélecteur "Importer depuis un devis (optionnel)" listant les devis non convertis (`status !== 'converti'`).

À la sélection :
- Pré-remplit le client
- Génère un nouveau N° de facture
- Vide les lignes existantes
- Réinjecte toutes les `prestations` du devis (avec `qty` correct)
- Mémorise `importedDevisId` et `importedDevisNumber`
- Après émission, le devis passe à `status: 'converti'`, conserve `statusBeforeConversion`, et reçoit `convertedToFacture = facture.number` + `convertedToFactureId = facture.id`.
- Si la facture issue du devis est supprimée et qu'aucune autre facture ne reste liée à ce devis, restaurer le devis à `statusBeforeConversion` ou, à défaut, à `accepté`, puis supprimer `statusBeforeConversion`, `convertedToFacture`, `convertedToFactureId`.

### 5.11 Liste des factures (onglet)

Filtres : Recherche texte (n°/client), Client, Statut, Période (today/week/month/year).

Tableau colonnes :
| N° Facture | Date | Client | Impôts | Honoraires | Total | Statut | Actions |

KPI cards en bas : Total Impôts, Total Honoraires, Total Général, Factures Payées (4 cartes colorées).

### 5.12 Rendu imprimable de la facture

```
┌──────────────────────────────────────────────────────────────┐
│ PRISMA GESTION                              FACTURE          │
│ Comptabilité - Finance - Fiscalité          Date : 28/01/2026│
│ Siège Social : Yaoundé - Bata Longkak                         │
│ Tél : (237) 656 752 475 / 671 050 546                         │
│ N.I.U : M052116042979Z                                        │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────────────────┐  ┌──────────────────────────────┐│
│ │ Numéro de facture      │  │ Facturé à :                  ││
│ │ N° 0001/2026/01        │  │ NOM CLIENT                   ││
│ │ (gradient bleu→indigo) │  │ NIU : M0xxx                  ││
│ │                        │  │ Yaoundé - Bata                ││
│ │                        │  │ Contact : M. xxx             ││
│ └────────────────────────┘  └──────────────────────────────┘│
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ N° │ Désignation         │ Qté │ P.U.    │ Montant         ││
│ │  1 │ [Impôt] IGS C5      │  1  │ 60 000  │      60 000     ││
│ │  2 │ [Honor.] Forfait... │  1  │ 60 000  │      60 000     ││
│ ├────────────────────────────────────────────────────────────┤│
│ │                          TOTAL À PAYER     120 000 F CFA   ││ (bleu)
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ ┌──────────────────┐  ┌─────────────────────┐                │
│ │ Total Impôts     │  │ Total Honoraires    │                │
│ │ 60 000 F CFA     │  │ 60 000 F CFA        │                │
│ └──────────────────┘  └─────────────────────┘                │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ Informations de paiement                                   ││
│ │ Mode : Mobile Money / Espèces                              ││
│ │ Numéros : 656 75 24 75 / 694 31 05 54 — OBIANG TIME Nathan ││
│ │ Échéance : 30 jours à compter de la date d'émission        ││
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│                              [Cachet] [Signature]              │
│                              ──────────────                    │
│                              OBIANG TIME Nathan                │
│                              Directeur Associé                 │
│                                                                │
│        PRISMA Manager — PRISMA GESTION : L'expertise...        │
└──────────────────────────────────────────────────────────────┘
```

**Règles de style** :
- Bleu primaire `#1e3a8a` (blue-900)
- Type `Impôt` → badge `bg-blue-100 text-blue-800`
- Type `Honoraire` → badge `bg-green-100 text-green-800`
- Carte numéro de facture : `linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)` blanche
- Bandeau Total Impôts : `bg-blue-50` border-left bleu
- Bandeau Total Honoraires : `bg-green-50` border-left vert
- Cachet et signature chargés depuis `cabinetConfig`, affichés uniquement si présents (`display: none` par défaut, puis `display: block`)
- Pied : `<span style="font-weight:600; color:#1e3a8a;">PRISMA Manager</span> — PRISMA GESTION : L'expertise qui sécurise votre gestion.`

### 5.13 PDF & Impression

- **Imprimer** : fonction dédiée `printFacture()` avec remplacement temporaire de `document.body.innerHTML`, style temporaire `#fct-print-style`, puis `window.print()`, restauration du body et `init()`.
- Marges print exactes : `@page { size: A4; margin: 20mm 12mm 15mm 12mm; }` et `@page :first { margin: 12mm 12mm 15mm 12mm; }`.
- Le bloc `Informations de paiement + Signature + Footer` est indivisible. Si sa hauteur dépasse l'espace restant sur la page, ajouter la classe `fct-force-page-break-before`.
- **PDF** : `html2canvas(printArea, { scale: 2, useCORS: true, logging: false })` → split manuel en pages A4.
- Marges PDF exactes : largeur 210 mm, hauteur 297 mm, marge horizontale 10 mm, marge haute page 1 = 10 mm, marge haute pages suivantes = 20 mm, marge basse = 10 mm.
- Avant rendu PDF, `preparePdfAvoidSplitSpacing()` ajoute temporairement un `marginTop` au groupe `.invoice-payment-signature-group` si le groupe serait coupé entre deux pages.
- Nom de fichier : `Facture_{number_sanitized}_{client_sanitized}.pdf`
- Sanitize : retirer `N° `, `/`, `\`, caractères spéciaux ; conserver lettres, chiffres, accents, espaces, tirets

---

## 6. Module Devis / Proforma

### 6.1 Modèle de données

```typescript
interface Devis {
  id: number;                                  // Date.now()
  number: string;                              // Format: "DEVIS-0001/2026/01"
  client: string;
  clientData: Client;                          // SNAPSHOT
  prestations: Prestation[];                   // Identique aux factures
  total: number;
  totalImpots: number;
  totalHonoraires: number;
  date: string;                                // ISO 8601
  isManual: boolean;
  status: 'brouillon' | 'envoyé' | 'accepté' | 'refusé' | 'converti';
  convertedToFacture?: string;                 // numéro facture si converti
  convertedToFactureId?: number;               // id facture si converti
  statusBeforeConversion?: 'brouillon' | 'envoyé' | 'accepté' | 'refusé';
  dateModification?: string;
}
```

### 6.2 Différences avec les factures

| Aspect | Facture | Devis |
|---|---|---|
| Préfixe N° | `N° ` | `DEVIS-` |
| Statuts | émise/payée/partielle/annulée | brouillon/envoyé/accepté/refusé/converti |
| Validité | 30 jours (paiement) | **30 jours** (devis) |
| Champ supplémentaire rendu | (aucun) | "Bon pour accord" + date/signature client |
| Mention | "Informations de paiement" | "Conditions du devis" |

### 6.3 Liste des devis

Tableau : Date, Numéro, Client, Total, **Statut (sélecteur inline)**, Actions.

- Si `status = converti` → afficher badge violet + indication "→ FACT-N°" en dessous (pas de sélecteur).
- Sinon → `<select>` avec couleurs : brouillon (gris), envoyé (bleu), accepté (vert), refusé (rouge).
- Actions : Voir / Modifier / **Convertir** (si non converti) / Supprimer.

### 6.4 Conversion devis → facture

Quand on clique "Convertir" :
1. Ouvrir une confirmation `PrismaModal.confirm('Convertir ce devis en facture ?', ...)`.
2. Créer immédiatement une facture dans `localStorage.factures` sans redirection :
   - `number = N° {factures.length + 1}/{YYYY}/{MM}`
   - `client`, `clientData`, `prestations`, `total`, `totalImpots`, `totalHonoraires` copiés depuis le devis
   - `date = new Date().toISOString()`
   - `status = 'émise'`
   - `fromDevis = true`, `fromDevisId = devis.id`, `fromDevisNumber = devis.number`
3. Mettre à jour le devis :
   - `statusBeforeConversion = ancien status || 'accepté'`
   - `status = 'converti'`
   - `convertedToFacture = facture.number`
   - `convertedToFactureId = facture.id`
4. Recharger la liste et afficher le toast : `Devis converti en facture avec succès ! Numéro : ...`

Il existe aussi un second flux depuis `facture-app.html` : importer un devis non converti dans le formulaire facture puis générer la facture. Ce flux doit produire les mêmes champs de liaison et la même restauration possible.

### 6.5 Rendu imprimable du devis

Identique à la facture mais avec :
- En-tête : `DEVIS / PROFORMA` (à droite)
- Badge statut coloré sous la date
- Bandeau jaune en bas avec :
  ```
  Conditions du devis
  Validité : Ce devis est valable 30 jours à compter de sa date d'émission
  Moyen de paiement : 656 75 24 75 / 694 31 05 54 — OBIANG TIME Nathan
  Ce devis ne constitue pas une facture et n'engage le client qu'après acceptation formelle.
  ```
- Zone "Bon pour accord" en bas à gauche (avec carré pointillé pour signature client)

### 6.6 Écarts locaux à reproduire

Les mécanismes généraux (mode auto/manuel, client obligatoire, lignes 12 colonnes, boutons rapides impôts, IGS + TDL + pénalités, statut `converti`) restent alignés avec les factures, mais le code local actuel contient ces différences à reproduire fidèlement :

- `devis.html` place `Obtention ACF` et `Obtention ATTIM` dans `LISTE_IMPOTS` avec montant 2 100, alors que `facture-app.html` les expose dans `HONORAIRES_COMMUNS`.
- Les honoraires communs du devis sont : DARP, DBEF, Conseil fiscal, Création d'entreprise, Modification statutaire. Les boutons rapides communs du devis n'affichent donc pas ACF/ATTIM.
- Le bouton d'impression du devis appelle directement `window.print()` sur le rendu `.print-area`; le portage Lovable doit rester sans nouvelle fenêtre/onglet et peut utiliser le hook d'impression commun, à condition que le rendu visuel reste identique.
- Le PDF du devis est rendu en une image pleine largeur A4 (`imgWidth = 210`, coordonnées 0,0), sans découpage multi-page local.

---

## 7. Module Proposition de paiement

### 7.1 Modèle de données

```typescript
interface Proposition {
  id: number;                          // Date.now()
  client: string;
  clientData: Client;                  // SNAPSHOT
  lignes: LigneProposition[];
  totalImpots: number;
  totalHonoraires: number;
  total: number;
  note: string;                        // Note libre
  date: string;                        // ISO 8601
  isManual: boolean;
  // Source (devis ou facture importé)
  sourceType: 'devis' | 'facture' | null;
  sourceId: number | null;
  sourceNumber: string | null;
  dateModification?: string;
}

interface LigneProposition {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  base: number;                        // Base annuelle
  fraction: number;                    // % à payer (0-100)
  amount: number;                      // Math.round(base × fraction / 100)
}
```

> **Note** : pas de numéro auto pour les propositions (clé : `id` timestamp).

### 7.2 Workflow

1. Sélection client → charge automatiquement la liste des devis (non convertis) et factures du client dans le sélecteur "Importer depuis un devis ou une facture".
2. À l'import : crée une ligne par prestation avec `base = total ligne`, `fraction = 100`, `amount = base`.
3. L'utilisateur peut **ajuster** chaque ligne :
   - Modifier `base` → recalcule `amount`
   - Modifier `fraction` → recalcule `amount = round(base × fraction / 100)`
   - Ajouter/supprimer des lignes manuellement
4. Saisir une note (optionnelle).
5. Enregistrer.

### 7.3 Rendu imprimable

```
PRISMA GESTION                              Yaoundé, le 28 janvier 2026
Comptabilité - Finance - Fiscalité
…coordonnées…

══════════════════════════════════════════════════════════════
              PROPOSITION DE PAIEMENT
══════════════════════════════════════════════════════════════

                                  À l'attention de Monsieur :
                                  NOM CLIENT
                                  NIU : M0xxx

┌────────────────────┬───────────────┬─────────────────┬────────────────┐
│ Désignation        │ Base annuelle │ Fraction à payer│ Montant à Verser│
├────────────────────┼───────────────┼─────────────────┼────────────────┤
│ IMPÔTS                                                                │ (bandeau bleu clair)
│ IGS                │ 300 000       │ 25 %            │ 75 000         │
│ TDL                │ 75 000        │ 25 %            │ 18 750         │
│ HONORAIRES                                                            │
│ Forfait gestion    │ 60 000        │ 25 %            │ 15 000         │
├────────────────────┴───────────────┴─────────────────┴────────────────┤
│ TOTAL À PAYER                                       108 750 F CFA    │
└──────────────────────────────────────────────────────────────────────┘

* Note : XYZ (si fournie)

                              [Cachet] [Signature]
                              ──────────────────
                              OBIANG TIME Nathan
                              Directeur Associé

  PRISMA Manager — PRISMA GESTION : L'expertise…
```

**Règles de style** :
- Civilité longue : `Monsieur` ou `Madame` (selon `client.civilite`)
- Bandeau "IMPÔTS" et "HONORAIRES" : `bg-blue-100 text-blue-900` (classe `bg-section`)
- Couleur header tableau : `#1e3a8a` blanc
- Total : ligne `bg-gray-100` avec montant gros et bleu

### 7.4 Liste des propositions

Tableau : Date, Client, Impôts, Honoraires, Total, Actions (Voir / Modifier / Supprimer).
Tri : ordre inverse (`reverse()` → plus récentes en premier).

---

## 8. Module Reçu de paiement

### 8.1 Modèle de données

```typescript
interface Recu {
  id: number;                          // Date.now()
  number: string;                      // Format: "RECU-0001/2026"
  client: string;
  clientData?: Client;                 // Recommandé Lovable ; absent des reçus legacy locaux
  montant: number;                     // = montantImpots + montantHonoraires
  montantImpots: number;
  montantHonoraires: number;
  paymentMode: 'Espèces' | 'Virement bancaire' | 'Mobile Money' | 'Chèque';
  motif: string;                       // Texte libre
  lignesPayees: LignePayee[];          // Détail des prestations effectivement payées
  date: string;
  isManual: boolean;
  // Lien à un document source
  sourceType: 'facture' | 'devis' | 'proposition' | null;
  sourceId: number | null;
  sourceNumber: string | null;
  // Mémorisation des factures payées (pour calcul de solde)
  factureIds: number[];
  factureNumbers: string[];
  dateModification?: string;
}

interface LignePayee {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  montant: number;
}
```

### 8.2 Numérotation automatique

```typescript
const num = String(recus.length + 1).padStart(4, '0');
const number = `RECU-${num}/${new Date().getFullYear()}`;
```

### 8.3 Workflow d'émission

1. Sélection client → charge dans le `<select>` documents :
   - **Factures** (toujours, marquées "Soldée" si `total - paiements ≤ 0`, désactivées si soldées ; sinon affichage "(Reste: X F CFA)")
   - **Devis** au statut `accepté` ou `envoyé`
   - **Propositions de paiement** du client

2. À l'import du document, afficher le bandeau **"Solde"** :
   ```
   Total document : 120 000 F CFA
   Déjà payé    : 30 000 F CFA
   Solde restant : 90 000 F CFA
   ```

3. Afficher chaque prestation comme une ligne **avec checkbox** (cochée par défaut). Boutons "Tout cocher" / "Tout décocher".
4. L'utilisateur peut décocher des lignes (montant → 0) ou ajuster les montants individuels.
5. Recalcul automatique de la **ventilation** :
   - `montantImpots` = somme des lignes cochées de type `Impôt`
   - `montantHonoraires` = somme des lignes cochées de type `Honoraire`
   - `montant` = `montantImpots + montantHonoraires` (readonly)
6. Choix mode de paiement (4 options).
7. Motif (textarea) — pré-rempli automatiquement à l'import : `Règlement {type} {numéro}`.
8. Enregistrer.

### 8.4 Rendu imprimable du reçu

```
┌──────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (bandeau dégradé bleu→indigo plein)   ▓▓▓│
│             REÇU DE PAIEMENT                                 │
│             N° RECU-0001/2026                                │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│                                                                │
│                              Yaoundé, le 28 janvier 2026      │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Reçu de :                                                │ │ (bg-blue-50, border-left bleu)
│ │ NOM CLIENT                                               │ │
│ │ NIU : M0xxx                                              │ │
│ │ Yaoundé - Bata Longkak                                   │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                                │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │            La somme de :                                 │ │ (bg-green-50, bordure verte 2px)
│ │            120 000 F CFA                                 │ │
│ │            (cent vingt mille francs CFA)                 │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                                │
│ ┌──────────────────┐  ┌─────────────────────┐                │
│ │ Impôts           │  │ Honoraires          │                │
│ │ 60 000 F CFA     │  │ 60 000 F CFA        │                │
│ └──────────────────┘  └─────────────────────┘                │
│                                                                │
│ Mode de paiement :        Mobile Money                       │
│ ────────────────────────────────────────                       │
│ Motif du paiement :                                           │
│ Règlement facture N° 0001/2026/01                             │
│                                                                │
│ ────────────────────────────────────────                       │
│ PRISMA GESTION                  [Cachet][Signature]          │
│ Comptabilité…                   ────────                     │
│ Yaoundé - Bata Longkak          OBIANG TIME Nathan            │
│ Tél : (237)…                    Directeur Associé             │
│ N.I.U : M0xxx                                                  │
│                                                                │
│ Ce reçu est valable sans signature ni cachet en vertu         │
│ de l'article 1316-4 du Code Civil                             │
│                                                                │
│  PRISMA Manager — PRISMA GESTION : L'expertise…                │
└──────────────────────────────────────────────────────────────┘
```

**Particularités** :
- Bordure externe : `3px double #1e3a8a`
- En-tête bleu plein dégradé occupant la pleine largeur (`margin: -2rem -2rem 2rem -2rem`)
- **Conversion montant en lettres** (français) : implémenter `numberToWords(num)` exactement comme `recu-app.html` ligne 499. Attention : la version locale actuelle couvre textuellement `0` à `999 999`, puis retourne `num.toString()` à partir de `1 000 000`. Pour une fidélité stricte, reproduire ce comportement ; pour une amélioration métier, documenter explicitement l'écart.
- Rendu client local : `displayRecuFromData()` recherche le client courant par `recu.client` dans `localStorage.clients` et n'utilise pas de snapshot. En Lovable, stocker `clientData` pour les nouveaux reçus, mais conserver un fallback par nom pour relire les anciens reçus et pour rester compatible avec le local.

### 8.5 Calcul de solde de facture

```typescript
function getSoldeFacture(facture: Facture): number {
  const recus = JSON.parse(localStorage.getItem('recus') || '[]');
  const paiements = recus
    .filter(r => r.factureIds?.includes(facture.id))
    .reduce((sum, r) => sum + (r.montant || 0), 0);
  return facture.total - paiements;
}
```

Si solde ≤ 0 → facture soldée.

---

## 9. Module Courrier

### 9.1 Modèle de données

```typescript
interface Courrier {
  id: number;                          // Date.now()
  ref: string;                         // Format: "CRR-0001/2026/01"
  type: 'fiscal' | 'client' | 'relance' | 'administratif' | 'autre';
  client: string;                      // Vide si "courrier général"
  clientData: Client | null;
  destinataire: string;                // Nom / organisme (obligatoire)
  destinataireAdresse: string;
  modeleKey: string;                   // Clé du modèle prédéfini (ou '')
  // Cas spécial pour modèle "votre_demande_devis" :
  demandeDevisFraisMode: '15000' | '10000' | 'manual' | '';
  demandeDevisFraisCustom: string;
  // Contenu :
  objet: string;                       // (obligatoire)
  corps: string;                       // (obligatoire)
  pj: string;                          // Pièces jointes (texte multi-ligne)
  // Suivi :
  statut: 'brouillon' | 'envoye' | 'accuse' | 'classe';
  modeEnvoi: '' | 'depot' | 'recommande' | 'email' | 'coursier';
  dateEnvoi: string;                   // YYYY-MM-DD ou ''
  notesSuivi: string;
  // Méta :
  date: string;                        // ISO 8601
  isManual: boolean;
  dateModification?: string;
}
```

### 9.2 Numérotation automatique

```typescript
const num = String(courriers.length + 1).padStart(4, '0');
const month = String(new Date().getMonth() + 1).padStart(2, '0');
const ref = `CRR-${num}/${new Date().getFullYear()}/${month}`;
```

### 9.3 Types de courrier (5 catégories)

| Valeur | Label affiché | Couleur badge |
|---|---|---|
| `fiscal` | Courrier fiscal (DGI) | bleu |
| `client` | Courrier client | vert |
| `relance` | Relance de paiement | rouge |
| `administratif` | Administratif | violet |
| `autre` | Autre | gris |

### 9.4 Modèles prédéfinis

#### 9.4.1 Courriers fiscaux (DGI)

| Clé | Objet |
|---|---|
| `demande_acf` | Demande d'Attestation de Conformité Fiscale (ACF) |
| `demande_attim` | Demande d'Attestation de non redevance (ATTIM) |
| `reclamation_fiscale` | Réclamation fiscale |
| `demande_degrevement` | Demande de dégrèvement fiscal |
| `demande_moratoire` | Demande de moratoire de paiement |
| `demande_sursis` | Demande de sursis de paiement |

Tous adressés à `Monsieur le Chef de Centre Régional des Impôts`.

#### 9.4.2 Courriers clients

| Clé | Objet | Type | Dynamique ? |
|---|---|---|---|
| `lettre_mission` | Lettre de mission - Prestations comptables et fiscales | client | non |
| `relance_paiement` | Relance - Factures impayées | relance | non |
| `mise_en_demeure` | Mise en demeure de paiement | relance | non |
| `transmission_documents` | Transmission de documents | client | non |
| `information_client` | Information / Notification client | client | non |
| `lettre_accompagnement_proposition_avance` | Transmission de votre proposition d'avance client | client | **oui** |
| `votre_demande_devis` | Modalités de délivrance des devis pour renouvellement de dossier fiscal | client | **oui** |
| `lettre_transmission_devis_professionnel` | Transmission de votre devis | client | **oui** |
| `transmission_devis` | Transmission de votre devis fiscal annuel | client | **oui** |
| `rappel_delais` | Rappel des différents délais fiscaux | client | **oui** |
| `annonce_nouvelles_taxes` | Annonce de nouvelles taxes et changements fiscaux | client | **oui** |

#### 9.4.3 Courriers administratifs

| Clé | Objet |
|---|---|
| `demande_niu` | Demande d'immatriculation fiscale (NIU) |
| `changement_regime` | Demande de changement de régime fiscal |
| `cessation_activite` | Déclaration de cessation d'activité |

### 9.5 Placeholders dans les modèles

Le corps des modèles peut contenir des **placeholders** remplacés à l'application :

| Placeholder | Remplacé par | Fallback si vide |
|---|---|---|
| `{CLIENT_NOM}` | `client.name` | (vide) |
| `{CLIENT_NIU}` | `client.niu` | `[NIU non renseigné]` |
| `{CLIENT_VILLE}` | `client.ville` | `[Ville non renseignée]` |
| `{CLIENT_QUARTIER}` | `client.quartier` | (vide) |
| `{CLIENT_CONTACT}` | `client.contact` | (vide) |
| `{CIVILITE}` | `Madame` ou `Monsieur` (selon `client.civilite`) | `Monsieur` |

Les placeholders sont remplacés dans : `objet`, `corps`, `pj`, `destinataire`, `destinataireAdresse`.

### 9.6 Modèles dynamiques

Pour les modèles marqués `dynamic`, le corps est généré à partir des données du client (montants IGS/Patente, échéances, etc.). Voir `getDynamicModelePayload()` dans `courrier-app.html` ligne 643.

#### Cas spécial `votre_demande_devis`

Champ supplémentaire visible : "Frais de renouvellement" avec 3 options :
- 15 000 F CFA (défaut)
- 10 000 F CFA
- Saisie manuelle (révèle un input numérique)

Le montant choisi est injecté automatiquement dans le corps du courrier.

### 9.7 Application d'un modèle

Au choix d'un modèle dans le `<select>` :
1. Récupérer le modèle (objet `MODELES[key]`)
2. Si `modele.dynamic` → appeler `getDynamicModelePayload(key, client)` pour générer le contenu
3. Remplir : `type`, `objet`, `corps`, `pj`, `destinataire`, `destinataireAdresse`
4. Si client sélectionné et type ∈ {client, relance} :
   - Remplir destinataire = `client.name` (si vide)
   - Remplir destinataireAdresse = `client.ville` (si vide)
5. Remplacer les placeholders avec les données du client
6. Toast info : "Modèle appliqué. Personnalisez le contenu selon vos besoins."

### 9.8 Suivi d'envoi (formulaire)

Section dédiée avec :
- **Statut** : brouillon (jaune) / envoyé (bleu) / accusé R. (vert) / classé (gris)
- **Mode d'envoi** : -- / Dépôt physique / Recommandé / Email / Coursier
- **Date d'envoi** (input date)
- **Notes de suivi** (input texte libre)

### 9.9 Liste des courriers

#### Statistiques (4 cartes)

| Carte | Valeur |
|---|---|
| Total | `courriers.length` |
| Brouillons | `count(statut='brouillon')` |
| Envoyés | `count(statut ∈ {'envoye', 'accuse'})` |
| Classés | `count(statut='classe')` |

#### Filtres

- Recherche texte (sur objet, destinataire, ref, client)
- Type (5 valeurs)
- Statut (4 valeurs)
- Client

#### Tableau

| Date | Référence | Type | Destinataire | Objet | Statut | Actions |
|---|---|---|---|---|---|---|

- Type : badge coloré
- Statut : badge coloré
- Objet tronqué à 40 caractères
- Actions : Voir / Modifier / Supprimer

### 9.10 Rendu imprimable du courrier

```
┌──────────────────────────────────────────────────────────────┐
│ PRISMA GESTION                          Réf : CRR-0001/2026/01│
│ Comptabilité - Finance - Fiscalité      Yaoundé, le 28/01/2026│
│ Siège Social : Yaoundé - Bata                  [BROUILLON]    │
│ Tél : (237) 656 752 475 / 671 050 546                         │
│ N.I.U : M052116042979Z                                        │
├──────────────────────────────────────────────────────────────┤
│                                       (aligné droite)         │
│                              À l'attention de Monsieur        │
│                              Chef de Centre Régional des Impôts│
│                              Yaoundé                           │
│                                                                │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ Objet : Demande d'Attestation de Conformité Fiscale (ACF)  ││ (bg-blue-50, border-left bleu)
│ └────────────────────────────────────────────────────────────┘│
│                                                                │
│ Monsieur le Chef de Centre,                                    │
│                                                                │
│ J'ai l'honneur de venir très respectueusement…                │
│ [paragraphes justifiés, line-height: 1.8]                     │
│                                                                │
│ ─────────────────────────────────────                          │
│ Pièces jointes :                                               │
│ • Copie de la carte de contribuable                            │
│ • Quittances de paiement                                       │
│ • Dernière DSF déposée                                         │
│                                                                │
│                              [Cachet] Pour PRISMA GESTION      │
│                                       [Signature]              │
│                                       ──────────────           │
│                                       OBIANG TIME Nathan       │
│                                       Directeur Associé        │
│                                                                │
│        PRISMA Manager — PRISMA GESTION : L'expertise…          │
└──────────────────────────────────────────────────────────────┘
```

**Règles de style** :
- Marges A4 : `1cm 2cm 0.7cm 2cm` (haut, droite, bas, gauche)
- Corps : `font-size: 13.5pt`, `line-height: 1.8`, `text-align: justify`
- Objet : encadré bleu clair `#f0f9ff`, border-left 4px `#1e3a8a`, font-size 14pt
- Paragraphes : séparés par double saut de ligne (`split(/\n\s*\n/)` puis `<p>` avec `<br>`)
- Pièces jointes : liste à puces, taille 0.8rem
- Badge statut visible en haut droite (couleurs codées)
- "À l'attention de Monsieur/Madame" : civilité automatique selon (1) `clientData.civilite`, (2) si destinataire commence par "Madame"/"Monsieur", (3) défaut vide

### 9.11 Impression directe (obligatoire)

Conformément à la convention transversale (cf. §10.4), **ne pas utiliser** `window.open()`. Utiliser le mécanisme de remplacement temporaire du body.

```typescript
function printCourrier() {
  // 1. Style temporaire
  const printStyle = document.createElement('style');
  printStyle.id = 'crr-print-style';
  printStyle.textContent = `
    @page { size: A4; margin: 1cm 2cm 0.7cm 2cm; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    body { font-family: 'Inter', Arial, sans-serif !important; margin: 0 !important; padding: 0 !important; }
    @media print { body { display: block !important; } }
  `;
  document.head.appendChild(printStyle);

  // 2. Remplacer + imprimer + restaurer
  const bodyContent = document.getElementById('printArea').innerHTML;
  const originalContent = document.body.innerHTML;
  document.body.innerHTML = bodyContent;
  window.print();
  document.body.innerHTML = originalContent;
  document.getElementById('crr-print-style').remove();
  init();
}
```

> **En React Lovable** : utiliser `react-to-print` ou un Portal qui monte un iframe caché à l'impression.

---

## 10. Conventions transversales

### 10.1 Mode Auto/Manuel (toggle universel)

Présent dans **tous les modules transactionnels** (factures, devis, propositions, reçus, courriers).

```tsx
<div className="mb-4 flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
  <span className="text-sm font-semibold text-gray-700">Mode de saisie :</span>
  <Toggle checked={isManual} onChange={toggleManualMode} />
  <span className={isManual ? 'text-orange-700' : 'text-blue-700'}>
    {isManual ? 'Manuel' : 'Automatique'}
  </span>
  <span className="text-xs text-gray-500 ml-2">
    {isManual ? 'Saisir le N° et la date du document original' : 'N° et date générés automatiquement'}
  </span>
</div>
```

**En mode Manuel** :
- Numéro éditable (placeholder selon module)
- Champ Date obligatoire (input `type="date"`)
- Date stockée : `new Date(val + 'T12:00:00').toISOString()` ⚠️ midi UTC pour éviter -1 jour
- Drapeau `isManual: true` stocké dans le document

### 10.2 Modèle Prestation universel

Le type `Prestation` est partagé entre Factures et Devis :

```typescript
interface Prestation {
  type: 'Impôt' | 'Honoraire';
  designation: string;
  qty: number;
  price: number;
  total: number;             // qty × price
}
```

### 10.3 Numérotation automatique

| Module | Format | Exemple |
|---|---|---|
| Facture | `N° NNNN/YYYY/MM` | `N° 0001/2026/01` |
| Devis | `DEVIS-NNNN/YYYY/MM` | `DEVIS-0001/2026/01` |
| Reçu | `RECU-NNNN/YYYY` | `RECU-0001/2026` |
| Courrier | `CRR-NNNN/YYYY/MM` | `CRR-0001/2026/01` |
| Proposition | (pas de numéro, ID timestamp uniquement) | — |

`NNNN` = nombre actuel + 1, padded à 4 chiffres.

### 10.4 Impression directe (obligatoire)

**Règle** : **ne jamais ouvrir une nouvelle fenêtre/onglet** pour imprimer. Mécanisme :

1. Créer un `<style>` temporaire avec préfixe unique (ex: `fact-`, `dev-`, `prop-`, `rec-`, `crr-`) → `document.head.appendChild`
2. Sauver `document.body.innerHTML` dans `originalContent`
3. Remplacer `document.body.innerHTML` par le contenu à imprimer (sans `<html>`, `<head>`, `<body>`)
4. `window.print()`
5. Restaurer `document.body.innerHTML = originalContent`
6. Supprimer le style temporaire
7. Réinitialiser les events (`init()`)

> **Lovable React** : encapsuler dans un hook `usePrint(ref)` qui utilise `react-to-print` avec `pageStyle` configurable par module.

### 10.5 Sanitization du nom de fichier PDF

```typescript
function sanitizePdfSegment(value: string, fallback = 'Document'): string {
  return String(value || '')
    .replace(/^N[°ºo]?\s*/i, '')       // retire "N° ", "No "
    .replace(/[\/\\]/g, '-')           // / et \ → -
    .replace(/[^a-zA-Z0-9À-ÿ\s\-]/g, '')  // accents OK
    .trim() || fallback;
}
```

Format final : `{Type}_{numéro_sanitized}_{client_sanitized}.pdf` — ex `Facture_0001-2026-01_NOM_CLIENT.pdf`.

### 10.6 Synchronisation entre onglets (PrismaSync)

Dans le projet local, `PrismaSync.watch('clients', cb)` permet de réagir aux changements localStorage. Sur Lovable, utiliser :
- **Supabase Realtime** sur les tables si backend
- Sinon, hook React `useEffect` + `storage` event listener

### 10.7 Système de toasts

Le projet utilise `PrismaToast` (success / warning / error / info). Sur Lovable, utiliser **shadcn/ui `<Toaster>` + `useToast()`** ou **sonner** :
- success → vert
- warning → jaune/ambre
- error → rouge
- info → bleu

Durée par défaut : 3 s ; longs messages : 5 s.

### 10.8 Modal de confirmation suppression

`PrismaModal.confirmDelete(message, callback)` → utiliser shadcn `<AlertDialog>` :

```tsx
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
      <AlertDialogDescription>{message}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Annuler</AlertDialogCancel>
      <AlertDialogAction onClick={callback} className="bg-red-600">Supprimer</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### 10.9 Auto-save de formulaire

`PrismaAutoSave.save('prisma_autosave_client_form', formData)` → sur Lovable, utiliser un hook `useAutoSave(key, data, debounce=1000)` qui sérialise dans localStorage à chaque changement. Effacer (`PrismaAutoSave.clear`) après soumission réussie.

### 10.10 Format monétaire

Toujours utiliser `Intl.NumberFormat('fr-FR')` ou `.toLocaleString('fr-FR')` pour les montants. Suffixe : ` F CFA` (avec espace fine insécable idéalement).

```typescript
formatMoney(120000)   // → "120 000 F CFA"
formatMoney(0)        // → "0 F CFA"
formatMoney(undefined)// → "0 F CFA"
```

### 10.11 Pied de page commun

Tous les rendus imprimables (facture, devis, proposition, reçu, courrier) se terminent par :

```html
<div style="margin-top: …; padding-top: …; border-top: 1px solid #e5e7eb; text-align: center;">
  <p style="font-size: 0.7rem; color: #6b7280; margin: 0;">
    <span style="font-weight: 600; color: #1e3a8a;">PRISMA Manager</span>
    — PRISMA GESTION : L'expertise qui sécurise votre gestion.
  </p>
</div>
```

### 10.12 Bloc signataire commun

Tous les rendus se terminent par un bloc signataire **chargé depuis `cabinetConfig`** :

```html
<div style="margin-top: 2rem; flex; justify-content: flex-end;">
  <div class="flex items-center gap-4">
    <img id="cachetImg" src="" style="max-height: 70px; display: none;">
    <div class="text-center">
      <p class="font-bold text-blue-900">Pour PRISMA GESTION</p>
      <img id="signatureImg" src="" style="max-height: 50px; display: none; margin: 0.5rem auto;">
      <div style="border-top: 2px solid #9ca3af; padding-top: 0.5rem; margin-top: 0.5rem;">
        <p class="font-bold" id="signataireNom">OBIANG TIME Nathan</p>
        <p class="text-sm text-gray-600" id="signataireTitre">Directeur Associé</p>
      </div>
    </div>
  </div>
</div>
```

L'image cachet (gauche) et signature (centre, au-dessus du nom) sont affichées **uniquement si présentes** dans `cabinetConfig`.

---

## 11. Checklist d'acceptation

Pour valider la fidélité du portage Lovable, vérifier que :

### 11.1 Données

- [ ] Un client créé dans le projet local a la **même structure JSON** dans Lovable
- [ ] Les calculs IGS / Patente / TDL / PSL / Bail / TPF / Solde IR donnent **la même valeur au franc près**
- [ ] La réduction CGA divise bien l'IGS par 2 (mais la TDL est calculée sur l'IGS principal)
- [ ] Le label "Solde IR" / "Solde IS" change selon le type de client (PP/PM)
- [ ] Le bail est à 5 % pour OBNL/NonPro (au lieu de 10 %), le PSL est à 0 pour ces régimes

### 11.2 UX

- [ ] Le toggle Auto/Manuel est présent et fonctionnel dans **les 5 modules** transactionnels
- [ ] La date manuelle est correctement convertie (pas de décalage J-1)
- [ ] Tous les boutons rapides "+ Impôt" appliquent le bon montant et le bon type
- [ ] L'ajout d'IGS déclenche automatiquement TDL et pénalités (si retard)
- [ ] L'import d'un devis dans une facture vide les lignes existantes et reproduit fidèlement
- [ ] La conversion devis → facture marque le devis comme `converti`

### 11.3 Rendus

- [ ] Le rendu imprimable de la **facture** est visuellement identique (même couleurs, même structure)
- [ ] Idem pour **devis**, **proposition**, **reçu**, **courrier**
- [ ] La signature et le cachet du cabinet apparaissent si configurés
- [ ] Le pied de page "PRISMA Manager — PRISMA GESTION : L'expertise…" est sur tous les documents
- [ ] La conversion en lettres du montant (reçu) fonctionne pour les valeurs courantes (≤ 999 999 999)
- [ ] Le PDF généré conserve les couleurs (option `useCORS: true` + `scale: 2`)

### 11.4 Courriers

- [ ] Les **20 modèles** de courriers sont disponibles avec leur objet et corps exacts
- [ ] Les placeholders `{CLIENT_NOM}`, `{CLIENT_NIU}`, `{CLIENT_VILLE}`, `{CIVILITE}` sont remplacés
- [ ] La civilité longue est `Madame` ou `Monsieur` (pas `Mme.` / `M.`)
- [ ] Le modèle `votre_demande_devis` propose le choix 15 000 / 10 000 / saisie manuelle
- [ ] Le suivi d'envoi (statut, mode, date, notes) est sauvegardé
- [ ] Les filtres et compteurs de la liste fonctionnent
- [ ] L'impression directe **ne crée pas une nouvelle fenêtre**

### 11.5 Cohérence inter-modules

- [ ] Une facture émise apparaît dans le module Reçu (sélecteur de document)
- [ ] Un reçu marque correctement la facture comme "Soldée" si solde ≤ 0
- [ ] Une proposition de paiement importe correctement les bases annuelles depuis facture/devis
- [ ] Le changement d'un client **ne modifie pas** factures, devis, propositions et courriers déjà émis (snapshot `clientData`) ; les reçus legacy restent compatibles par fallback nom, les nouveaux reçus Lovable stockent aussi `clientData`
- [ ] La numérotation incrémentale ne crée pas de doublons en cas d'usage simultané

---

## 12. Audit de fidélité au code local

Audit réalisé sur les sources locales au 9 mai 2026 :

- `clients.html`
- `facture-app.html`
- `devis.html`
- `avance-app.html`
- `recu-app.html`
- `courrier-app.html`
- `STANDARD_PRESENTATION_COURRIERS.md`

Cette section sert de garde-fou de portage : si une règle ci-dessous contredit une règle plus ancienne du document, appliquer cette section.

### 12.1 Règles de fidélité transversales

- Les noms de champs JSON doivent rester compatibles avec le localStorage existant : `clientData`, `totalImpots`, `totalHonoraires`, `dateModification`, `dateModified`, `fromDevisId`, `convertedToFactureId`, etc.
- Les rendus doivent être construits depuis les données sauvegardées du document, avec fallback sur les données courantes uniquement lorsque le local le fait déjà ou pour compatibilité d'anciens enregistrements.
- Les montants sont toujours arrondis avec `Math.round()` ou calculés comme dans le fichier source, puis formatés avec `.toLocaleString('fr-FR') + ' F CFA'`.
- Les dates manuelles sont converties avec `new Date(value + 'T12:00:00').toISOString()` pour éviter le décalage de jour.
- Aucun module ne doit ouvrir une nouvelle fenêtre pour imprimer. Lovable peut utiliser `react-to-print`, mais le résultat doit rester visuellement identique au HTML local.
- Les imports inter-modules ne doivent pas modifier silencieusement les montants : une ligne importée garde son `type`, sa `designation`, son `qty`, son `price`, son `total`.

### 12.2 Clients

Points à reproduire :

- Formulaire en sections : Informations générales, Localisation, Coordonnées, Informations métier, Situation immobilière, Situation fiscale.
- `contact` n'est pas requis par l'input HTML, mais il est requis par `verifierFicheClient()` pour émettre facture/devis.
- `quartier`, `phone`, `secteur`, `cdi` sont requis dans le formulaire, même s'ils ne bloquent pas tous l'émission documentaire.
- `civilite` est normalisée en `M.` ou `Mme`; le label change selon `type` (`Civilité du client` pour PP, `Civilité du contact principal` pour PM).
- Le dashboard fiscal affiche : cartes impôt, total fiscal, barre de répartition, calendrier IGS avec états `ok`, `grace`, `retard`, et pénalités 10% par mois.
- `soldeIR` est stocké sous ce nom même pour une personne morale ; seul le label rendu devient `Solde IS`.
- `tdl` est calculée sur l'IGS principal avant réduction CGA.
- `licence` vaut `2 × igs` en IGS et `2 × patente` en Réel, uniquement si `isVendeurBoissons`.
- Import CSV/XLSX/JSON : validation minimale `name` + `niu`, rejet des NIU déjà présents, preview vert/rouge, template `modele_import_clients.csv`.

### 12.3 Factures

Points à reproduire :

- Deux onglets : création et liste. La liste calcule les KPI sur les factures filtrées, pas sur toute la base.
- Le formulaire ne crée pas de ligne vide à l'ouverture ; l'utilisateur utilise les boutons rapides ou `+ Ajouter une ligne`.
- Les désignations ont un `<select>` et l'option `Autre (saisie libre)` (`__AUTRE__`). La sauvegarde doit lire le select si valide, sinon l'input libre.
- Le bouton `+ IGS` ajoute l'IGS puis ajoute automatiquement TDL et pénalités IGS non déjà présentes.
- Le statut facture peut être changé via une modale locale avec les valeurs `émise`, `partiellement_payée`, `payée`, `annulée`.
- Une facture importée depuis devis affiche un badge `Devis {fromDevisNumber}` dans la liste.
- Supprimer une facture issue d'un devis restaure le devis si aucune autre facture ne lui reste liée.
- L'impression facture utilise un HTML dédié `fct-*`, pas simplement le contenu preview Tailwind. Conserver les marges et le bloc signature indivisible.
- Le PDF facture doit gérer plusieurs pages et éviter de couper le groupe paiement/signature.

### 12.4 Devis / Proforma

Points à reproduire :

- La liste appelle `restoreConvertibleDevisWithoutFacture()` avant affichage : un devis `converti` sans facture liée redevient `statusBeforeConversion` ou `accepté`.
- Les statuts modifiables en liste sont seulement `brouillon`, `envoyé`, `accepté`, `refusé`. `converti` n'est pas sélectionnable manuellement depuis le `<select>`.
- Conversion directe : le bouton `Convertir` crée immédiatement une facture et marque le devis converti avec `convertedToFacture` et `convertedToFactureId`.
- Le rendu devis affiche `DEVIS / PROFORMA`, un badge statut, un bloc `Conditions du devis`, et une zone `Bon pour accord`.
- Différence locale importante : ACF/ATTIM sont dans la liste des impôts du devis, pas dans ses honoraires communs.
- Le PDF devis est une seule image A4 pleine largeur. Ne pas introduire une pagination différente sans validation visuelle.

### 12.5 Propositions de paiement

Points à reproduire :

- Pas de numéro documentaire : l'identifiant affichable est `id` ou le `sourceNumber` si la proposition vient d'un devis/facture.
- À la sélection client, charger les devis non convertis et toutes les factures du client.
- À l'import, chaque prestation devient une ligne proposition avec `base = total`, `fraction = 100`, `amount = total`.
- L'ajustement `base` ou `fraction` recalcule `amount = Math.round(base * fraction / 100)`.
- Le rendu sépare les lignes `Impôt` et `Honoraire` dans deux bandes `IMPÔTS` et `HONORAIRES`.
- Le PDF est sauvegardé sous `Proposition_{sourceNumber|id}_{client}.pdf`.
- Le bouton d'impression local appelle `window.print()` ; le portage Lovable doit produire le même rendu sans nouvel onglet.

### 12.6 Reçus de paiement

Points à reproduire :

- Le sélecteur document contient trois optgroups : Factures, Devis, Propositions de paiement.
- Les factures soldées sont visibles mais désactivées, avec suffixe `(Soldée)`.
- Les factures partiellement payées affichent `(Reste: X F CFA)`.
- Seuls les devis `accepté` ou `envoyé` apparaissent dans le reçu.
- Une proposition est convertie en lignes payées via `lignes` → pseudo-prestations `{ qty: 1, price: amount, total: amount }`.
- À l'import, toutes les lignes sont cochées par défaut ; décocher une ligne met son montant à 0, recocher restaure `montantOriginal`.
- Les montants `montantImpots`, `montantHonoraires`, `montant` se recalculent depuis les lignes cochées.
- Le reçu sauvegarde `factureIds` et `factureNumbers` uniquement si la source est une facture.
- Le rendu local du reçu recherche le client courant par nom. Lovable doit stocker `clientData` pour fiabiliser les nouveaux reçus mais garder ce fallback.
- `numberToWords()` local ne gère pas les millions en lettres ; ne pas annoncer un support complet si l'algorithme n'est pas étendu.

### 12.7 Courriers

Points à reproduire :

- Le standard visuel de `displayCourrier(courrier)` doit suivre `STANDARD_PRESENTATION_COURRIERS.md`.
- Les corps de modèles statiques doivent être copiés verbatim depuis `MODELES` dans `courrier-app.html`.
- Les modèles dynamiques utilisent les dernières données :
  - `lettre_transmission_devis_professionnel` et `transmission_devis` prennent le devis le plus récent du client.
  - `lettre_accompagnement_proposition_avance` prend la proposition la plus récente du client.
  - `votre_demande_devis` peut fonctionner sans client, mais injecte le montant choisi 15 000, 10 000 ou manuel.
  - `rappel_delais` et `annonce_nouvelles_taxes` exigent un client IGS ou Réel.
- Les placeholders sont remplacés dans `objet`, `corps`, `pj`, `destinataire`, `destinataireAdresse`.
- Le rendu destinataire affiche `À l'attention de Monsieur/Madame` selon `clientData.civilite`, ou selon le préfixe du destinataire, sinon `À l'attention de`.
- L'impression courrier utilise déjà le mécanisme obligatoire : style `#crr-print-style`, remplacement du body, `window.print()`, restauration, `init()`.
- Le PDF courrier utilise `html2canvas(... { scale: 2, useCORS: true, backgroundColor: '#ffffff' })` et sauvegarde `Courrier_{ref}_{client|destinataire}.pdf`.

---

## Annexe A : Mapping localStorage → Supabase (DDL minimal)

```sql
-- Clients
create table clients (
  id            bigint primary key,
  type          text not null check (type in ('Personne morale', 'Personne physique')),
  name          text not null,
  niu           text not null,
  cdi           text not null,
  ville         text not null,
  quartier      text not null,
  phone         text not null,
  email         text,
  contact       text,
  civilite      text check (civilite in ('M.', 'Mme')),
  secteur       text not null,
  cnps          text,
  externalise   text default 'Non',
  statut        text default 'Actif',
  -- Immo
  statut_immo   text,
  loyer_mensuel numeric default 0,
  loyer_annuel  numeric default 0,
  valeur_bien   numeric default 0,
  psl           numeric default 0,
  bail          numeric default 0,
  taux_bail     int default 10,
  tf            numeric default 0,
  -- Fiscal
  regime_fiscal       text,
  chiffre_affaires    numeric default 0,
  is_cga              bool default false,
  is_vendeur_boissons bool default false,
  mode_paiement_igs   text default 'annuel',
  mode_paiement_psl   text default 'annuel',
  igs                 numeric default 0,
  igs_classe          int,
  patente             numeric default 0,
  tdl                 numeric default 0,
  solde_ir            numeric default 0,
  licence             numeric default 0,
  created_at          timestamptz default now()
);

-- Factures
create table factures (
  id             bigint primary key,
  number         text not null unique,
  client         text not null,
  client_data    jsonb not null,           -- snapshot
  prestations    jsonb not null,
  total          numeric not null,
  total_impots   numeric not null,
  total_honoraires numeric not null,
  date           timestamptz not null,
  is_manual      bool default false,
  status         text default 'émise',
  from_devis     bool default false,
  from_devis_id  bigint,
  from_devis_number text,
  date_modified  timestamptz
);

-- Devis (idem schéma + colonnes statut & convertedToFacture)
create table devis (
  id             bigint primary key,
  number         text not null unique,
  client         text not null,
  client_data    jsonb not null,
  prestations    jsonb not null,
  total          numeric not null,
  total_impots   numeric not null,
  total_honoraires numeric not null,
  date           timestamptz not null,
  is_manual      bool default false,
  status         text default 'brouillon',
  converted_to_facture text,
  converted_to_facture_id bigint,
  status_before_conversion text,
  date_modification timestamptz
);

-- Reçus
create table recus (
  id                bigint primary key,
  number            text not null unique,
  client            text not null,
  client_data       jsonb,
  montant           numeric not null,
  montant_impots    numeric default 0,
  montant_honoraires numeric default 0,
  payment_mode      text not null,
  motif             text not null,
  lignes_payees     jsonb default '[]',
  date              timestamptz not null,
  is_manual         bool default false,
  source_type       text,
  source_id         bigint,
  source_number     text,
  facture_ids       bigint[],
  facture_numbers   text[],
  date_modification timestamptz
);

-- Propositions
create table propositions (
  id                bigint primary key,
  client            text not null,
  client_data       jsonb not null,
  lignes            jsonb not null,
  total_impots      numeric default 0,
  total_honoraires  numeric default 0,
  total             numeric not null,
  note              text,
  date              timestamptz not null,
  is_manual         bool default false,
  source_type       text,
  source_id         bigint,
  source_number     text,
  date_modification timestamptz
);

-- Courriers
create table courriers (
  id                bigint primary key,
  ref               text not null unique,
  type              text not null,
  client            text,
  client_data       jsonb,
  destinataire      text not null,
  destinataire_adresse text,
  modele_key        text,
  demande_devis_frais_mode text,
  demande_devis_frais_custom text,
  objet             text not null,
  corps             text not null,
  pj                text,
  statut            text default 'brouillon',
  mode_envoi        text,
  date_envoi        date,
  notes_suivi       text,
  date              timestamptz not null,
  is_manual         bool default false,
  date_modification timestamptz
);

-- Cabinet config (singleton)
create table cabinet_config (
  id              int primary key default 1,
  nom_cabinet     text default 'PRISMA GESTION',
  slogan          text default 'Comptabilité - Finance - Fiscalité',
  siege           text default 'Yaoundé - Bata Longkak',
  telephone       text default '(237) 656 752 475 / 671 050 546',
  niu             text default 'M052116042979Z',
  signataire_nom  text default 'OBIANG TIME Nathan',
  signataire_titre text default 'Directeur Associé',
  signature       text,                    -- data URL base64
  cachet          text,                    -- data URL base64
  signature_promo text default 'PRISMA Manager — PRISMA GESTION : L''expertise qui sécurise votre gestion.',
  check (id = 1)
);
```

---

## Annexe B : Style global du projet

```css
/* Police */
body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }

/* Couleur principale */
--prisma-primary: #1e3a8a;          /* blue-900 */
--prisma-primary-light: #3b82f6;    /* blue-500 */
--prisma-accent: #c9dcfb;           /* bleu pâle pour totaux */

/* Impression */
@media print {
  body { background: white; margin: 0; padding: 0;
         -webkit-print-color-adjust: exact !important;
         print-color-adjust: exact !important; }
  .no-print { display: none !important; }
  .print-area { box-shadow: none !important; padding: 0 !important; margin: 0 !important; }
  @page { size: A4; margin: 10mm 10mm; }     /* 1cm 2cm 0.7cm 2cm pour courriers */
  table { page-break-inside: auto; }
  tr { page-break-inside: avoid; page-break-after: auto; }
  thead { display: table-header-group; }
}
```

---

## Annexe C : Algorithme `numberToWords` (français) — pour reçus

Implémentation exacte à reprendre de `recu-app.html` ligne 499 :

```typescript
function numberToWords(num: number): string {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const tens  = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

  if (num === 0) return 'zéro';
  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10), unit = num % 10;
    if (ten === 7) return 'soixante-' + teens[unit];
    if (ten === 9) return 'quatre-vingt-' + teens[unit];
    return tens[ten] + (unit ? '-' + units[unit] : '');
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100), rest = num % 100;
    return (hundred > 1 ? units[hundred] + ' ' : '') + 'cent' + (rest ? ' ' + numberToWords(rest) : '');
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000), rest = num % 1000;
    return (thousand > 1 ? numberToWords(thousand) + ' ' : '') + 'mille' + (rest ? ' ' + numberToWords(rest) : '');
  }
  return num.toString();
}
```

> Le rendu reçu affiche : `(cent vingt mille francs CFA)` en italique sous le montant principal.

---

## Annexe D : Calcul des pénalités IGS (pour facturation)

```typescript
const PENALITE_IGS_TAUX = 0.10;

function getIGSPenaliteLines(client) {
  if (!client || client.regimeFiscal !== 'IGS' || !client.igs || client.igs <= 0) return [];

  const today = stripTime(new Date());
  const year = today.getFullYear();
  const mode = client.modePaiementIGS || 'annuel';
  let schedule;

  if (mode === 'trimestriel') {
    const fractions = splitAmount(Math.round(client.igs), 4);
    const dueDates = [
      new Date(year, 0, 15),   // 15 jan
      new Date(year, 2, 15),   // 15 mars
      new Date(year, 6, 15),   // 15 juil
      new Date(year, 9, 15),   // 15 oct
    ];
    schedule = dueDates.map((dueDate, i) => ({
      label: `T${i + 1}`,
      amount: fractions[i],
      penaltyStart: addDays(dueDate, 30),     // pénalité 30 j après
    }));
  } else {
    schedule = [{
      label: 'Annuel',
      amount: Math.round(client.igs),
      penaltyStart: new Date(year, 3, 1),     // 1er avril
    }];
  }

  return schedule
    .map(item => {
      const ps = stripTime(item.penaltyStart);
      if (today < ps) return null;
      const moisRetard = getMoisRetard(ps, today);   // ≥ 1
      const montant = Math.round(item.amount * PENALITE_IGS_TAUX * moisRetard);
      return montant > 0
        ? { designation: `Pénalités IGS - ${item.label} (${moisRetard} mois)`, montant }
        : null;
    })
    .filter(Boolean);
}

function splitAmount(total: number, count: number): number[] {
  const base = Math.floor(total / count);
  const rem = total - (base * count);
  return Array.from({ length: count }, (_, i) => base + (i < rem ? 1 : 0));
}

function getMoisRetard(start: Date, end: Date): number {
  const s = stripTime(start), e = stripTime(end);
  if (e < s) return 0;
  let mois = ((e.getFullYear() - s.getFullYear()) * 12) + (e.getMonth() - s.getMonth());
  if (e.getDate() >= s.getDate()) mois += 1;
  return Math.max(mois, 1);
}
```

Ces lignes de pénalité **doivent** être ajoutées automatiquement lors de l'ajout d'une ligne IGS dans une facture.

---

**Fin du document.** Toute divergence entre ce SPEC et le comportement local doit être considérée comme un bug à corriger dans le portage.
