# dotfiles
## Overview
My config and settings files for OS X
Fork, then update the following with your personal directories/usernames/URLs:
* .bashrc (home path)
* .bash_prompt
* .gitconfig
* If desired, create .apitokens for tokens that you don't want commited to git
```
    git clone git@github.com:jfoo1984/dotfiles.git && cd dotfiles && ./sync.sh
```

## .vim 
Vundle is used to manage vim plugins, and is included as a submodule at .vim/bundle/Vundle.vim.
To get that set up correctly, run 
```
    git submodule init
    git submodule update
```

The packages that Vundle installs are listed in the .vimrc, but the repositories for those packages are not included here.  To get all the desired bundles installed,
```
    vim
    :PluginInstall
```
Check [Vundle GitHub repo](https://github.com/VundleVim/Vundle.vim) for more details.

Inspired by [Paul Irish](https://github.com/paulirish/dotfiles), [Mathias Bynens](https://github.com/mathiasbynens/dotfiles/), [Ben Alman](https://github.com/cowboy/dotfiles), and [Max Beatty](https://github.com/maxbeatty/dotfiles)
