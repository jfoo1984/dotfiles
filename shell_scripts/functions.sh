# Create a new directory and enter it
function md() {
  mkdir -p "$@" && cd "$@"
}


# find shorthand
function f() {
    find . -name "$1"
}


# get gzipped size
function gz() {
  echo "orig size    (bytes): "
  cat "$1" | wc -c
  echo "gzipped size (bytes): "
  gzip -c "$1" | wc -c
}


# Syntax-highlight JSON strings or files
function json() {
  if [ -p /dev/stdin ]; then
    # piping, e.g. `echo '{"foo":42}' | json`
    python -mjson.tool | pygmentize -l javascript
  else
    # e.g. `json '{"foo":42}'`
    python -mjson.tool <<< "$*" | pygmentize -l javascript
  fi
}

# polyfill ssh-copy-id for osx expects "user@machine"
function ssh-copy-id() {
    cat ~/.ssh/id_rsa.pub | ssh "$1" "mkdir ~/.ssh; cat >> ~/.ssh/authorized_keys"
}