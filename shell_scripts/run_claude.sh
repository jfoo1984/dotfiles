#!/usr/bin/env bash

# Get the latest installed Node.js version via asdf
LATEST_NODE_VERSION=$(asdf list nodejs | tr -d ' ' | grep -E '^[0-9]+\.' | sort -V | tail -n 1)

if [[ -z "$LATEST_NODE_VERSION" ]]; then
  echo "❌ No Node.js versions installed via asdf. Please install one with:"
  echo "   asdf install nodejs <version>"
  exit 1
fi

# Set the version in environment so asdf knows which one to use
export ASDF_NODEJS_VERSION="$LATEST_NODE_VERSION"

# Run Claude using that version of Node
exec asdf exec claude "$@"
