# Rapport comparatif des fiches client

## Applications analysées

Ce rapport compare les fiches client de deux applications présentes dans le dépôt :

1. **PRISMA GESTION vanilla**, principalement implémentée dans `facturation/clients.html` ;
2. **Application Prisma React/TypeScript**, dont le formulaire, la vue détaillée, le modèle de données et le générateur PDF sont répartis dans `src/`.

Le terme **fiche client** couvre ici les données saisissables, la consultation détaillée, les règles fiscales et immobilières, ainsi que la fiche PDF imprimable.

---

## Synthèse générale

Les deux applications partagent un socle métier proche : identité, coordonnées, régime fiscal, centre fiscal, gestion externalisée, multi-agences et calculs fiscaux.

Toutefois, leurs fiches client répondent à des objectifs différents :

- **La fiche vanilla est principalement orientée fiscalité, contrôle de complétude et production d’un document interne complet.**
- **La fiche Prisma est davantage orientée identité juridique et suivi CRM**, avec des informations plus riches sur les personnes physiques, les sociétés, le capital social, les actionnaires et les interactions.
- **La fiche PDF vanilla restitue mieux les informations fiscales, immobilières et multi-agences.**
- **La fiche PDF Prisma ne reflète pas encore toute la richesse disponible dans le formulaire et la vue détaillée Prisma.**

---

## Tableau comparatif principal

| Fonctionnalité | Application vanilla | Application Prisma | Différence principale |
|---|---|---|---|
| Personnes physiques et morales | Champ commun « Nom / Raison sociale » | Champs spécialisés selon le type | Prisma est plus détaillée |
| Identité juridique | Informations limitées | Forme juridique, RCCM, dirigeant, sigle, dates et lieu de création | Prisma est nettement plus riche |
| Capital social et actionnaires | Non présent | Présent pour les personnes morales | Fonctionnalité propre à Prisma |
| Coordonnées | Téléphone, e-mail, contact principal et civilité | Téléphone, e-mail et contact principal | Vanilla gère explicitement la civilité du contact |
| Adresse | Ville et quartier | Ville, quartier et lieu-dit | Prisma est plus détaillée |
| Centre fiscal | Sélection filtrée par ville et régime, avec saisie « Autre » | Centre de rattachement présent dans le modèle et le formulaire | Vanilla encadre davantage la sélection |
| Données fiscales | Résultats détaillés stockés sur la fiche | Résultats calculés dynamiquement | Vanilla matérialise davantage les résultats |
| Multi-agences | Complet dans le formulaire et le PDF | Complet dans le formulaire, absent de la vue détaillée et du PDF | Vanilla restitue mieux les agences |
| Historique des interactions | Non présent | Présent dans la fiche détaillée et le PDF | Fonctionnalité propre à Prisma |
| Contrôle de complétude | Contrôle explicite avant le téléchargement PDF | Validation du formulaire sans synthèse avant impression | Vanilla propose un meilleur contrôle documentaire |
| Aperçu PDF avant téléchargement | Oui | Non | Fonctionnalité propre à vanilla |
| Configuration du cabinet dans le PDF | Utilise la configuration du cabinet | En-tête PDF générique | Vanilla est plus adaptée à la production réelle |

---

## 1. Modèles de données

### 1.1. Identité du client

Le modèle Prisma distingue précisément les informations selon le type de client.

Pour une **personne physique**, Prisma peut stocker notamment :

- le nom ;
- le nom commercial ;
- le sexe ;
- l’état civil.

Pour une **personne morale**, Prisma peut stocker :

- la raison sociale ;
- le nom commercial ;
- le numéro RCCM ;
- le sigle ;
- la date et le lieu de création ;
- le nom du dirigeant ;
- la forme juridique.

La fiche vanilla utilise principalement un type de client et un champ commun « Nom / Raison sociale ». Elle ne distingue pas aussi finement les informations juridiques d’une personne morale des informations personnelles d’une personne physique.

**Conclusion :** Prisma est plus adaptée à la constitution d’un dossier juridique ou administratif complet.

### 1.2. Capital social et actionnaires

Prisma possède une section dédiée au capital social et aux actionnaires pour les personnes morales. Ces informations peuvent être saisies lors de la création et gérées depuis la fiche détaillée.

La fiche vanilla ne possède pas de fonctionnalité équivalente.

**Conclusion :** Prisma constitue un référentiel corporate plus complet.

### 1.3. Historique des interactions

Prisma associe au client une collection d’interactions datées. La vue détaillée et le PDF peuvent afficher cet historique.

La fiche vanilla ne comporte pas de fonctionnalité équivalente.

**Conclusion :** Prisma se rapproche davantage d’un outil CRM, tandis que vanilla se concentre sur la fiche fiscale de référence.

---

## 2. Formulaires de saisie

### 2.1. Formulaire vanilla

Le formulaire vanilla est organisé en sections successives :

- informations générales ;
- localisation ;
- coordonnées ;
- informations métier ;
- situation fiscale ;
- agences et établissements ;
- résultats des calculs fiscaux et immobiliers.

