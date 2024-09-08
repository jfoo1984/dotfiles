
alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias zshr="omz reload"
alias omzr="omz reload"

alias cat="bat"

# Shortcuts
alias v="vim"
alias o="open ."
alias c="code"

# git
alias gdf='gd'
alias gcn='gc --no-verify'
alias gpf='gpf!'
alias gpn='gp --no-verify'
alias gpfn='gpf --no-verify'
alias gmr='gm'

# File size
alias fs="stat -f \"%z bytes\""

# programs
alias kn='killall -9 node'

alias ip="dig +short myip.opendns.com @resolver1.opendns.com"
alias localip="ipconfig getifaddr en1"
alias ips="ifconfig -a | grep -o 'inet6\? \(\([0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+\)\|[a-fA-F0-9:]\+\)' | sed -e 's/inet6* //'"

# node
alias upgradenodenv="brew upgrade nodenv node-build"
alias listnodeversions="nodenv install -l"
alias installnodeversion="~/shell_scripts/install_node_version_with_nodenv.sh"

# prettyping
alias ping='prettyping --nolegend'

# fzf open files
alias preview="fzf --preview 'bat --color \"always\" {}'"

# top
alias top="sudo htop"

# ncdu - replace du
alias du="ncdu --color dark -rr -x --exclude .git --exclude node_modules"

# misc
alias gcopl="gco -- package-lock.json"

# codecrafters
alias cct="codecrafters test"
alias ccs="codecrafters submit"
