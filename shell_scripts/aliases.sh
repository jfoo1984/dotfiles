alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias sudo='sudo '

alias szsh='source ~/.zshrc && source ~/.zshenv'

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

alias cat='bat'

# Shortcuts
alias g="git"
alias v="vim"
alias o="open ."
alias c="code"

# git
alias ga='g add'
alias gb='g br'
alias gdf='g df'
alias gdfc='g dfc'
alias gst='g st'
alias gcm='g cm'
alias gcmnv='g cmnv'
alias gf='g fetch'
alias gfo='g fetch origin'
alias gl='g pull'
alias gp='g push'
alias gpf='gp -f'
alias gpn='gp --no-verify'
alias gpfn='gpf --no-verify'
alias gco='g co'
alias gcom='g co master'
alias gmr='g mr'
alias gmrm='g fetch origin && g mr origin/main'
alias grbm='g fetch origin && g rb origin/master'
alias grbmain='g fetch origin && g rb origin/main'
alias git-cleanup='. ~/git-cleanup.sh'
alias gpub='g publish'
alias gpubf='g publish -f'
alias grs='g rs'
alias grss='g rs --staged'

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

# heroku
alias hk="heroku"

# rails
alias be="bundle exec"
alias bi="bundle install"
alias rc="rails console"
alias zst="zeus start"
alias zs="zeus s"
alias zr="zeus test"

# node
alias upgradenodenv="brew update && brew upgrade nodenv node-build"
alias listnodeversions="nodenv install -l"

# npm
alias ni="npm i"
alias ncv="npm cache verify"
alias nt="npm test"

# chrome
alias crd="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222"

# docker
alias dcb="docker compose build"
alias dce="docker compose exec"
alias dcr="docker compose run"

# docker-sync
alias dss2="docker-sync stop && docker-sync start"

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