Il contient notamment le contact principal, sa civilité, le secteur d’activité, le numéro CNPS, la gestion externalisée et le statut du client.

Le formulaire est direct et regroupe toute la logique sur une même page, mais son implémentation est longue et fortement couplée.

### 2.2. Formulaire Prisma

Prisma répartit le formulaire entre plusieurs composants spécialisés :

- identité ;
- informations professionnelles et fiscales ;
- adresse ;
- contact ;
- agences ;
- capital social et actionnaires pour les personnes morales.

Cette organisation est plus modulaire et plus facile à maintenir, mais la logique fonctionnelle est répartie dans plusieurs fichiers.

---

## 3. Gestion fiscale

### 3.1. Application vanilla

Vanilla construit et conserve directement sur le client plusieurs résultats fiscaux :

- régime fiscal ;
- chiffre d’affaires cumulé ;
- adhésion au CGA ;
- statut vendeur de boissons ;
- modes de paiement IGS et PSL ;
- IGS et classe IGS ;
- patente ;
- TDL ;
- solde IR ;
- licence.

Les calculs reposent notamment sur le chiffre d’affaires cumulé des agences.

### 3.2. Application Prisma

La fiche détaillée Prisma présente un tableau de bord fiscal qui peut afficher :

- IGS ;
- patente ;
- TDL ;
- solde IR ou IS selon le type de client ;
- licence ;
- PSL ;
- bail ;
- taxe foncière.

Prisma calcule davantage ces résultats à partir des données sources plutôt que de les matérialiser directement dans le modèle principal du client.

### 3.3. Conséquences

- Les montants stockés dans vanilla facilitent la conservation d’un résultat à un instant donné, mais peuvent devenir obsolètes si les données sources changent sans recalcul.
- Les montants calculés dynamiquement dans Prisma restent cohérents avec les données courantes, mais peuvent évoluer lorsque les règles fiscales changent si aucun historique n’est conservé.

---

## 4. Agences et situation immobilière

### 4.1. Capacités communes

Les deux applications peuvent gérer plusieurs agences ou établissements avec :

- un libellé ;
- une ville ;
- un quartier ;
- une agence principale ;
- un chiffre d’affaires ;
- un statut immobilier ;
- un loyer mensuel ;
- une valeur immobilière.

Les deux applications calculent également les impôts immobiliers associés.

### 4.2. Différence de restitution

Vanilla restitue les agences dans la fiche PDF à travers un tableau comprenant :

- le numéro de l’établissement ;
- son libellé ;
- sa localisation ;
- son statut immobilier ;
- son chiffre d’affaires ;
- ses impôts immobiliers.

Prisma permet de saisir les agences, mais sa vue détaillée et son générateur PDF ne les restituent pas complètement.

**Conclusion :** la gestion des agences existe dans Prisma, mais elle n’est pas encore correctement valorisée dans la fiche consultable et imprimable.

---

## 5. Fiches détaillées à l’écran

### 5.1. Vue détaillée Prisma

Prisma possède une véritable vue détaillée structurée comprenant :

- un bandeau d’identité ;
- le type et le statut ;
- les informations générales ;
- l’adresse ;
- le contact ;
- le capital social et les actionnaires ;
- le tableau de bord fiscal ;
- l’historique des interactions ;
- la date de création de la fiche.

Cette vue est adaptée à la consultation quotidienne du dossier client.

### 5.2. Consultation dans vanilla

Vanilla ne possède pas une vue détaillée permanente comparable. La consultation détaillée passe principalement par :

- le formulaire de modification ;
- l’aperçu de la fiche PDF ;
- le document PDF produit.

**Conclusion :** Prisma est supérieure pour consulter le dossier à l’écran, tandis que vanilla est supérieure pour vérifier et produire une fiche documentaire synthétique.

---

## 6. Fiches PDF

### 6.1. PDF vanilla

La fiche PDF vanilla comprend notamment :

- les informations configurées du cabinet ;
- l’identité et le statut du client ;
- les coordonnées ;
- le centre fiscal ;
- la situation fiscale détaillée ;
- la situation immobilière détaillée ;
- les agences et établissements ;
- les montants fiscaux calculés.

Avant le téléchargement, vanilla affiche également :

- un aperçu de la première page ;
- le nom du fichier ;
- le nombre d’agences ;
- le chiffre d’affaires ;
- un contrôle de complétude de la fiche.

### 6.2. PDF Prisma

Le PDF Prisma contient :

- les informations générales ;
- l’adresse ;
- le contact ;
- la situation immobilière globale ;
- l’historique des interactions.

Il ne contient actuellement pas :

- le tableau fiscal détaillé ;
- le détail des agences ;
- le capital social ;
- les actionnaires ;
- les données réelles configurées du cabinet ;
- un aperçu avant téléchargement ;
- un contrôle de complétude.

**Conclusion :** la fiche PDF vanilla est actuellement plus complète et plus proche d’un document professionnel finalisé.

