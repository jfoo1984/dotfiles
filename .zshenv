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
for file in ~/shell_scripts/{apitokens,exports,extras,iterm2_config}.sh; do
  [ -r "$file" ] && source "$file"
done
unset file

# from brew info openssl
# If you need to have openssl@3 first in your PATH
export PATH="/opt/homebrew/opt/openssl@3/bin:$PATH"

# For compilers to find openssl@3 you may need to set:
export LDFLAGS="-L/opt/homebrew/opt/openssl@3/lib"
export CPPFLAGS="-I/opt/homebrew/opt/openssl@3/include"

# Prevent not available on arm64 errors when installing Chromium
# https://github.com/puppeteer/puppeteer/issues/7740
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=`which chromium`
