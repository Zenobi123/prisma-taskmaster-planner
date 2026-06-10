# Instruction Lovable — Ventilation des impôts immobiliers PSL / Bail / TPF par agence

> **Statut : implémenté et vérifié** (commit Lovable `359a929` fusionné dans `main`,
> revue de conformité le 2026-06-10 — voir section « Résultat de la vérification »
> en fin de document). Ce document est conservé comme référence de la spécification.

---

## Contexte

Cette application (PRISMA GESTION) est le portage React/Supabase d'une application
vanilla HTML/localStorage. Dans l'application de référence, un client peut exercer
sur PLUSIEURS agences/établissements (`client.agences[]`) et les impôts immobiliers
(PSL, Bail, TPF) sont calculés et facturés PAR BIEN, avec des libellés normalisés
`PSL_Ville/Quartier`, `Bail_Ville/Quartier`, `TPF_Ville/Quartier`
(ex. `Bail_Yaoundé/Bastos`, `PSL_Douala/Akwa`, `TPF_Yaoundé/Centre`).

Dans l'application React initiale, le client n'avait qu'une seule situation
immobilière (`clients.situationimmobiliere` JSON : `{ type, valeur, loyer }`) et les
formulaires facture/devis ne proposaient qu'un bouton global « + PSL », « + Bail »,
« + TF ». Objectif : reproduire fidèlement le comportement multi-agences de la
référence, sans casser les clients existants.

## 1. Modèle de données

- Ajouter une colonne `agences jsonb` (nullable) à la table `clients` (migration Supabase),
  puis régénérer les types.
- Type `Agence` dans `src/types/client.ts` :
  `{ libelle: string; ville: string; quartier: string; principale: boolean;
     chiffreAffaires: number; statutImmo: "locataire" | "proprietaire" | "les_deux" | "";
     loyerMensuel: number; valeurBien: number }`
  et champ `agences?: Agence[]` sur le type `Client`.
- Règles métier (identiques à la référence) :
  - `agences[0]` est le SIÈGE (`principale: true`) : toujours présent, non supprimable,
    il HÉRITE de la ville/quartier de l'adresse du client ; libellé par défaut
    `Siège (Ville)` tant que l'utilisateur ne l'a pas modifié.
  - Les agences secondaires saisissent leur propre ville/quartier.
  - PSL/Bail/TPF ne sont PAS stockés : ils sont dérivés par calcul (voir §2).
- Rétrocompatibilité : un client SANS `agences` reste valide. À la lecture, on
  synthétise un bien unique « Établissement principal » à partir des champs à plat
  (`situationimmobiliere` + `adresse.ville`/`adresse.quartier`). Aucune migration de
  données n'est nécessaire.
- Les champs à plat existants restent renseignés comme CUMULS lorsqu'il y a des
  agences : `chiffreaffaires` = Σ CA des agences ; `situationimmobiliere.loyer` /
  `.valeur` = cumuls. Les autres modules (gestion, courrier, rapports) continuent
  de lire ces totaux sans modification.

## 2. Calculs — `src/lib/spec/fiscal.ts` (source de vérité, ne pas dupliquer ailleurs)

- Ajouter `agences?: AgenceSpec[]` au type `ClientSpec` et les adapter dans `adaptClient()`.
- IGS / Patente / TDL / Solde IR / Licence : calculés sur le CA CUMULÉ
  (Σ `agences[].chiffreAffaires`) — un seul contribuable, un seul régime.
- Nouvelle fonction `computeAgencyImmo(agence, regimeFiscal)` calculant par bien,
  en réutilisant les constantes existantes de `src/lib/spec/fiscal-constants.ts` :
  - PSL = `PSL_TAUX` (10 %) × loyer annuel (`loyerMensuel × 12`) — exonéré si régime OBNL ou NonPro ;
  - Bail = loyer annuel × `BAIL_TAUX_NORMAL` (10 %) ou `BAIL_TAUX_OBNL` (5 %) pour OBNL/NonPro ;
  - TPF = `TF_TAUX` (0,1 %) × `valeurBien`.
  Les montants PSL/Bail/TPF agrégés de `computeAllTaxes()` deviennent la somme des biens.
- Nouvelle fonction `getClientBiensImmo(client: ClientSpec)` : retourne la liste des
  biens (agences) avec `{ libelle, ville, quartier, psl, bail, tf }` ; repli sur un
  bien unique « Établissement principal » construit depuis les champs à plat pour
  les clients sans agences.
- Nouvelle fonction `buildImmoTaxLabel(acronyme, bien)` reproduisant exactement la
  référence :
  `loc = [ville, quartier].map(trim).filter(Boolean).join('/')` ;
  `suffixe = loc || libelle || ''` ;
  retourne `suffixe ? `${acronyme}_${suffixe}` : acronyme`.
  Acronymes : `PSL`, `Bail`, `TPF`.

## 3. Boutons d'ajout rapide factures & devis — `src/lib/spec/facturePrestations.ts`

- Remplacer les trois boutons statiques `+ PSL`, `+ Bail`, `+ TF` de
  `QUICK_IMPOT_BUTTONS` par une génération DYNAMIQUE : nouvelle fonction
  `getQuickImpotButtons(client: ClientSpec)` qui retourne :
  1. UN BOUTON PAR BIEN ET PAR IMPÔT dont le montant > 0, libellé
     `+ PSL_Ville/Quartier`, `+ Bail_Ville/Quartier`, `+ TPF_Ville/Quartier`
     (couleurs : PSL bleu, Bail teal, TPF orange). Le clic ajoute UNE ligne de
     prestation de type Impôt avec cette désignation exacte et le montant du bien.
     Pas de doublon si une ligne avec la même désignation existe déjà.
  2. Puis les boutons fiscaux existants inchangés (IGS en cascade, TDL, Solde IR/IS,
     Patente, Inscription CGA, Cotisation CGA).