---

## 7. Contrôle de qualité des données

Vanilla possède une vérification explicite de la complétude de la fiche. Elle contrôle notamment :

- le nom ;
- le type ;
- le NIU ;
- la ville ;
- le contact ;
- le régime fiscal.

L’aperçu PDF indique ensuite si la fiche est prête ou si des informations doivent être complétées.

Prisma dispose de validations dans les parcours de création et de modification, mais la fiche PDF ne présente pas de diagnostic synthétique avant impression.

**Conclusion :** vanilla distingue mieux la possibilité de produire un document de la qualité du document produit.

---

## 8. Différences de nommage et de structure

Les deux applications utilisent des structures différentes pour des informations similaires :

| Vanilla | Prisma |
|---|---|
| `name` | `nom` ou `raisonsociale` |
| `cdi` | `centrerattachement` |
| `phone` | `contact.telephone` |
| `email` | `contact.email` |
| `secteur` | `secteuractivite` |
| `cnps` | `numerocnps` |
| `externalise` avec « Oui » ou « Non » | `gestionexternalisee` booléen |
| `regimeFiscal` avec `IGS`, `Reel`, `NonPro`, `OBNL` | `regimefiscal` avec `igs`, `reel`, `non_professionnel`, `obnl` |
| `statutImmo` avec des libellés capitalisés | `statutImmo` avec des valeurs normalisées en minuscules |

Toute synchronisation ou migration entre les deux applications nécessite donc un adaptateur explicite.

---

## 9. Écarts fonctionnels principaux

### Écart 1 — Les agences Prisma ne sont pas visibles dans la fiche détaillée

Le formulaire Prisma permet de gérer plusieurs agences, mais la vue détaillée ne possède pas de section consacrée à leur affichage.

### Écart 2 — Le PDF Prisma ignore les agences

Le modèle Prisma contient les agences, mais le générateur de fiche PDF ne les utilise pas.

### Écart 3 — Le PDF Prisma ignore le tableau fiscal

Le tableau de bord fiscal Prisma calcule et affiche de nombreux impôts, mais ces résultats ne sont pas exportés dans la fiche PDF.

### Écart 4 — Le PDF vanilla ne possède pas les informations juridiques riches de Prisma

La fiche vanilla ne contient pas la forme juridique, le RCCM, le dirigeant, la date et le lieu de création, le capital social, les actionnaires, le sexe ou l’état civil.

### Écart 5 — La fiche Prisma ne propose pas d’aperçu ni de contrôle de complétude avant impression

Vanilla propose un parcours de vérification documentaire plus abouti avant le téléchargement du PDF.

---

## 10. Recommandations de convergence

La meilleure stratégie consiste à conserver **Prisma comme source fonctionnelle principale**, puis à y intégrer les points forts de la fiche vanilla.

### Priorité haute

1. Ajouter les agences à la vue détaillée Prisma.
2. Ajouter le tableau des agences au PDF Prisma.
3. Ajouter le tableau fiscal complet au PDF Prisma.
4. Ajouter un aperçu avant téléchargement.
5. Ajouter un contrôle de complétude avant impression.

### Priorité moyenne

6. Utiliser la configuration réelle du cabinet dans le PDF Prisma.
7. Ajouter le capital social et les actionnaires au PDF Prisma.
8. Afficher les modes de paiement IGS et PSL dans la fiche détaillée.
9. Harmoniser les libellés fiscaux, notamment l’utilisation de « TPF ».

### Éléments Prisma à conserver

10. Les informations juridiques détaillées.
11. Le capital social et les actionnaires.
12. L’historique des interactions.
13. La distinction claire entre personnes physiques et personnes morales.

---

## Conclusion

La fiche client **Prisma possède le modèle de données le plus riche**, particulièrement pour l’identité juridique, le capital social et le suivi des interactions.

La fiche client **vanilla est plus aboutie comme document fiscal opérationnel**, grâce à son contrôle de complétude, son aperçu PDF, son tableau des agences, sa restitution des calculs fiscaux et immobiliers et son utilisation des informations configurées du cabinet.

La principale évolution recommandée consiste à faire évoluer la vue détaillée et le PDF Prisma afin qu’ils restituent toutes les données déjà saisies dans Prisma, en s’inspirant de la fiche PDF vanilla sans perdre les informations juridiques et CRM propres à Prisma.

---

## Fichiers principaux analysés

### Application vanilla

- `facturation/clients.html`

### Application Prisma

- `src/types/client.ts`
- `src/components/clients/ClientForm.tsx`
- `src/components/clients/form/ClientFormFields.tsx`
- `src/components/clients/ClientView.tsx`
- `src/components/clients/view/GeneralInfoCard.tsx`
- `src/components/clients/view/FiscalDashboard.tsx`
- `src/components/clients/view/InteractionsCard.tsx`
- `src/components/clients/identity/AgencesEditor.tsx`
- `src/utils/pdf/clientFichePdfGenerator.ts`
