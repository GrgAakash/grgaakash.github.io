#!/usr/bin/env bash
# Rebuild Quartz notes and copy static output to Math495/garden/ for GitHub Pages (Jekyll).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT/quartz"
npm ci
npx quartz build
cd "$ROOT"
rm -rf Math495/garden
mkdir -p Math495/garden
cp -R quartz/public/* Math495/garden/
mkdir -p Math495/garden/Math495
cp -f Math495/blog*.pdf Math495/garden/Math495/
echo "Built → Math495/garden/ (commit Math495/garden/ when publishing)"
echo "Local preview (wiki links need this — not python -m http.server): node scripts/preview-garden.mjs"
