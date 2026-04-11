# Rapport d’analyse sécurité (profonde, en termes simples)

**Projet audité :** `prisma-taskmaster-planner`  
**Date :** 11 avril 2026  
**Type d’analyse :** revue du code (frontend React + Supabase + Edge Functions)

---

## 1) Résumé exécutif (simple)

Le projet est globalement **fonctionnel**, avec plusieurs bonnes bases (authentification Supabase, vérification de rôle côté serveur dans certains cas, validation de données dans certaines fonctions).

Mais j’ai trouvé des points importants à corriger pour éviter :
- la consultation de données sensibles par des utilisateurs connectés mais non autorisés,
- des actions critiques effectuées sans contrôle de rôle fort,
- des risques liés aux fichiers uploadés,
- des erreurs cachées qui compliquent la détection d’incidents.

👉 En clair : **la sécurité existe, mais elle dépend trop de “l’utilisateur est connecté” au lieu de “l’utilisateur a le bon droit”**.

---

## 2) Ce qui est déjà bien

1. **Auth centralisée via Supabase** (session et route privée).  
2. **Contrôle d’accès métier** dans le frontend pour certains modules (`collaborateurs`, `parametres`, `facturation`).  
3. **Validation d’entrées** dans la fonction `apply-credit` (UUID + montant > 0).  
4. **Effort anti-injection CSS** dans le composant chart (sanitization des clés/valeurs CSS).

---

## 3) Risques principaux trouvés

## 🔴 Risque 1 — Clé Supabase “anon” en dur dans le code

- Le client Supabase inclut une URL et une clé publishable par défaut directement dans le code.
- Même si c’est une clé “publique”, la mettre en dur réduit le contrôle de déploiement et augmente le risque d’usage non prévu.

**Impact simple :** un attaquant peut plus facilement automatiser des appels contre votre backend public, surtout si les politiques RLS sont trop larges.

**Correctif conseillé :**
- imposer les variables d’environnement en production,
- échouer au démarrage si elles sont absentes,
- garder la clé uniquement dans `.env` des environnements contrôlés.

---

## 🔴 Risque 2 — Politiques RLS encore trop larges (niveau “utilisateur connecté”)

- Certaines politiques RLS ont été corrigées (bonne initiative), mais elles autorisent encore tout utilisateur authentifié à lire/écrire/supprimer sur des tables (`capital_social`, `actionnaires`) sans filtre métier plus fin (ex: périmètre client, entreprise, équipe).

**Impact simple :** un employé connecté pourrait voir/modifier des données qui ne le concernent pas.

**Correctif conseillé :**
- passer de “authentifié” à “authentifié + propriétaire / rôle admin / périmètre autorisé”,
- appliquer des règles RLS basées sur `auth.uid()` + liens métiers (`client_id`, `owner_id`, etc.),
- faire une revue RLS table par table.

---

## 🔴 Risque 3 — Fonctions Edge sensibles sans contrôle de rôle métier explicite

- Les fonctions `apply-credit` et `send-payment-reminders` vérifient l’existence du token (`Authorization`),
- mais ne vérifient pas explicitement un rôle métier (ex: admin, finance) avant des opérations sensibles.

**Impact simple :** un utilisateur connecté mais non autorisé pourrait tenter des actions financières si les politiques DB laissent passer.

**Correctif conseillé :**
- récupérer l’utilisateur depuis le JWT,
- vérifier le rôle (table `users` ou custom claims),
- refuser (403) si le rôle n’est pas autorisé.

---

## 🟠 Risque 4 — Upload de fichiers sans garde-fous stricts

- Les noms de fichiers sont générés avec `Math.random()` (pas idéal pour éviter collisions/prédictibilité),
- pas de vérification claire du type MIME, extension, taille maximale,
- en cas d’erreur upload, fallback vers `mocked_url_*` qui peut masquer un vrai problème de sécurité/exploitation.

**Impact simple :** fichiers malveillants, collisions, ou traçabilité faible.

**Correctif conseillé :**
- utiliser `crypto.randomUUID()` pour les noms,
- filtrer types autorisés (PDF/JPG/PNG…),
- imposer une taille max,
- supprimer le fallback `mocked_url_*` en production.

---

## 🟠 Risque 5 — Protection brute-force seulement côté interface

- La limitation de tentatives de connexion (`MAX_LOGIN_ATTEMPTS`) est locale au navigateur.
- Un attaquant peut contourner cela en rechargeant, changeant de navigateur, ou attaquant directement l’API.

**Impact simple :** protection utile contre l’utilisateur “normal”, mais faible contre un attaquant réel.

**Correctif conseillé :**
- activer le rate limiting côté serveur (Supabase Auth, reverse proxy, WAF),
- journaliser les échecs de login et alerter en cas de pics.

---

## 🟡 Risque 6 — Erreurs parfois avalées silencieusement

- Certains `catch` ignorent les erreurs sans logs exploitables.
- En sécurité, cela retarde la détection d’incident.

**Impact simple :** on ne voit pas qu’une action anormale a échoué ou a été tentée.

**Correctif conseillé :**
- logger les erreurs côté serveur (sans données sensibles),
- remonter un identifiant d’erreur côté UI,
- centraliser la télémétrie sécurité.

---

## 4) Plan d’action priorisé (simple et concret)

## Priorité P0 (immédiat)
1. Retirer la clé/URL Supabase en dur du client.
2. Ajouter contrôle de rôle explicite dans `apply-credit` et `send-payment-reminders`.
3. Revoir les politiques RLS critiques pour éviter “tout utilisateur connecté”.

## Priorité P1 (très important)
4. Sécuriser l’upload (UUID fort, type MIME, taille max, pas de `mocked_url` en prod).
5. Mettre un rate limiting serveur sur la connexion.

## Priorité P2 (renforcement)
6. Standardiser les logs d’erreur sécurité.
7. Créer une checklist de revue sécurité avant chaque release.

---

## 5) Recommandations techniques rapides (exemples)

- **RLS** : `USING (auth.uid() = owner_id OR is_admin(auth.uid()))` au lieu de `auth.role() = 'authenticated'`.
- **Edge function** : vérifier `role` avant toute opération financière (403 sinon).
- **Upload** : refuser tout fichier hors liste blanche + scanner antivirus côté stockage si possible.
- **Secrets** : aucune valeur sensible codée en dur dans le repo.
- **Monitoring** : logs structurés (`action`, `user_id`, `resource_id`, `result`, `timestamp`).

---

## 6) Conclusion en une phrase

Le projet est sur une bonne base, mais il faut maintenant passer d’une sécurité “connecté = autorisé” à une sécurité “**autorisation fine par rôle et périmètre**”, surtout pour les données financières et les opérations sensibles.
