function setup_autoenv_virtualenv() {
  # Ensure virtualenvwrapper is loaded
  if ! command -v mkvirtualenv >/dev/null 2>&1; then
    echo "⚠️ virtualenvwrapper is not loaded. Make sure it's installed and sourced."
    return 1
  fi

  local project_dir="${1:-$(basename "$PWD")}"

  # Get Python path via asdf or fallback
  local python_path
  if command -v asdf >/dev/null 2>&1 && asdf which python >/dev/null 2>&1; then
    python_path="$(asdf which python)"
    echo "using asdf: $python_path"
  else
    python_path="$(command -v python3)"
    echo "using system: $python_path"
  fi

  # Create virtualenv if not already created
  if ! workon "$project_dir" &>/dev/null; then
    mkvirtualenv -p "$python_path" "$project_dir"
    echo "Created virtualenv '$project_dir' with python at $python_path"
  else
    echo "Virtualenv '$project_dir' already exists. Activating it."
    workon "$project_dir"
  fi

  # Create autoenv files
  cat <<EOF > .autoenv
echo "Activating virtualenv $project_dir"
workon $project_dir
EOF

  cat <<EOF > .autoenv.leave
echo "Deactivating virtualenv $project_dir"
if type deactivate >/dev/null 2>&1; then
  deactivate
else
  echo "No virtualenv to deactivate"
fi
EOF

  echo "✅ Created .autoenv and .autoenv.leave for project '$project_dir'"
}
