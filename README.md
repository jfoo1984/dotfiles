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
### Brewfile - automated installation of homebrew packages
```
brew bundle
```
For more info, visit the [homebrew-bundle page](https://github.com/Homebrew/homebrew-bundle).

## neovim setup

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

May need to create nvim backup dir to prevent errors when saving

```
mkdir ~/.local/share/nvim/backup/
```

## Font
* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

Inspired by [Paul Irish](https://github.com/paulirish/dotfiles), [Mathias Bynens](https://github.com/mathiasbynens/dotfiles/), [Ben Alman](https://github.com/cowboy/dotfiles), and [Max Beatty](https://github.com/maxbeatty/dotfiles)
