# region autoenv
export AUTOENV_ENABLE_LEAVE="true"
export AUTOENV_ENV_FILENAME=".autoenv"
export AUTOENV_ENV_LEAVE_FILENAME=".autoenv.leave"

# provides alias to setup an autoenv for virtualenvwrapper
source shell_scripts/python/setup_autoenv_virtualenv.sh
# endregion autoenv

# ohmyzsh .zshrc template https://github.com/ohmyzsh/ohmyzsh/blob/master/templates/zshrc.zsh-template
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME=""

# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/

zstyle ':omz:plugins:eza' 'git-status' yes
zstyle ':omz:plugins:eza' 'header' yes

# Ensure asdf is ready - plugin included for other convenience functions
if [ -z "$ASDF_DIR" ] && [ -f "$HOME/.asdf/asdf.sh" ]; then
  source "$HOME/.asdf/asdf.sh"
fi

# Use asdf-managed Python for virtualenvwrapper
# Must be set before loading virtualenvwrapper
if command -v asdf >/dev/null && asdf which python >/dev/null 2>&1; then
  export VIRTUALENVWRAPPER_PYTHON="$(asdf which python)"
fi

# zsh-autosuggestions installation: https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md#oh-my-zsh
# zsh-history-substring-search: https://github.com/zsh-users/zsh-history-substring-search?tab=readme-ov-file#install
# zsh-syntax-highlighting: https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#oh-my-zsh
plugins=(
  brew
  aliases
  asdf
  bundler
  conda
  docker-compose
  eza
  fzf
  git
  python
  rails
  ruby
  starship
  zoxide
  zsh-autosuggestions
  zsh-history-substring-search
  zsh-interactive-cd
  zsh-syntax-highlighting
  zsh-vi-mode
  virtualenv
  virtualenvwrapper
)

source $ZSH/oh-my-zsh.sh

# autoenv - mainly used to automatically activate and deactivate python virtual environments
source $(brew --prefix autoenv)/activate.sh

# Set language environment
export LANG=en_US.UTF-8

# region history config
# Save the history in your home directory as .zsh_history
export HISTFILE=$HOME/.zsh_history

# Set the history size to 1000 commands
export HISTSIZE=1000

# terminals maintain their own history until closed
unsetopt share_history

# Remove duplicates first when HISTSIZE is met
setopt hist_expire_dups_first

# If a command is issued multiple times in a row, ignore dupes
setopt hist_ignore_dups

# Allow editing the command before executing again
setopt hist_verify

# Do not add commands prefixed with a space to the history
setopt hist_ignore_space

# endregion history config

# zsh-history-substring-search up and down key bindings
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down

export ZOXIDE_CMD_OVERRIDE="cd"

# region fzf file and folder completion
_fzf_compgen_path() {
    fd --hidden --exclude .git . "$1"
}

_fzf_compgen_dir() {
    fd --type=d --hidden --exclude .git . "$1"
}

# show directory tree or file preview when searching with fzf
_fzf_comprun() {
  local command=$1
  shift

  case "$command" in
    cd) fzf --preview 'eza --tree --color=always {} | head -200' "$@" ;;
    export|unset) fzf --preview "eval 'echo \$'{}" "$@" ;;
    ssh) fzf --preview 'dig {}' "$@" ;;
    cat|bat) fzf --preview 'bat -n --color=always {}' "$@" ;;
    *) fzf --preview '$HOME/shell_scripts/fzf-preview.sh {}' "$@" ;;
  esac
 }

# Load ~/shell_script/[aliases,functions]
for file in ~/shell_scripts/{aliases,functions,apitokens,exports,extras}.sh; do
  [ -r "$file" ] && source "$file"
done
unset file
# endregion fzf file and folder completion

# Set terminal tab title to current directory
# https://starship.rs/advanced-config/#change-window-title
function set_win_title(){
    echo -ne "\033]0; $(basename "$PWD") \007"
}
starship_precmd_user_func="set_win_title"

# >>> conda initialize >>>
# !! Contents within this block are managed by 'conda init' !!
# __conda_setup="$('/opt/homebrew/Caskroom/miniconda/base/bin/conda' 'shell.zsh' 'hook' 2> /dev/null)"
# if [ $? -eq 0 ]; then
#     eval "$__conda_setup"
# else
#     if [ -f "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh" ]; then
#         . "/opt/homebrew/Caskroom/miniconda/base/etc/profile.d/conda.sh"
#     else
#         export PATH="/opt/homebrew/Caskroom/miniconda/base/bin:$PATH"
#     fi
# fi
# unset __conda_setup
# <<< conda initialize <<<
