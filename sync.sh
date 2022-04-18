#!/bin/bash
cd "$(dirname "$0")"
git pull

excluded_dirs=(".git/" ".DS_Store" "sync.sh" "README.md" "homebrew/" "Brewfile" "itermColors/")

# build base rsync command with arguments
rsync_command_args=(rsync)

# add excluded dirs in command
for excluded_dir in "${excluded_dirs[@]}"
do
  rsync_command_args+=(--exclude)
  rsync_command_args+=($excluded_dir)
done

rsync_command_args+=(-av)

if [ "$dry_run" = true ] ; then
  rsync_command_args+=(-n)
fi

function dry_run_dot_files_rsync() {
  dry_run_rsync_command=("${rsync_command_args[@]}")
  dry_run_rsync_command+=(-n)

  # sync source
  dry_run_rsync_command+=(.)
  # sync dest
  dry_run_rsync_command+=(~)

  "${dry_run_rsync_command[@]}"
}

function copy_dot_files_to_home_dir() {
  copy_rsync_command=("${rsync_command_args[@]}")

  # sync source
  copy_rsync_command+=(.)
  # sync dest
  copy_rsync_command+=(~)

  "${copy_rsync_command[@]}"
}

if [ "$1" == "--force" -o "$1" == "-f" ]; then
  copy_dot_files_to_home_dir
else
  # dry run to generate file list
  echo -e "\n=== Generating list of files to update ==="
  dry_run_dot_files_rsync

  echo -e "\nWARNING: The files listed above will be overwritten in your home directory."
  read -p "Are you sure you want to continue? (y/n) " -n 1
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    dry_run=false
    echo "\n"
    copy_dot_files_to_home_dir
  fi
fi

echo
unset dry_run_dot_files_rsync
unset copy_dot_files_to_home_dir
