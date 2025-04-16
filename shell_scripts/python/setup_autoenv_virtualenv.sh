#!/bin/bash

source ~/shell_scripts/python/virtualenvwrapper_setup.sh

# Ensure virtualenvwrapper is loaded
if [[ -z "$(command -v mkvirtualenv)" ]]; then
  echo "virtualenvwrapper is not loaded. Please ensure it is installed and sourced in your shell."
  exit 1
fi

# Get the project directory name (same as the environment name)
project_dir=$(basename "$(pwd)")

# Create a virtual environment using virtualenvwrapper, named after the project directory
if ! workon "$project_dir" &> /dev/null; then
  mkvirtualenv "$project_dir"
  echo "Created virtual environment: $project_dir"
else
  echo "Virtual environment '$project_dir' already exists. Activating it."
fi

$auto_env
# Create the .env file with the command to activate the virtualenv
cat <<EOF > $AUTOENV_ENV_FILENAME
echo "Activating virtualenv $project_dir"
workon $project_dir
EOF

# Create the .env.leave file with the deactivate command
cat <<EOF > $AUTOENV_ENV_LEAVE_FILENAME
echo "Deactivating virtualenv $project_dir"
if type deactivate >/dev/null 2>&1; then
    deactivate
else
    echo "No virtualenv to deactivate"
fi
EOF

echo "'$AUTOENV_ENV_FILENAME' and '$AUTOENV_ENV_LEAVE_FILENAME' files created for project '$project_dir'"
