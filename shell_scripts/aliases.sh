alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias szsh="source ~/.zshrc"

# List all files
alias l="ls -l"

# List all files
alias ll="ls -lha"

# List only directories
alias lsd='ls -l | grep "^d"'

# Always use color output for `ls`
if [[ "$OSTYPE" =~ ^darwin ]]; then
  alias ls="ls -G"
fi

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

# Recursively delete `.DS_Store` files
alias cleanup="find . -name '*.DS_Store' -type f -ls -delete"

# File size
alias fs="stat -f \"%z bytes\""

# Hide/show all desktop icons (useful when presenting)
alias hidedesktop="defaults write com.apple.finder CreateDesktop -bool false && killall Finder"
alias showdesktop="defaults write com.apple.finder CreateDesktop -bool true && killall Finder"

# programs
alias kn='killall -9 node'
alias kj='killall -9 java'

alias ip="dig +short myip.opendns.com @resolver1.opendns.com"
alias localip="ipconfig getifaddr en1"
alias ips="ifconfig -a | grep -o 'inet6\? \(\([0-9]\+\.[0-9]\+\.[0-9]\+\.[0-9]\+\)\|[a-fA-F0-9:]\+\)' | sed -e 's/inet6* //'"

# node
alias upgradenodenv="brew upgrade nodenv node-build"
alias listnodeversions="nodenv install -l"

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
