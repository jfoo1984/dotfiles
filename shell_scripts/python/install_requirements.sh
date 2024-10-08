#!/bin/bash

# Show current python version
echo "Installing pip packages for Python $(python3 --version)"

# Install pip packages globally
pip install -r ~/shell_scripts/python/global-requirements.txt

echo "pip packages are now set up!"
