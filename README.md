# dotfiles

## Overview

My config and settings files for MacOS

* (optional) create `~/shell_scripts/apitokens.sh for tokens that you do not want committed to git
* (optional) create .~/shell_scripts/extras.sh for aliases that you do not want committed to git

```sh
    git clone git@github.com:jfoo1984/dotfiles.git && cd dotfiles && ./sync.sh
```

## New computer setup checklist

* [ ] Install [Homebrew](https://brew.sh/)
* [ ] Clone this repo and run `./sync.sh`
* [ ] `brew bundle` to install homebrew packages
* [ ] Set up a password manager
* [ ] Import iterm2 settings

All critical apps should be installed at this point.

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

### zsh-autosuggestions

Install [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions).

```sh
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions
```

### zsh-history-substring-search

Install [zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search).

```sh
 git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search
```

### zsh-syntax-highlighting

Install [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting).

```sh
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

### zsh-vi-mode plugin

Install [zsh-vi-mode](https://github.com/jeffreytse/zsh-vi-mode)

```sh
git clone https://github.com/jeffreytse/zsh-vi-mode \
  $ZSH_CUSTOM/plugins/zsh-vi-mode
```

### Adding these plugins to .zshrc

```sh
plugins= (
  ...
  zsh-autosuggestions
  zsh-history-substring-search
  zsh-syntax-highlighting
  zsh-vi-mode plugin
)
```

## Prompt

The shell prompt is [configured using Starship](https://starship.rs/config/#prompt)

## Font

* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

## asdf

### Using yarn

Yarn 2.X and greater is installed per project.  After installing yarn with `corepack enable`, it may be necessary to run `asdf reshim nodejs` to make the yarn executable available.
