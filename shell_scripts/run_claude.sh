#!/usr/bin/env bash

# Get the latest installed Node.js version to run Claude itself
LATEST_NODE_VERSION=$(asdf list nodejs | tr -d ' ' | grep -E '^[0-9]+\.' | sort -V | tail -n 1)

if [[ -z "$LATEST_NODE_VERSION" ]]; then
  echo "❌ No Node.js versions installed via asdf. Please install one with:"
  echo "   asdf install nodejs <version>"
  exit 1
fi

# Run Claude with the latest Node.js version (only affects this command)
# Don't use 'exec' so ASDF_NODEJS_VERSION is properly inherited by asdf
ASDF_NODEJS_VERSION="$LATEST_NODE_VERSION" asdf exec claude "$@"
