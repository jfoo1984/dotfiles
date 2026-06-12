# Set the terminal tab/window title to the basename of $PWD.
# Hooked into starship's pre-prompt callback so the title updates
# every time the prompt fires (e.g. after cd).
# https://starship.rs/advanced-config/#change-window-title
function set_win_title() {
  echo -ne "\033]0; $(basename "$PWD") \007"
}
starship_precmd_user_func="set_win_title"
