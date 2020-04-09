alias ..="cd .."
alias ...="cd ../.."
alias ....="cd ../../.."
alias .....="cd ../../../.."

alias sudo='sudo '

alias sbp='source ~/.bash_profile'

# Detect which `ls` flavor is in use
if ls --color > /dev/null 2>&1; then # GNU `ls`
  colorflag="--color"
else # OS X `ls`
  colorflag="-G"
fi

# List all files colorized in long format
alias l="ls -l ${colorflag}"

# List all files colorized in long format, including dot files
alias ll="ls -la ${colorflag}"

# List only directories
alias lsd='ls -l | grep "^d"'

# Always use color output for `ls`
if [[ "$OSTYPE" =~ ^darwin ]]; then
  alias ls="command ls -G"
else
  alias ls="command ls --color"
  export LS_COLORS='no=00:fi=00:di=01;34:ln=01;36:pi=40;33:so=01;35:do=01;35:bd=40;33;01:cd=40;33;01:or=40;31;01:ex=01;32:*.tar=01;31:*.tgz=01;31:*.arj=01;31:*.taz=01;31:*.lzh=01;31:*.zip=01;31:*.z=01;31:*.Z=01;31:*.gz=01;31:*.bz2=01;31:*.deb=01;31:*.rpm=01;31:*.jar=01;31:*.jpg=01;35:*.jpeg=01;35:*.gif=01;35:*.bmp=01;35:*.pbm=01;35:*.pgm=01;35:*.ppm=01;35:*.tga=01;35:*.xbm=01;35:*.xpm=01;35:*.tif=01;35:*.tiff=01;35:*.png=01;35:*.mov=01;35:*.mpg=01;35:*.mpeg=01;35:*.avi=01;35:*.fli=01;35:*.gl=01;35:*.dl=01;35:*.xcf=01;35:*.xwd=01;35:*.ogg=01;35:*.mp3=01;35:*.wav=01;35:'
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
alias gpf='g push -f'
alias gpfn='gpf --no-verify'
alias gco='g co'
alias gcom='g co master'
alias gmr='g mr'
alias grbm='g rebase --preserve-merges origin/master'
alias git-cleanup='. ~/git-cleanup.sh'
alias gpub='g publish'

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
alias bidock="docker-compose run onelife bundle install"
alias rdbm="docker-compose run onelife rails db:migrate RAILS_ENV=development"

alias rc="rails console"
alias zst="zeus start"
alias zs="zeus s"
alias zr="zeus test"

# node
alias upgradenodenv="brew upgrade nodenv node-build"
alias listnodeversions="nodenv install -l"

# npm
alias ni="npm i"
alias ncv="npm cache verify"
alias nt="npm test"

# chrome
alias crd="/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222"

# docker
alias dcr="docker-compose run"
alias debi='docker exec $(docker ps | grep "onelife_onelife_1" | awk "{print $1;}") bundle install'
alias derdbm='docker exec $(docker ps | grep "onelife_onelife_1" | awk "{print $1;}") rails db:migrate RAILS_ENV=development'

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
