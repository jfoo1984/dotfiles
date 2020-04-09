# dotfiles
## Overview
My config and settings files for OS X
Fork, then update the following with your personal directories/usernames/URLs:
* .bashrc (home path)
* .bash_prompt
* .gitconfig
* (optional) create `~/shell_scripts/apitokens.sh for tokens that you do not want committed to git
* (optional) create .~/shell_scripts/extras.sh for aliases that you do not want committed to git
```
    git clone git@github.com:jfoo1984/dotfiles.git && cd dotfiles && ./sync.sh
```

## Homebrew
### Brewfile
```
brew tap homebrew/bundle
brew bundle
```
For more info, visit the [homebrew-bundle page](https://github.com/Homebrew/homebrew-bundle).

## .vim

With python3 installed, install nvim python3 interface for nvim
```
pip3 install --user pynvim
```

Install [`dein.vim` plugin manager](https://github.com/Shougo/dein.vim)
```
curl https://raw.githubusercontent.com/Shougo/dein.vim/master/bin/installer.sh > installer.sh
# For example, we just use `~/.cache/dein` as installation directory
sh ./installer.sh ~/.cache/dein
```

## sublimetext
Sublime settings and packages are usually stored in `~/Library/Application Support/Sublime Text 3/Packages/User/`.  The contents of that directory have been moved into this dotfiles folder, and can be used to configure Sublime by creating a symlink
```
cd ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/
ln -s ~/dotfiles/Sublime/Packages/User/ User
```

## code
VS code settings and extensions synced via plug-in [Settings Sync](https://marketplace.visualstudio.com/items?itemName=Shan.code-settings-sync)


## Font
* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

Inspired by [Paul Irish](https://github.com/paulirish/dotfiles), [Mathias Bynens](https://github.com/mathiasbynens/dotfiles/), [Ben Alman](https://github.com/cowboy/dotfiles), and [Max Beatty](https://github.com/maxbeatty/dotfiles)
