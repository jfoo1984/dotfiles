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
Vundle is used to manage vim plugins.  To set that up, first checkout Vundle into the appropriate place
```
cd ~
git clone https://github.com/gmarik/Vundle.vim.git .vim/bundle/Vundle.vim
```
Then run the following commands.  You may get some errors running `vim`, but all should be well after `:PluginInstall`
```
    vim
    :PluginInstall
```
Check [Vundle GitHub repo](https://github.com/VundleVim/Vundle.vim) for more details.

## sublimetext
Sublime settings and packages are usually stored in `~/Library/Application Support/Sublime Text 3/Packages/User/`.  The contents of that directory have been moved into this dotfiles folder, and can be used to configure Sublime by creating a symlink
```
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
ln -s ~/dotfiles/Sublime/Packages/User/ User
```

## atom
Coming soon...

## Font
* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

Inspired by [Paul Irish](https://github.com/paulirish/dotfiles), [Mathias Bynens](https://github.com/mathiasbynens/dotfiles/), [Ben Alman](https://github.com/cowboy/dotfiles), and [Max Beatty](https://github.com/maxbeatty/dotfiles)
