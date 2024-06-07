#!/bin/zsh

# Get the current directory
NODE_VERSION_DIR=$(pwd)

# Change to the target directory (optional if you are already in the current directory)
cd $NODE_VERSION_DIR

# Check if .node-version file exists
if [ ! -f ".node-version" ]; then
  echo "Error: .node-version file is not present in $NODE_VERSION_DIR."
  exit 1
else
  # Read the version from the .node-version file
  NODE_VERSION=$(cat .node-version)
  echo "Installing Node.js version: $NODE_VERSION"

  # Use nodenv to install the specified version
  nodenv install $NODE_VERSION
fi
