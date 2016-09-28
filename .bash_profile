# override cd to execute custom stuff when called
function cd() {
  builtin cd "$1"
  if [ -a ".nvmrc" ]; then
    nvm use
    if [ $? -eq 1 ]; then
      nvm install && nvm use
    fi
  fi
}

# Load ~/.extra, ~/.bash_prompt, ~/.exports, ~/.aliases and ~/.functions
# ~/.extra can be used for settings you don’t want to commit
for file in ~/.{extra,bash_prompt,exports,aliases,functions,apitokens}; do
  [ -r "$file" ] && source "$file"
done
unset file

# ruby version manager
[[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*

# node version manager
[[ -s $HOME/.nvm/nvm.sh ]] && . $HOME/.nvm/nvm.sh
[[ -r $NVM_DIR/bash_completion ]] && . $NVM_DIR/bash_completion

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

# Add tab completion for `defaults read|write NSGlobalDomain`
# You could just use `-g` instead, but I like being explicit
complete -W "NSGlobalDomain" defaults
# No Ruby installed
# eval "$(rbenv init -)"

# Docker 
$(boot2docker shellinit 2> /dev/null)

# CPAN
PATH="/Users/jfu/perl5/bin${PATH+:}${PATH}"; export PATH;
PERL5LIB="/Users/jfu/perl5/lib/perl5${PERL5LIB+:}${PERL5LIB}"; export PERL5LIB;
PERL_LOCAL_LIB_ROOT="/Users/jfu/perl5${PERL_LOCAL_LIB_ROOT+:}${PERL_LOCAL_LIB_ROOT}"; export PERL_LOCAL_LIB_ROOT;
PERL_MB_OPT="--install_base \"/Users/jfu/perl5\""; export PERL_MB_OPT;
PERL_MM_OPT="INSTALL_BASE=/Users/jfu/perl5"; export PERL_MM_OPT;

# thefuck
if [[ "$unamestr" != 'Linux' ]]; then
    eval "$(thefuck --alias)"
fi

# PHP Switcher script for web dev env - https://getgrav.org/blog/mac-os-x-apache-setup-multiple-php-versions
# export PATH=/usr/local/bin:/usr/local/sbin:$PATH:/Users/jfu/bin
export PATH="/usr/local/sbin:$PATH"
