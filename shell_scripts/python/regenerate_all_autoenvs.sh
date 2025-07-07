function regenerate_all_autoenvs() {
  for env_dir in "$WORKON_HOME"/*; do
    local env_name=$(basename "$env_dir")

    # Try to find the project directory by name in common places
    for location in ~/code ~/projects ~/dev ~; do
      local project_path="$location/$env_name"
      if [[ -d "$project_path" && -f "$project_path/.python-version" || -d "$project_path/.git" ]]; then
        echo "🔁 Regenerating .autoenv files in $project_path"
        (
          cd "$project_path" && setup_autoenv_virtualenv --force
        )
        break
      fi
    done
  done
}
