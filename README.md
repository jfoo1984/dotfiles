# dotfiles

## Overview

My config and settings files for OS X

* (optional) create `~/shell_scripts/apitokens.sh for tokens that you do not want committed to git
* (optional) create .~/shell_scripts/extras.sh for aliases that you do not want committed to git

```sh
    git clone git@github.com:jfoo1984/dotfiles.git && cd dotfiles && ./sync.sh
```

## Homebrew

### Brewfile - automated installation of homebrew packages

```sh
brew bundle
```

For more info, visit the [homebrew-bundle page](https://github.com/Homebrew/homebrew-bundle).

## oh-my-zsh

[oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) is a framework for managing zsh configuration.  It needs to [be installed](https://github.com/ohmyzsh/ohmyzsh?tab=readme-ov-file#basic-installation) with the following command:

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### zsh-vi-mode plugin

[zsh-vi-mode](https://github.com/jeffreytse/zsh-vi-mode) is a vim mode plugin for zsh, which can be [installed as a custom oh-my-zsh plugin](https://github.com/jeffreytse/zsh-vi-mode?tab=readme-ov-file#as-an-oh-my-zsh-custom-plugin).

```sh
git clone https://github.com/jeffreytse/zsh-vi-mode \
  $ZSH_CUSTOM/plugins/zsh-vi-mode
```

Then load as a plugin in `.zshrc`:

```sh
plugins+=(zsh-vi-mode)
```

## Prompt

The shell prompt is [configured using Starship](https://starship.rs/config/#prompt)

## neovim setup

With python3 installed, install nvim python3 interface for nvim

```sh
pip3 install --user pynvim
```

Install [`dein.vim` plugin manager](https://github.com/Shougo/dein.vim)

```sh
curl https://raw.githubusercontent.com/Shougo/dein.vim/master/bin/installer.sh > installer.sh
# For example, we just use `~/.cache/dein` as installation directory
sh ./installer.sh ~/.cache/dein
```

May need to create nvim backup dir to prevent errors when saving

```sh
mkdir ~/.local/share/nvim/backup/
```

## Font

* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

Inspired by [Paul Irish](https://github.com/paulirish/dotfiles), [Mathias Bynens](https://github.com/mathiasbynens/dotfiles/), [Ben Alman](https://github.com/cowboy/dotfiles), and [Max Beatty](https://github.com/maxbeatty/dotfiles)
