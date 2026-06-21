# claude-agent-prompts — personal reference archive

A snapshot of agent review prompts (review lenses + the skills that consume them).

**This is reference only — it is NOT deployed.** `sync.sh` excludes
`claude-agent-prompts/`, so nothing here is rsynced into `~` and nothing
becomes an active Claude Code skill. Keeping it out of `~/.claude/skills/`
avoids shadowing the live versions.

**Source of truth lives in the upstream work repo**, not here:
`.claude/skills/{review-lenses,review-code,implement-task-with-review}`.
That repo copy is what teammates and agents actually load. Refresh this archive
from there when you want an updated personal copy.

## Contents

- `review-lenses/` — shared lens library: `README.md` contract + lenses
  (`code-quality`, `staff-engineer`, `adversarial`, `frontend`, `backend-go`).
  Lenses are pure reporters; consumers decide what to do with the report.
- `review-code/` — standalone report-only multi-lens review skill.
- `implement-task-with-review/` — implement → review (shared lenses) → fix →
  commit. Retired as a global skill; lives in the upstream work repo now.
