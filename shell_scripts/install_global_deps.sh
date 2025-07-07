#!/usr/bin/env bash
set -euo pipefail

echo "📦 Installing global Node.js CLIs..."
npm install -g claude

echo "🔧 Enabling Corepack..."
corepack enable
corepack prepare yarn@stable --activate

echo "🔄 Reshimming Node tools in asdf..."
asdf reshim nodejs

echo "✅ Done. Global CLIs and shims ready!"
