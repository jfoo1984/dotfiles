
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias zshr="omz reload"
alias omzr="omz reload"

alias cat="bat"

# Shortcuts
alias o="open ."
alias c="code"

# codecrafters
alias cct="codecrafters test"
alias ccs="codecrafters submit"

# fzf open files
alias preview="fzf --preview 'bat --color \"always\" {}'"

# git
alias gdf='gd'
alias gcn='gc --no-verify'
alias gpf='gpf!'
alias gpn='gp --no-verify'
alias gpfn='gpf --no-verify'
alias gmr='gm'
alias gcopl="gco -- package-lock.json"
alias gcot="gco --theirs"

# File size
alias fs="stat -f \"%z bytes\""

# ncdu - replace du
alias du="ncdu --color dark -rr -x --exclude .git --exclude node_modules"

# node
alias upgradenodenv="brew upgrade nodenv node-build"
alias listnodeversions="nodenv install -l"
alias installnodeversion="~/shell_scripts/install_node_version_with_nodenv.sh"

# prettyping
alias ping='prettyping --nolegend'

# python
alias curvenv="echo $VIRTUAL_ENV"
alias exitvenv="deactivate"

# top
alias top="sudo htop"

# install global deps
alias globaldeps="~/shell_scripts/install_global_deps.sh"
