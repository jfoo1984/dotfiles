# Global Claude Code Instructions

## Shell Environment Setup

**IMPORTANT**: Always source ~/.zshrc before running shell commands to avoid environment errors (asdf, nvm, etc.):

```bash
source ~/.zshrc && [your command]
```

This ensures proper access to:
- Node.js/npm/yarn via asdf/nvm
- Python environments
- Other development tools managed by shell configuration

### asdf + Legacy Version Files
Your asdf is configured with `legacy_version_file = yes` in `~/.asdfrc`, which means it reads `.nvmrc` files automatically. 

**For projects with .nvmrc files**, ensure the right Node.js version is active by:
```bash
source ~/.zshrc && cd [project_dir] && asdf install && corepack enable && [your command]
```

This handles:
1. Loading your shell environment (asdf, etc.)
2. Installing the Node.js version specified in `.nvmrc` 
3. Enabling corepack for yarn/pnpm
4. Running your command with the correct versions

## Examples

```bash
# Instead of:
yarn check

# Always use:
source ~/.zshrc && yarn check
```

```bash
# For projects with .nvmrc (like virtual-cells-platform):
source ~/.zshrc && cd frontend && asdf install && corepack enable && yarn check

# IMPORTANT: If asdf isn't picking up .nvmrc automatically, use explicit version:
/bin/zsh -c "source ~/.zshrc && cd frontend && ASDF_NODEJS_VERSION=20.16.0 corepack enable && ASDF_NODEJS_VERSION=20.16.0 yarn check"
```

### Troubleshooting Node.js Commands
If Node.js commands fail with "No version is set", use the explicit version approach:
```bash
ASDF_NODEJS_VERSION=20.16.0 [command]
```

This is needed because:
- Claude runs commands in non-interactive shells
- asdf + .nvmrc integration works differently in interactive vs non-interactive shells
- The explicit version ensures commands use the project's required Node.js version