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
# - si un Chromium pré-installé existe dans le conteneur, on évite un téléchargement
#   bloqué par la politique réseau (les scripts visuels pointent dessus via
#   `executablePath`).
# - sinon on tente le téléchargement, sans faire échouer la session si réseau ko.
preinstalled_chrome=$(ls /opt/pw-browsers/chromium-*/chrome-linux/chrome 2>/dev/null | head -n1 || true)
if [ -n "$preinstalled_chrome" ]; then
  echo "[session-start] Chromium pré-installé détecté : $preinstalled_chrome — téléchargement Playwright sauté."
else
  npx playwright install chromium \
    || echo "[session-start] Chromium Playwright non installé (réseau ?) — tests visuels indisponibles cette session."
fi
