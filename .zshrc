# chruby
source /opt/homebrew/opt/chruby/share/chruby/chruby.sh
# enable auto-switching of Rubies specified by .ruby-version files
source /opt/homebrew/opt/chruby/share/chruby/auto.sh

# Load ~/shell_script/[aliases,functions]
for file in ~/shell_scripts/{aliases,functions}.sh; do
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