- Mettre à jour les deux consommateurs : `src/components/facturation/factures/CreateFactureForm.tsx`
  et `src/components/facturation/devis/CreateDevisDialog.tsx`.
- Dans `LISTE_IMPOTS`, harmoniser l'acronyme affiché « Taxe Foncière (TF) » →
  « Taxe Foncière (TPF) » (la clé de données reste `tf`).

## 4. Fiche client — éditeur d'agences

- Dans le formulaire client (`src/components/clients/identity/PropertyStatusFields.tsx`
  et `src/components/clients/form/ClientFormFields.tsx`), transformer la section
  « Situation immobilière » en éditeur d'agences :
  - Le siège (agence 1) toujours affiché : libellé (pré-rempli `Siège (Ville)`),
    CA, statut immobilier, loyer mensuel, valeur du bien ; ville/quartier hérités
    de l'adresse du client (lecture seule).
  - Bouton « + Ajouter une agence » : agences secondaires avec libellé, ville,
    quartier, CA, statut immo, loyer, valeur ; supprimables.
  - Affichage en temps réel par agence des montants PSL / Bail / TPF calculés, et
    un récapitulatif cumulé (CA total, total immobilier) sous la liste.
- À l'enregistrement : persister `agences` ET synchroniser les champs à plat en
  cumuls (`chiffreaffaires`, `situationimmobiliere`) pour la rétrocompatibilité.
- La fiche client en consultation (`src/components/clients/view/`) affiche le
  récapitulatif des agences avec leur localisation et leurs impôts.

## 5. Compatibilité des libellés ventilés

- `src/utils/echeancesFiscales.ts` reconnaît les impôts par sous-chaîne : les
  libellés `PSL_…` et `Bail_…` matchent déjà, mais « TPF » ne contient PAS « TF ».
  Ajouter `d.includes("TPF")` à la condition de la Taxe Foncière (conserver les
  clés actuelles pour les documents historiques).
- Ne rien changer à la ventilation Impôts/Honoraires des paiements (elle se base
  sur le TYPE de prestation, pas sur la désignation).

## 6. Garde-fous

- Ne PAS modifier les barèmes ni les taux ; réutiliser exclusivement
  `fiscal-constants.ts`.
- Ne PAS toucher aux modules gestion, courrier, rapports : ils lisent les cumuls à plat.
- Hors périmètre : import/export clients, modèles de courrier.
- Ajouter des tests dans `src/lib/spec/__tests__/fiscal.test.ts` :
  - `buildImmoTaxLabel` : `('PSL', {ville:'Douala', quartier:'Akwa'})` → `PSL_Douala/Akwa` ;
    sans localisation → repli sur le libellé du bien ; sans rien → `PSL`.
  - `computeAgencyImmo` : locataire 100 000 F/mois → PSL 120 000 et Bail 120 000
    (Bail 60 000 si OBNL/NonPro, PSL 0) ; propriétaire valeur 50 000 000 → TPF 50 000.
  - Cumuls : 2 agences → psl/bail/tf agrégés et CA cumulé pour l'IGS.
  - Rétrocompat : client sans agences → un bien unique depuis les champs à plat,
    montants identiques à aujourd'hui.

## Critère d'acceptation global

Un client avec 2 agences — Yaoundé/Bastos (locataire, loyer 100 000 F/mois) et
Douala/Akwa (propriétaire, valeur 50 000 000 F) — doit afficher dans le formulaire
de facture ET de devis les boutons : `+ PSL_Yaoundé/Bastos (120 000 F CFA)`,
`+ Bail_Yaoundé/Bastos (120 000 F CFA)`, `+ TPF_Douala/Akwa (50 000 F CFA)`,
chacun ajoutant une ligne Impôt avec cette désignation exacte ; son IGS est calculé
sur le CA cumulé des deux agences ; un client existant sans agences conserve
exactement le comportement actuel.

---

## Résultat de la vérification (2026-06-10)

Implémentation Lovable revue point par point — **conforme**, avec une correction :

| Point | Statut |
|---|---|
| Migration `clients.agences jsonb` + types Supabase | ✅ |
| `AgenceSpec` / `computeAgencyImmo` (taux, exonérations OBNL/NonPro) | ✅ |
| `getClientBiensImmo` avec repli « Établissement principal » | ✅ |
| `buildImmoTaxLabel` (logique exacte de la référence) | ✅ |
| `adaptClient` : CA / loyer / valeur cumulés sur agences | ✅ |
| `getQuickImpotButtons` : boutons par bien + dédoublonnage + ordre | ✅ |
| Branchement CreateFactureForm + CreateDevisDialog | ✅ |
| `Taxe Foncière (TPF)` dans LISTE_IMPOTS | ✅ |
| Correctif `TPF` dans `echeancesFiscales.ts` | ✅ |
| Éditeur d'agences (siège hérité non supprimable, badges temps réel, récap) | ✅ |
| Synchronisation des cumuls à plat à l'enregistrement | ✅ |
| Tests (8 nouveaux dans `fiscal.test.ts`, scénarios d'acceptation) | ✅ |
| `updateClient` : `agences ?? null` écrasait les agences (et `fiscal_data`, bug préexistant) lors d'une mise à jour partielle (ex. ajout d'interaction) | ⚠️ **Corrigé** : les colonnes JSON ne sont réécrites que si la clé est fournie |
