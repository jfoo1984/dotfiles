#!/bin/bash
# update-nodejs-interactive.sh

echo "Checking for latest Node.js version..."
latest_version=$(asdf latest nodejs)
current_version=$(asdf current nodejs 2>/dev/null | awk '{print $2}' || echo "none")

echo "Current version: $current_version"
echo "Latest version:  $latest_version"

if [ "$current_version" = "$latest_version" ]; then
    echo "Already using the latest version!"
    exit 0
fi

read -p "Install and switch to $latest_version? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing Node.js $latest_version..."
    asdf install nodejs $latest_version

    echo "Setting as global default..."
    cd ~
    asdf set nodejs $latest_version

    echo "✅ Updated to Node.js $latest_version"
    node --version
else
    echo "Cancelled"
fi
