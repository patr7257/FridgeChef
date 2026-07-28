#!/usr/bin/env bash
# Adds OPENAI_API_KEY to .env.local for local development.
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

if [ -f .env.local ] && grep -q '^OPENAI_API_KEY=' .env.local; then
  echo "OPENAI_API_KEY is already set in .env.local. Aborting so nothing is overwritten."
  echo "Edit .env.local by hand if the key needs to change."
  exit 0
fi

read -r -s -p "Paste your OpenAI API key (input hidden): " key
echo
if [ -z "$key" ]; then
  echo "No key entered. Aborting."
  exit 0
fi

printf 'OPENAI_API_KEY=%s\n' "$key" >> .env.local
echo "OPENAI_API_KEY added to .env.local. Run 'pnpm dev' to start the app."
