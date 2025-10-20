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

### Custom plugins

* [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)
* [zsh-history-substring-search](https://github.com/zsh-users/zsh-history-substring-search)
* [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)
* [zsh-vi-mode](https://github.com/jeffreytse/zsh-vi-mode)
* Install custom plugins:

    ```sh
    git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

    git clone https://github.com/zsh-users/zsh-history-substring-search ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-history-substring-search

    git clone https://github.com/zsh-users/zsh-syntax-highlighting.

    git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

    git clone https://github.com/jeffreytse/zsh-vi-mode \
  $ZSH_CUSTOM/plugins/zsh-vi-mode

    git clone https://github.com/TamCore/autoupdate-oh-my-zsh-plugins $ZSH_CUSTOM/plugins/autoupdate
   ```

* Add these plugins to .zshrc (already done in the repo)

    ```sh
    plugins= (
    ...
    autoupdate
    zsh-autosuggestions
    zsh-history-substring-search
    zsh-syntax-highlighting
    zsh-vi-mode plugin
    ...
    )
    ```

## Prompt

The shell prompt is [configured using Starship](https://starship.rs/config/#prompt)

## Font

* [Source Code Pro](https://github.com/adobe-fonts/source-code-pro)

## asdf

### Install nodejs

```sh
asdf plugin add nodejs

# <version> examples: latest, $(.nvmrc), etc.
asdf install nodejs <version>
```

### Set global Node.js version

After installing Node.js, set a global version for use outside of projects:

```sh
# Set global version (creates/updates ~/.tool-versions)
asdf set -u nodejs 24.1.0  # or whatever version you installed

# Verify it's set
cat ~/.tool-versions
node -v
```

**Important:** Don't include `~/.tool-versions` in your dotfiles repo - it's machine-specific and should be managed per machine.

### Install ruby

```sh
asdf plugin add ruby

# <version> examples: latest, $(.ruby-version), etc.
asdf install ruby <version>
```

### Using yarn

Yarn 2.X and greater is installed per project.  After installing yarn with `corepack enable`, it may be necessary to run `asdf reshim nodejs` to make the yarn executable available.

### Reshimming after npm global installs

After installing global npm packages (like `npm install -g @anthropic-ai/claude-code`), you need to run:

```sh
asdf reshim nodejs
```

This creates shims for the newly installed global binaries so they're available in your PATH.
