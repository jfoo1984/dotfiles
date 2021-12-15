# iTerm2 tab titles
function title {
    if [ "$1" ]
    then
        export PROMPT_COMMAND='iterm2_preexec_invoke_cmd'
        echo -ne "\033]0;${*}\007"
    else
        export PROMPT_COMMAND='echo -ne "\033]0;${PWD/#$HOME/~}\007";iterm2_preexec_invoke_cmd'
    fi
}

# brew doctor
# export PATH=$PATH:/usr/local/bin:/usr/local/sbin

# Prefer US English and use UTF-8
export LC_ALL="en_US.UTF-8"
export LANG="en_US"

# Load ~/shell_script/[apitokens,prompt,exports,extras,iterm2_config].sh
for file in ~/shell_scripts/{apitokens,prompt,exports,extras,iterm2_config}.sh; do
  [ -r "$file" ] && source "$file"
done
unset file
