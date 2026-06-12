# Global Claude Code Instructions

**⚠️ IMPORTANT**: This file is managed in `~/dotfiles/.claude/CLAUDE.md` and synced to `~/.claude/CLAUDE.md`.
**Always edit the version in `~/dotfiles/.claude/CLAUDE.md`**, then run `~/dotfiles/sync.sh` to apply changes.
Editing `~/.claude/CLAUDE.md` directly will be overwritten on the next sync.

## Shell Environment Setup

### Prefer dev containers when the project provides one

If the project's `CLAUDE.md` describes a dev container (e.g., names a Docker container and a `/workspace/...` mount), run language/tool commands **inside the container** rather than on the host. The container already has the full toolchain set up — no shell sourcing required, and it matches CI behavior.

Pattern:
```bash
docker exec -w /workspace/<subpath> <container_name> <command>
```

The container's `$GOPATH/pkg/mod`, `node_modules`, etc. are separate from the host's — so the first run in the container may download modules. Subsequent runs are cached and usually as fast as (or faster than) host-with-sourced-zsh.

### Fallback: source ~/.zshrc when no container is available

For projects that don't have a dev container, source `~/.zshrc` before running shell commands to avoid environment errors (asdf, nvm, etc.):

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

## Working Style Preferences

### Comments

Prefer brief, plain-language comments. Multi-paragraph code comments are
usually over-commenting; aim for 1-3 lines.

- No plan-doc / ticket / PR references inside code — the plan rots, the
  code reader doesn't have it open. Explain the *what* and *why* directly.
- No personnel attribution — "Sam said X", "Ian flagged Y", "per
  product" — that history belongs in commit messages, PR descriptions,
  or Linear tickets, not the source. The reader has neither the
  context nor the relationship that made the attribution meaningful.
- Avoid jargon when a familiar verb works ("returned as eligible" not
  "claimed", "no provider could resolve" not "the row went unmatched").
- Claims about third-party API behavior must be sourced — an observed
  response or the vendor's docs. Otherwise drop the claim or mark it
  ("observed, not documented"). Unverified inferences read as facts.
- Trim restatements of what the code already says. Multi-line is fine
  when explaining a non-obvious WHY: a hidden constraint, an invariant
  that's easy to miss, or a cross-file contract.

### Existing patterns first

Before introducing a new pattern (lint suppression, feature-flag semantic,
dep, architectural concept, file convention), grep the codebase for prior
art. If something similar exists, use it. If genuinely new, surface the
trade-off and confirm before proceeding rather than picking unilaterally.

### Don't anticipate

Resist adding code paths for hypothetical edge cases or unobserved usage
patterns. If real production data, an incident, or a concrete ask hasn't
surfaced the need, fall through with sensible defaults (pass the raw
value, take the obvious branch, throw the loud error) and revisit when
evidence arrives.

Examples of premature generality to avoid: lookup-table entries for
upstream values that haven't been observed, optional config knobs "just
in case", error-handling branches for failure modes the runtime can't
actually produce, hooks that abstract over a single caller. The cost of
speculative paths compounds across maintenance reads; the cost of
waiting is one tight PR when the real case appears.

### Restructure over renaming

When a name needs a negative qualifier, the control structure is usually
the problem, not the name — prefer early `continue` / `return` so the
remaining value can be named for what it positively is.

### Reviewing others' PRs

- Comment in a suggesting/questioning tone, not directives — "is this
  intentional?" over "you should change this". Trim flow walk-throughs;
  highlight the issue and trust the author to trace the details.
- Check existing bot/human comments before posting; reply in-thread or
  +1 rather than duplicating a finding someone already raised.
- Default to approving when my comments are non-blocking — don't make
  the author wait on a re-review. Exception: hold off when another
  reviewer has a substantive unresolved thread (e.g., an architectural
  objection); my approval would unblock merging past a discussion that
  isn't mine to waive.
