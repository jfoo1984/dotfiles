function setup_autoenv_virtualenv() {
  # Ensure virtualenvwrapper is loaded
  if ! command -v mkvirtualenv >/dev/null 2>&1; then
    echo "⚠️ virtualenvwrapper is not loaded. Make sure it's installed and sourced."
    return 1
  fi

  local force=0
  local project_dir

  # Parse --force
  if [[ "$1" == "--force" ]]; then
    force=1
    shift
  fi

  project_dir="${1:-$(basename "$PWD")}"

  # Get Python path via asdf or fallback
  local python_path
  if command -v asdf >/dev/null 2>&1 && asdf which python >/dev/null 2>&1; then
    python_path="$(asdf which python)"
    echo "using asdf python: $python_path"
  else
    python_path="$(command -v python3)"
    echo "using system python: $python_path"
  fi

  # Create virtualenv if not already created
  if ! workon "$project_dir" &>/dev/null; then
    mkvirtualenv -p "$python_path" "$project_dir"
    echo "Created virtualenv '$project_dir' with python at $python_path"
  else
    echo "Virtualenv '$project_dir' already exists. Activating it."
    workon "$project_dir"
  fi

  # Create or update .autoenv
  if [[ "$force" -eq 1 || ! -f .autoenv ]]; then
  cat <<EOF > .autoenv
echo "Activating virtualenv $project_dir"
workon $project_dir
EOF
  fi

  # Create or update .autoenv.leave
  if [[ "$force" -eq 1 || ! -f .autoenv.leave ]]; then
  cat <<EOF > .autoenv.leave
echo "Leaving virtualenv $project_dir"

if [[ -n "\$VIRTUAL_ENV" ]]; then
  echo "Deactivating active virtualenv: \$VIRTUAL_ENV"
  deactivate
else
  echo "Virtualenv already deactivated or not active — skipping"
fi
EOF
  fi

  echo "✅ Created .autoenv and .autoenv.leave for project '$project_dir'"
}
