# ohmyzsh .zshrc template https://github.com/ohmyzsh/ohmyzsh/blob/master/templates/zshrc.zsh-template
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME=""

# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/

# zsh-autosuggestions installation: https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md#oh-my-zsh
# zsh-history-substring-search: https://github.com/zsh-users/zsh-history-substring-search?tab=readme-ov-file#install
# zsh-syntax-highlighting: https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md#oh-my-zsh
plugins=(
  aliases
  brew
  bundler
  chruby
  docker-compose
  fd
  git
  rails
  ruby
  zoxide
  zsh-autosuggestions
  zsh-history-substring-search
  zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

# Set language environment
export LANG=en_US.UTF-8

##### HISTORY CONFIG #####
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

##### END HISTORY CONFIG #####

# zsh-history-substring-search up and down key bindings
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down

# fzf
source <(fzf --zsh)

export ZOXIDE_CMD_OVERRIDE="cd"

# fd - use fzf
# _fzf_compgen_path() {
#     fd --hidden --exclude .git . "$1"
# }

# _fzf_compgen_dir() {
#     fd --type=d --hidden --exclude .git . "$1"
# }

# Load ~/shell_script/[aliases,functions]
for file in ~/shell_scripts/{aliases,functions,apitokens,exports,extras}.sh; do
  [ -r "$file" ] && source "$file"
done
unset file

# Load nodenv
eval "$(nodenv init -)"

# Starship - prompt config
eval "$(starship init zsh)"

# Set terminal tab title to current directory
# https://starship.rs/advanced-config/#change-window-title
function set_win_title(){
    echo -ne "\033]0; $(basename "$PWD") \007"
}
starship_precmd_user_func="set_win_title"
