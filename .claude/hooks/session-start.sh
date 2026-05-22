#!/bin/bash
# Hook SessionStart — prépare l'environnement des sessions Claude Code on the web :
# installe les dépendances (pour build / lint / tests / dev) et, au mieux, un
# navigateur Chromium pour les tests responsive visuels (Playwright).
set -euo pipefail

# Ne s'exécute que dans l'environnement distant (web).
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Dépendances Node (npm install : idempotent et profite du cache de conteneur).
npm install

# Navigateur pour les tests responsive visuels (Playwright). Best-effort :
# si la politique réseau bloque le téléchargement, on continue sans échouer.
npx playwright install chromium \
  || echo "[session-start] Chromium Playwright non installé (réseau ?) — tests visuels indisponibles cette session."
