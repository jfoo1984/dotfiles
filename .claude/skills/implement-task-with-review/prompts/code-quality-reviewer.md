# Code-Quality Reviewer Prompt Template

Fill the bracketed slots. Use `subagent_type: feature-dev:code-reviewer`. Pass `model: "sonnet"` (rarely needs Opus).

This reviewer's lens is **line-specific**: naming, edge cases, error handling, types, dead code, comment quality. Architectural concerns are the staff-engineer reviewer's job — don't ask this reviewer for both.

```
Code-quality review of [TASK NAME] from the plan at [PLAN FILE PATH].

## Files under review (staged, not committed)

[List the changed files with absolute paths]

`git diff --cached --stat` summary:
[paste from controller]

## What was implemented

[Brief — 3-5 lines max. The implementer's own report is your source of truth here.]

## Already verified (don't re-litigate)

- Implementer invoked `superpowers-extended-cc:verification-before-completion`; verify command exit was clean ([paste final-line / exit code])
- Acceptance criteria status per the implementer: [PASS items]

## Lens

**Line-specific code-quality.** Audit at the file:line level:

- **Naming** — names match what things do (not how they work). Function / variable / file names self-explanatory.
- **Edge cases** — null / undefined / empty / overflow / off-by-one. Boundary conditions the implementer might have missed.
- **Error handling** — explicit and useful (includes context). No silent failures. No catch-and-rethrow-without-context.
- **Types** — tight; no unnecessary escape hatches (e.g. `any`, unsafe casts, bypassing the type system). Follow the project's type conventions.
- **Dead code / unused imports** — anything orphaned by recent changes.
- **Comments** — only where WHY is non-obvious. Code that re-narrates itself in comments is a smell.

**NOT your lens** (skip — staff-engineer reviewer handles these):
- Whether the right abstraction was built
- Long-term maintainability concerns
- Cross-task coupling
- "Should this even exist"

## Severity classification

- **Blocking** — bug, broken contract, type error, missing guard with concrete failure mode. Merging makes the codebase worse.
- **Important** — clarity issue, name confusion, weird coupling, missing-WHY comment. Worth fixing before merge but not catastrophic if missed.
- **Minor / nit** — style preference, marginal improvement. Skip in your output unless you have very few to say.

## Reporting format

Under 400 words.

```
### Findings

- [severity] file:line — issue description + concrete fix suggestion. Include confidence (e.g., "Confidence: 85") for findings where you're not 100% sure.

### What looks good

(Optional — only call out what's genuinely above-the-bar, not everything that's fine.)

### Verdict

✅ Ready as-is | ⚠️ Ready with small fixes | ❌ Needs work
```

Don't summarize the spec back. Just findings.
```

## Filling notes

- Paste `git diff --cached --stat` so the reviewer knows the scope without grepping.
- Include the implementer's verify-command output so the reviewer doesn't have to re-derive whether the build is green.
- The "What was implemented" should be 3-5 lines — anything longer means you're re-doing the implementer's report. The subagent will read the actual code.
