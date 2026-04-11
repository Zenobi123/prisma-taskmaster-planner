# Rapport d'analyse securite (v2 - mise a jour approfondie)

**Projet audite :** `prisma-taskmaster-planner`  
**Date initiale :** 11 avril 2026  
**Date de mise a jour :** 11 avril 2026 (v2)  
**Type d'analyse :** revue complete du code (frontend React + Supabase + Edge Functions + RLS + dependencies)

---

## 1) Resume executif

Le projet dispose de bases de securite correctes (authentification Supabase, protection des routes, validation d'entrees dans certaines fonctions). Depuis la premiere analyse, certains points ont ete ameliores (fichiers UUID dans `fiscalAttachmentService`, suppression de la colonne `password` en base).

Cependant, cette seconde analyse revele **12 risques** dont **5 nouveaux** non identifies dans le rapport initial. Les problemes majeurs sont :

- **Autorisation insuffisante** : la majorite des modules (7 sur 10) n'ont aucun controle de role
- **Edge Functions utilisant SERVICE_ROLE_KEY** : contournement total des politiques RLS
- **Fonctionnalites de securite factices** : changement de mot de passe et 2FA non implementes
- **Generation d'identifiants previsibles** avec `Math.random()` dans la logique metier
- **Donnees sensibles en cache localStorage** accessibles en cas de XSS

---

## 2) Ce qui est deja bien (ameliore depuis v1)

1. **Auth centralisee via Supabase** (session, PrivateRoute, refresh token).
2. **Controle d'acces metier** via `useAuthorization` pour 3 modules (collaborateurs, parametres, facturation).
3. **Validation d'entrees** dans `apply-credit` (UUID regex, montant > 0, champs requis).
4. **Sanitization CSS** dans le composant chart (`sanitizeCssKey`, `sanitizeCssValue`).
5. **Upload fiscal ameliore** : `fiscalAttachmentService.ts` utilise maintenant `uuidv4()` pour les noms de fichiers + validation de type MIME et taille max (5 MB).
6. **Suppression de la colonne password** dans la table `users` (migration `20260328205532`).
7. **Suppression des politiques RLS anonymes** sur la table `clients` (migration `20260328204136`).
8. **CORS dynamique** dans les Edge Functions avec `ALLOWED_ORIGINS` configurable.
9. **CSV import** avec validation structuree (types, regimes fiscaux, NIU obligatoire).

---

## 3) Risques identifies

### CRITIQUE (P0)

---

#### :red_circle: Risque 1 — Cle Supabase "anon" en dur dans le code source [EXISTANT - NON CORRIGE]

**Fichier :** `src/integrations/supabase/client.ts:4-5`

```ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xkwqgxqmwxxpzrsurchk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIs...";
```

**Probleme :** L'URL du projet et la cle anon sont exposees dans le code source en fallback. Meme si c'est une cle "publique", cela permet a quiconque d'appeler l'API Supabase directement.

**Impact :** Automatisation d'appels malveillants, surtout avec les politiques RLS permissives actuelles.

**Correctif :**
- Supprimer les valeurs fallback, garder uniquement `import.meta.env.VITE_SUPABASE_URL` sans `||`
- Echouer au demarrage si les variables sont absentes
- Ajouter une verification au build (`vite.config.ts`)

---

#### :red_circle: Risque 2 — Politiques RLS "authenticated only" sans filtrage par perimetre [EXISTANT - NON CORRIGE]

**Fichiers :** Toutes les migrations RLS (`20260325000000`, `20260328204036`, `20260403054344`)

**Probleme :** Toutes les politiques RLS utilisent soit `auth.role() = 'authenticated'` soit `USING (true) TO authenticated`. Aucune politique ne filtre par `auth.uid()`, `owner_id`, ou appartenance a un client/equipe.

**Tables concernees :** `capital_social`, `actionnaires`, `tasks`, `payment_reminders`, `clients`, `factures`, `paiements`, `documents_administratifs`, `collaborateurs`, etc.

**Impact :** Tout utilisateur authentifie peut lire, modifier et supprimer les donnees de tous les autres utilisateurs/clients.

**Correctif :**
```sql
-- Exemple pour la table clients
CREATE POLICY "Users can only access their team's clients"
ON clients FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM team_members 
    WHERE team_id = clients.team_id
  )
  OR is_admin(auth.uid())
);
```

---

#### :red_circle: Risque 3 — Edge Functions avec SERVICE_ROLE_KEY contournant le RLS [EXISTANT - AGGRAVE]

**Fichiers :** `supabase/functions/apply-credit/index.ts:70-78`, `supabase/functions/send-payment-reminders/index.ts:66-74`

```ts
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',  // <-- Bypass RLS complet
  { global: { headers: { Authorization: authHeader } } }
)
```

**Probleme :** Les deux fonctions utilisent `SUPABASE_SERVICE_ROLE_KEY` (qui bypass le RLS) tout en passant le header d'auth utilisateur. Le service_role_key prend la priorite : **tout utilisateur authentifie peut effectuer n'importe quelle operation** via ces fonctions.

**Impact :** Un utilisateur connecte sans droits financiers peut appliquer des credits ou declencher des relances de paiement pour n'importe quel client.

**Correctif :**
- Verifier le role de l'utilisateur depuis le JWT avant toute operation
- Utiliser `SUPABASE_ANON_KEY` + le JWT utilisateur pour que le RLS s'applique, OU
- Faire une verification explicite de role :
```ts
const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
const { data: userData } = await supabaseClient.from('users').select('role').eq('id', user.id).single();
if (!['admin', 'comptable'].includes(userData.role)) {
  return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });
}
```

---

#### :red_circle: Risque 4 — Fonctionnalites de securite factices (mot de passe + 2FA) [NOUVEAU]

**Fichier :** `src/components/parametres/SecuritySettings.tsx:21-27`

```ts
const handlePasswordChange = (e: React.FormEvent) => {
  e.preventDefault();
  toast({ title: "Mot de passe modifie", description: "..." }); // <-- Faux !
};
```

**Probleme :** 
- Le formulaire de changement de mot de passe affiche un toast de succes sans jamais appeler `supabase.auth.updateUser({ password })`.
- Aucune verification du mot de passe actuel.
- Le toggle 2FA est un `<Switch>` visuel sans aucune logique.
- L'utilisateur croit etre protege alors qu'il ne l'est pas.

**Impact :** Faux sentiment de securite. Un utilisateur dont le mot de passe est compromis ne peut pas le changer.

**Correctif :**
- Implementer `supabase.auth.updateUser({ password: newPassword })` avec verification du mot de passe actuel
- Ajouter la validation de complexite du mot de passe (min 8 caracteres, mixte)
- Implementer le 2FA via `supabase.auth.mfa.enroll()` ou retirer le toggle

---

### ELEVE (P1)

---

#### :orange_circle: Risque 5 — 7 modules sans aucun controle de role [NOUVEAU]

**Fichier :** `src/App.tsx:80-177`

**Probleme :** Sur 10 modules proteges par `PrivateRoute`, seuls 3 utilisent `useAuthorization` :
- Collaborateurs (`["admin"]`)
- Parametres (`["admin"]`)
- Facturation (`["admin", "comptable"]`)

Les 7 modules suivants sont accessibles a **tout utilisateur authentifie**, sans restriction de role :
- **Clients** (donnees sensibles : NIU, adresses, contacts)
- **Gestion** (dossiers clients, obligations fiscales)
- **Missions** (taches, assignations)
- **Planning** (charge de travail equipe)
- **Courrier** (documents, correspondance)
- **Rapports** (rapports financiers, RH, fiscaux)
- **Dashboard** (vue d'ensemble complete)

**Impact :** Un assistant ou stagiaire avec un compte peut acceder a toutes les donnees financieres, fiscales et clients.

**Correctif :** Ajouter `useAuthorization` avec les roles autorises a chaque module.

---

#### :orange_circle: Risque 6 — Upload de fichiers non securise dans useDocumentMutations [EXISTANT - PARTIELLEMENT CORRIGE]

**Fichier :** `src/components/gestion/tabs/hooks/useDocumentMutations.ts:36-65`

**Problemes restants :**
1. **Noms de fichiers previsibles** : `Math.random()` (ligne 37) au lieu de `uuidv4()`
2. **Fallback mocked_url** : En cas d'erreur upload, le fichier est enregistre avec `mocked_url_${file.name}` (lignes 64, 133)
3. **Aucune validation** de type MIME, extension ou taille
4. **URLs publiques** : utilise `getPublicUrl()` (ligne 50-52) au lieu de `createSignedUrl()` - les documents sont accessibles par quiconque connait l'URL

**Note positive :** `fiscalAttachmentService.ts` a ete corrige correctement avec `uuidv4()`, validation MIME, et URLs signees.

**Correctif :** Aligner `useDocumentMutations.ts` sur les bonnes pratiques de `fiscalAttachmentService.ts`.

---

#### :orange_circle: Risque 7 — Generation d'identifiants previsibles avec Math.random() [NOUVEAU]

**Fichiers concernes :**
- `src/services/factureCreationService.ts:45` — IDs de factures
- `src/services/factureDataService.ts:198` — IDs de factures
- `src/services/devisService.ts:137,175,277,354` — IDs de devis
- `src/services/propositionService.ts:123` — IDs de propositions
- `src/hooks/facturation/paiementActions/usePaiementCreate.ts:33` — Numeros de paiement

```ts
const id = `FPRE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
```

**Probleme :** `Math.random()` n'est pas cryptographiquement sur. Les IDs generees sont previsibles et sujettes a collision. Combiner avec `Date.now()` rend la partie temporelle devinable.

**Impact :** Possibilite de deviner les IDs de documents financiers, collisions potentielles.

**Correctif :**
```ts
import { v4 as uuidv4 } from 'uuid';
const id = `FPRE-${uuidv4()}`;
```

---

#### :orange_circle: Risque 8 — Protection brute-force uniquement cote client [EXISTANT - NON CORRIGE]

**Fichier :** `src/pages/Login.tsx:11-12,19`

```ts
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000;
const loginAttemptsRef = useRef(0); // <-- Reset au rechargement de page
```

**Probleme :** Le compteur de tentatives est stocke dans un `useRef`, reset a chaque rechargement de page. Un attaquant peut contourner cela trivialement.

**Correctif :**
- Activer le rate limiting cote serveur (Supabase Auth settings ou reverse proxy)
- Journaliser les echecs de login et alerter en cas de pics

---

### MOYEN (P2)

---

#### :yellow_circle: Risque 9 — Injection de formules CSV dans les exports [NOUVEAU]

**Fichier :** `src/utils/exports/csvExporter.ts:36-41`

```ts
const csvData = events.map(event => [
  `"${event.title.replace(/"/g, '""')}"`,  // Echappe les guillemets mais pas les formules
  ...
```

**Probleme :** Les exports CSV echappent correctement les guillemets doubles mais ne protegent pas contre l'injection de formules. Si un nom de client ou titre contient `=CMD()`, `+cmd|`, `@SUM`, le fichier CSV ouvert dans Excel pourrait executer des commandes.

**Impact :** Execution de commandes sur le poste de l'utilisateur qui ouvre le CSV.

**Correctif :**
```ts
function sanitizeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  if (/^[=+\-@\t\r]/.test(escaped)) {
    return `"'${escaped}"`;  // Prefixer avec apostrophe
  }
  return `"${escaped}"`;
}
```

---

#### :yellow_circle: Risque 10 — Donnees fiscales en cache localStorage [NOUVEAU]

**Fichier :** `src/hooks/fiscal/services/cacheService.ts:104`

```ts
window.localStorage.setItem(cacheKey, JSON.stringify({ ... }));
```

**Probleme :** Les donnees fiscales des clients sont mises en cache dans `localStorage`. En cas de vulnerabilite XSS (meme via une extension navigateur), ces donnees sont accessibles.

**Impact :** Exposition de donnees financieres/fiscales sensibles.

**Correctif :**
- Utiliser `sessionStorage` (efface a la fermeture du navigateur) ou
- Utiliser un cache en memoire uniquement (React Query le fait deja)
- Ne pas cacher de donnees sensibles cote client

---

#### :yellow_circle: Risque 11 — Erreurs silencieusement ignorees [EXISTANT - NON CORRIGE]

**Fichiers concernes (>25 occurrences) :**
- `src/services/taskService.ts:100-101, 307-308, 334-335`
- `src/services/subjectClientsService.ts:52-53`
- `src/utils/reports/clientReports.ts:77-78, 125-126, 183-184`
- `src/utils/reports/financialReports.ts:66-67, 99-100`
- `src/utils/reports/rhReports.ts:76-77, 149-150`
- `src/pages/clients/hooks/useClientsPage.tsx:116-117, 125-126, 134-135`

```ts
} catch (error) {
  // Rien - erreur completement ignoree
}
```

**Impact :** Impossible de detecter des incidents de securite ou des operations echouees.

**Correctif :**
- Au minimum `console.error('context:', error)` dans chaque catch
- Idealement : service de logs structure (Sentry, LogRocket, etc.)

---

#### :yellow_circle: Risque 12 — Gestion des utilisateurs en memoire uniquement [NOUVEAU]

**Fichier :** `src/components/parametres/user-management/hooks/useUserManagement.tsx:21-24`

```ts
const [users, setUsers] = useState<User[]>([
  { id: 1, name: "Principal Admin", email: "admin@example.com", ... },
  { id: 2, name: "Joel Herve TCHOMKAM", email: "joelhervetckomkam@gmail.com", ... },
  { id: 3, name: "Fransnelle FANKAM FOSSO", email: "fankam.prisca@gmail.com", ... }
]);
```

**Problemes :**
- Adresses email reelles codees en dur dans le code source (expose dans Git)
- Ajout/suppression d'utilisateurs en `useState` uniquement (perdu au rechargement)
- Aucune interaction avec Supabase Auth pour la gestion reelle des utilisateurs

**Impact :** L'interface de gestion des utilisateurs ne fonctionne pas reellement. Les emails reels sont exposes publiquement.

**Correctif :**
- Connecter a `supabase.auth.admin.listUsers()` / `createUser()` / `deleteUser()`
- Retirer les emails reels du code source

---

### FAIBLE (P3)

---

#### :white_circle: Risque 13 — Dependencies de test dans les dependencies de production

**Fichier :** `package.json:54-55,72`

Les packages suivants sont dans `dependencies` au lieu de `devDependencies` :
- `@playwright/test@^1.58.2`
- `jsdom@^26.0.0`
- `vitest@^3.0.9`

**Impact :** Augmente la surface d'attaque en production et le poids du bundle.

**Correctif :** Deplacer dans `devDependencies`.

---

#### :white_circle: Risque 14 — Service de stockage mock encore dans le codebase

**Fichier :** `src/services/storageService.ts`

Un service mock avec URLs `mock-storage.example.com` est encore present. Peut masquer des erreurs reelles et confondre les developpeurs.

**Correctif :** Supprimer ou remplacer par le vrai service Supabase Storage.

---

## 4) Matrice de risque synthetique

| # | Risque | Severite | Statut | Effort |
|---|--------|----------|--------|--------|
| 1 | Cle Supabase en dur | CRITIQUE | Existant | Faible |
| 2 | RLS sans filtrage perimetre | CRITIQUE | Existant | Eleve |
| 3 | Edge Functions SERVICE_ROLE bypass | CRITIQUE | Aggrave | Moyen |
| 4 | Securite factice (mot de passe/2FA) | CRITIQUE | **Nouveau** | Moyen |
| 5 | 7 modules sans controle de role | ELEVE | **Nouveau** | Moyen |
| 6 | Upload documents non securise | ELEVE | Partiel | Faible |
| 7 | Math.random() pour IDs metier | ELEVE | **Nouveau** | Faible |
| 8 | Brute-force cote client uniquement | ELEVE | Existant | Moyen |
| 9 | Injection formules CSV | MOYEN | **Nouveau** | Faible |
| 10 | Donnees fiscales en localStorage | MOYEN | **Nouveau** | Faible |
| 11 | Erreurs silencieuses | MOYEN | Existant | Moyen |
| 12 | User management en memoire | MOYEN | **Nouveau** | Eleve |
| 13 | Test deps en production | FAIBLE | **Nouveau** | Faible |
| 14 | Mock storage service | FAIBLE | **Nouveau** | Faible |

---

## 5) Plan d'action priorise

### Priorite P0 (immediat — avant mise en production)

1. **Retirer les credentials Supabase en dur** du fichier `client.ts` — echouer si variables absentes
2. **Ajouter verification de role** dans les Edge Functions `apply-credit` et `send-payment-reminders`
3. **Implementer reellement le changement de mot de passe** dans SecuritySettings ou retirer le formulaire
4. **Revoir les politiques RLS** table par table — passer de "authenticated" a "authenticated + perimetre"

### Priorite P1 (important — dans les 2 semaines)

5. **Ajouter `useAuthorization`** aux 7 modules non proteges (Clients, Gestion, Missions, Planning, Courrier, Rapports, Dashboard)
6. **Securiser `useDocumentMutations.ts`** : UUID, validation MIME/taille, URLs signees, supprimer fallback mocked_url
7. **Remplacer `Math.random()`** par `crypto.randomUUID()` ou `uuidv4()` dans tous les generateurs d'IDs metier
8. **Activer le rate limiting** cote serveur (Supabase Auth ou reverse proxy)

### Priorite P2 (renforcement — dans le mois)

9. **Ajouter protection contre l'injection CSV** dans les fonctions d'export
10. **Migrer le cache fiscal** de `localStorage` vers `sessionStorage` ou cache memoire
11. **Standardiser la gestion d'erreurs** : remplacer les catch vides par des logs structures
12. **Connecter la gestion des utilisateurs** a Supabase Auth et retirer les emails en dur
13. **Deplacer les deps de test** vers `devDependencies`
14. **Supprimer le mock storage service**

---

## 6) Comparaison v1 vs v2

| Element | v1 (11 avr. 2026) | v2 (11 avr. 2026) |
|---------|-------------------|--------------------|
| Risques identifies | 6 | 14 |
| Risques critiques | 3 | 4 |
| Risques nouveaux | — | 8 |
| Risques corriges | — | 0 entierement |
| Risques partiellement corriges | — | 2 (upload, RLS anonymous) |
| Fichiers analyses | ~10 | ~50+ |
| Migrations SQL analysees | Non | 7 migrations |

---

## 7) Points positifs a noter (ameliorations depuis la creation du projet)

- Migration `20260328205532` : suppression correcte de la colonne `password` de la table `users`
- Migration `20260328204136` : suppression des politiques RLS anonymes sur `clients`
- Migration `20260325000000` : passage de `USING (true)` a `auth.role() = 'authenticated'` sur `capital_social` et `actionnaires`
- `fiscalAttachmentService.ts` : implementation correcte avec UUID, validation MIME, URLs signees
- `apply-credit` : bonne validation des entrees (UUID regex, montant positif, champs requis)
- `csvExporter.ts` : echappement correct des guillemets doubles dans les exports CSV
- Composant `chart.tsx` : sanitization des cles/valeurs CSS avant injection dans `<style>`

---

## 8) Conclusion

Le projet a progresse depuis sa creation sur certains aspects de securite (RLS basique, upload fiscal, suppression de donnees sensibles en base). Cependant, **aucun des 6 risques initiaux n'a ete entierement corrige**, et cette analyse approfondie revele **8 risques supplementaires**, dont un critique (fonctionnalites de securite factices).

La priorite absolue reste le passage d'un modele "connecte = autorise" a un modele d'**autorisation fine par role et perimetre**, applique de bout en bout : RLS, Edge Functions, et routes frontend.
