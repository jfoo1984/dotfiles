---
name: review-code
description: Use when you want a multi-lens review of code that already exists or was implemented elsewhere (a working-tree diff, a branch, a PR, or specific files) — no implementation, no commit. Report-only. Runs code-quality + staff-engineer + test-coverage by default, auto-adds frontend/backend/security/deploy-safety by changed paths, adversarial on request. Name specific lenses to scope the review to just those (e.g., a security-only pass).
---

# review-code

**Report-only.** This skill reviews code as it stands — no edits, no staging, no commits.

- Use `review-code` when the code is already written and you want a multi-lens audit.
- For implement-then-review in one pass, use `implement-task-with-review`.

**Invocation examples:**
- "Review this branch" → default selection (code-quality + staff-engineer + test-coverage, plus any auto-added lenses).
- "Run a security review of PR 142" → **single lens**: only `security` runs.
- "Review this with code-quality and frontend" → exactly those two.

Naming any lens (or set of lenses) scopes the run to just those — see Step 2's override rule.

---

## Step 1 — Resolve the target

Determine what to review and produce two artifacts for the lenses: the **changed-file list** and the **diff text** (or file contents).

| Input form | Commands |
|---|---|
| Working tree (unstaged) | `git diff` |
| Working tree (staged) | `git diff --cached` |
| Working tree (all changes) | `git diff HEAD` |
| Branch vs base | `git diff main...HEAD` (substitute the repo's actual default branch); also `git diff <base>...<branch>` for any two refs |
| PR | `gh pr diff <n>` for the diff; `gh pr view <n>` for title, description, and context |
| Explicit files | Review the named paths directly with `Read` |

If the user supplies a PR number, pull both the diff and the PR description — the description often clarifies intent that the diff alone obscures.

---

## Step 2 — Select lenses

**Always run:**
- `code-quality` — line-specific: naming, edge cases, error handling, types, dead code, comments
- `staff-engineer` — architectural: right abstraction, coupling, future-reader surprise, sleep-losers
- `test-coverage` — flags new/changed logic that lacks meaningful tests. Skip only when the diff is docs/config-only (nothing to test).

**Auto-add by what the diff touches (log which fired):**
- `frontend` — components, pages, routes, styles, or client-side state
- `backend` — request handlers, API surfaces, data access, background jobs, or service-to-service calls
- `security` — authentication/authorization, request input parsing, secrets or config, crypto, file/network I/O, deserialization, or dependency manifests
- `deploy-safety` — schema migrations, a serialized wire contract (protobuf/Avro/API schema), or deployment/config values

**Opt-in only:**
- `adversarial` — run when the user asks, or when the diff touches a state machine, a money path, or concurrent/retry-driven logic. State explicitly if adversarial is being skipped and why.

**Override:** if the user names one or more lenses, use exactly that list instead of auto-selection — including a single lens. An explicit list fully replaces the always-run defaults.

**Before dispatching, log:**
```
Selected lenses: <list>
Reason: <which triggers fired / user request / opt-in>
```

---

## Step 3 — Inject project context

The lenses are deliberately stack-neutral — they carry general engineering principles and name no framework or house convention. **Specialization is your job as the consumer.**

Read the repo root `CLAUDE.md`, and the nearest local `CLAUDE.md` **or `AGENTS.md`** to the changed files (both conventions are common; check for either). Pass the relevant rules as context when constructing each lens's dispatch prompt, and tell the lens that those rules are authoritative where they conflict with its general guidance.

If the project ships its own stack lens (e.g. a `backend-go.md` or framework-specific lens in the repo's `.claude/skills/`), prefer it *alongside* the general one — it narrows rather than replaces.

---

## Step 4 — Dispatch lenses

Lens files live in `.claude/skills/review-lenses/lenses/`. For each selected lens:

1. Read the lens file (e.g. `.claude/skills/review-lenses/lenses/code-quality.md`).
2. Construct the dispatch prompt by filling the caller-filled slots under their headings:
   - **Target** — the changed-file list + diff text (or PR URL + diff).
   - **What was implemented** — 3–5 lines of context if known; omit when reviewing arbitrary code.
   - **Already verified** — build/lint status if known; prior lens verdicts when dispatching sequentially.
   - Plus the project rules from Step 3.
3. Dispatch as a subagent: `subagent_type: superpowers-extended-cc:code-reviewer` (fall back to `general-purpose` if unavailable — the lens file carries the whole persona, so the agent only needs read/search tools).
4. Use each lens's stated model default (`sonnet` for code-quality, test-coverage, frontend, backend, deploy-safety; `opus` for staff-engineer, adversarial, security). Model defaults are tier aliases — do not pin a dated id.

Lenses are independent and pure reporters; dispatch them in parallel when possible.

---

## Step 5 — Consolidate and report

Print each lens's full `### Findings` + `### Verdict` block, labelled by lens name.

Then produce a single **Consolidated verdict**:
- De-duplicate findings that multiple lenses raised on the same `file:line` — keep the most specific; note which lenses agreed (e.g., "code-quality + staff-engineer").
- State the overall `✅ / ⚠️ / ❌` verdict with a one-line rationale.

Lenses can be wrong — read the reasoning, not just the verdict. If a finding looks off, say so in the consolidated report rather than forwarding it uncritically.

**Lens gap (optional).** If a lens missed something real, kept flagging a false positive, or relied on a drifted convention, add a one-line `Lens gap:` note — never edit the lens here.

---

## Hard rules

- **Report-only.** This skill never edits, stages, or commits. A reviewer that also edits is harder to trust; consumers that fix (like `implement-task-with-review`) are separate.
- Lens output is input, not gospel. Push back on bad findings and note disagreements in the consolidated report.
- A clean security verdict means "nothing found in this diff" — not "this system is secure." Don't upgrade it into a broader claim.
