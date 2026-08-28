# Larger bash history (allow 32³ entries; default is 500)
export HISTSIZE=32768
export HISTFILESIZE=$HISTSIZE
export HISTCONTROL=ignoredups
# Make some commands not show up in history
export HISTIGNORE="ls:ls *:cd:cd -:pwd;exit:date:* --help"

# add support for ctrl+o to open selected file in VS Code with fzf
export FZF_DEFAULT_OPTS="--bind='ctrl-o:execute(code {})+abort'"

# user-installed CLIs (uv tools, pipx, pip --user)
export PATH="$HOME/.local/bin:$PATH"

# poetry
export PATH="$HOME/.poetry/bin:$PATH"

# brew doctor
export PATH=$PATH:/usr/local/bin:/usr/local/sbin
