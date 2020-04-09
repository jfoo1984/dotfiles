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

# thefuck
if [[ "$unamestr" != 'Linux' ]]; then
    eval "$(thefuck --alias)"
fi

# chruby
source /usr/local/share/chruby/chruby.sh
source /usr/local/share/chruby/auto.sh

# brew doctor
export PATH=$PATH:/usr/local/bin:/usr/local/sbin

# add qt to path, needed for capybara
export PATH="$PATH:$(brew --prefix qt)/bin"

# Load ~/shell_script/[.extras,.bash_prompt,.exports,.aliases,~/.functions]
# ~/.extras can be used for settings you don’t want to commit
# ~/.apitokens can be used for takens you don't want to commit
for file in ~/shell_scripts/{apitokens,aliases,bash_prompt,exports,extras,functions,iterm2_config}.sh; do
  [ -r "$file" ] && source "$file"
done
unset file

# Load nodenv
eval "$(nodenv init -)"

unamestr=`uname`
if [[ "$unamestr" != 'Linux' ]]; then
    if [ -f `brew --prefix`/etc/bash_completion ]; then
        . `brew --prefix`/etc/bash_completion
    fi
fi

# Prefer US English and use UTF-8
export LC_ALL="en_US.UTF-8"
export LANG="en_US"

# Add tab completion for SSH hostnames based on ~/.ssh/config, ignoring wildcards
[ -e "$HOME/.ssh/config" ] && complete -o "default" -o "nospace" -W "$(grep "^Host" ~/.ssh/config | grep -v "[?*]" | cut -d " " -f2)" scp sftp ssh

# brew completion
[ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
complete -W "NSGlobalDomain" defaults

# added by Miniconda3 4.5.12 installer
# >>> conda init >>>
# !! Contents within this block are managed by 'conda init' !!
__conda_setup="$(CONDA_REPORT_ERRORS=false '~/miniconda3/bin/conda' shell.bash hook 2> /dev/null)"
if [ $? -eq 0 ]; then
    \eval "$__conda_setup"
else
    if [ -f "~/miniconda3/etc/profile.d/conda.sh" ]; then
        . "~/miniconda3/etc/profile.d/conda.sh"
        CONDA_CHANGEPS1=false conda activate base
    else
        \export PATH="~/miniconda3/bin:$PATH"
    fi
fi
unset __conda_setup
# <<< conda init <<<
