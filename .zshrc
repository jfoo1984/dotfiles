# ohmyzsh .zshrc template https://github.com/ohmyzsh/ohmyzsh/blob/master/templates/zshrc.zsh-template
# Path to your oh-my-zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME=""

# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
  aliases
  brew
  bundler
  chruby
  git
  rails
  ruby
  docker-compose
)

source $ZSH/oh-my-zsh.sh

# terminals maintain their own history until closed
unsetopt share_history

# User configuration

# Set language environment
export LANG=en_US.UTF-8

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
