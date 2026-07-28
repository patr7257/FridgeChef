#!/usr/bin/env bash
# Creates .env.local with the OpenAI key for local development.
set -euo pipefail
cd "$(cd "$(dirname "$0")/.." && pwd)"

if [ -f .env.local ]; then
  echo ".env.local already exists. Aborting so nothing is overwritten."
  echo "Edit it by hand if the key needs to change."
  exit 0
fi

read -r -s -p "Paste your OpenAI API key (input hidden): " key
echo
if [ -z "$key" ]; then
  echo "No key entered. Aborting."
  exit 0
fi

printf 'OPENAI_API_KEY=%s\n' "$key" > .env.local
echo ".env.local written. Run 'pnpm dev' to start the app."
