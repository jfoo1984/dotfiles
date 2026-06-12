---
name: implement-task-with-review
description: Use when implementing a single discrete task from a written plan that you want reviewed (code-quality + staff-engineer lenses) before committing. Dispatches an implementer subagent, then two reviewer subagents in sequence, applies fixes, then commits and pushes.
---

# Implement a Plan Task with Review

Three subagent dispatches per task: implementer → code-quality reviewer → staff-engineer reviewer. Then apply fixes → verify → format → commit → push → mark complete.

Use `prompts/implementer.md`, `prompts/code-quality-reviewer.md`, `prompts/staff-engineer-reviewer.md` — they bake in the discipline that matters.

## When to use

- A plan file exists with bounded, mostly-independent tasks
- Each task should clear review before commit (not at PR time)
- The work isn't trivial enough to do directly without a subagent

Skip and just do the work for 1-3 line edits or rote renames.

## Critical rules

**Honor project-local conventions.** Read the project's CLAUDE.md / AGENTS.md before dispatching. Inject anything relevant into the implementer's prompt verbatim — the subagent has no other access to those rules. Common items: don't auto-commit, named-export preferences, display conventions (em-dash for missing values), specific verify-command form, dev-container wrappers for build tools.

**Implementer uses existing discipline skills.** The implementer prompt **mandates** `superpowers-extended-cc:verification-before-completion` (never claim DONE without running the verify command + confirming clean output) and recommends `superpowers-extended-cc:test-driven-development` when the task has non-trivial logic. This avoids re-encoding that discipline in the prompt.

**Run formatters on changed files only.** Never invoke a repo-wide formatter (`prettier --write **/*`) as a pre-commit step — monorepos accumulate cross-package drift and a blanket format pulls hundreds of unrelated files into the diff. Use:

```bash
git diff --name-only HEAD --diff-filter=ACMR -- <globs> \
  | xargs --no-run-if-empty <formatter> --write
```

**Don't skip the reviewers because the implementer reports DONE.** Implementer self-review is not enough — that's why the reviewer dispatches exist.

## Model selection

Pass `model: "sonnet"` or `model: "opus"` to the Agent tool per dispatch. Defaults:

| Subagent | Default | Bump to Opus when |
|---|---|---|
| Implementer | sonnet | Multi-file coordination, parsers / validators / state machines, or any task where the plan leaves real design judgment to the implementer |
| Code-quality reviewer | sonnet | Rarely — line-specific bug-finding is Sonnet's sweet spot |
| Staff-engineer reviewer | **opus** | Always — architectural judgment, future-trap detection, and "would I lose sleep over this" benefit meaningfully from the stronger model |

Global default: Claude Code has settings (settings.json + possibly env vars) that set a default subagent model. Check the Claude Code docs for the current key name; per-dispatch `model` parameter overrides whatever the global default is and is the most reliable lever.

Never use Haiku for any role here — the tasks are too judgment-heavy.

## Decision rules

**Inline fix vs. re-dispatch implementer:**
- Rename, typo, error message, dead code, simple missing guard → inline
- Wrong abstraction, wrong file structure, multi-file coordinated change → re-dispatch
- Design choice with multiple valid options → surface to user, get a decision, then inline

**Sequential vs. parallel reviewers:** default sequential (code-quality first, then staff). Parallel only when implementation is unambiguously done — saves wall-clock at the cost of potentially-redundant work if code-quality fixes change what staff would see.

**What "blocking" means:**
- Code-quality blocking: bug, broken contract, type error, missing guard with concrete failure mode
- Staff blocking: structural debt that traps future work
- Rule of thumb: a teammate seeing this tomorrow says "wait, why...?" → important. You'd merge as-is without losing sleep → not blocking.

## Steps

1. **Read the task.** From the plan file, extract: goal, files, acceptance criteria, verify command, notes. If the task spans unrelated concerns, ask the user to split before proceeding.
2. **Dispatch implementer** via Agent tool with `subagent_type: general-purpose`, prompt from `prompts/implementer.md`. Fill the slots.
3. **Handle the implementer's report.** DONE → proceed. BLOCKED → diagnose root cause (missing context? more capable model needed? task ill-defined?) and act accordingly. NEEDS_CONTEXT → answer + re-dispatch.
4. **Dispatch code-quality reviewer** via Agent tool with `subagent_type: feature-dev:code-reviewer`, prompt from `prompts/code-quality-reviewer.md`. Apply blocking + important fixes per decision rules.
5. **Dispatch staff-engineer reviewer** via Agent tool with `subagent_type: feature-dev:code-reviewer`, prompt from `prompts/staff-engineer-reviewer.md`. Same fix-apply pattern. Forward-looking concerns often belong in "open follow-ups" rather than the current task.
6. **Verify.** Run the project's typecheck / lint / build. Fix anything that fails — not a separate review pass.
7. **Format.** Targeted on changed files only (see Critical rules).
8. **Commit + push.** Stage only the task's intended files (formatter / build may have touched unrelated drift — discard with `git restore` first). Match the project's commit-message convention. Don't force-push; if remote has bot-added commits, `git pull --rebase && git push`.
9. **Mark complete** via TodoWrite / TaskUpdate.

## Relation to other skills

Slimmed variant of **superpowers-extended-cc:subagent-driven-development** with two opinions baked in:
- Two reviewers instead of three — drops the dedicated spec-compliance pass (the implementer's self-report under `verification-before-completion` + the two reviewers' lenses cover spec drift in practice)
- Targeted formatter as a hard rule

Use that broader skill if you want spec compliance as a separate gate. Use **superpowers-extended-cc:writing-plans** to author the plan this skill executes against.

## Anti-patterns

- Auto-committing because reviewers passed — check user preferences first
- Force-pushing to recover from bot-added remote commits — rebase instead
- Running repo-wide formatters pre-commit — see Critical rules
- Treating reviewer output as a checklist — reviewers can be wrong; read reasoning, push back when you disagree, document why
- Dispatching the implementer before reading the plan — you'll miss the gotchas the plan baked in
- Allowing the implementer to claim DONE without invoking `verification-before-completion`
