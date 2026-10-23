# Coding Standards

Rules for writing code in this codebase. Some are enforced by ESLint (`pnpm run lint`, configured in `eslint.config.js`). The rest are conventions we follow by hand. Each rule below says which it is.

CI runs `pnpm run lint`, `pnpm run prettier:check`, `pnpm run typecheck`, and `pnpm run test` on every push, and fails if any of them fail. Run `pnpm run lint:fix` and `pnpm run prettier` to fix most problems automatically.

---

### Use `type`, not `interface`

```ts
// Bad
interface Foo { name: string }

// Good
type Foo = { name: string }
```

**Rationale:** Consistency. The codebase uses `type` everywhere, and `interface` introduces a second way to do the same thing.

**Enforcement:** linted, via `@typescript-eslint/consistent-type-definitions`.

---

### Use plain objects instead of `Map`

```ts
// Bad
const lookup = new Map<string, number>();

// Good
const lookup: Record<string, number> = {};
```

**Rationale:** Plain objects serialize cleanly to JSON, which matters for API responses, and they are simpler to work with. `JSON.stringify` turns a `Map` into `{}`.

**Enforcement:** linted. `no-restricted-syntax` bans `new Map()`, and `@typescript-eslint/no-restricted-types` bans the `Map` type.

---

### No dynamic imports

```ts
// Bad
const module = await import("@/backend/lib/foo.js");

// Good
import { foo } from "@/backend/lib/foo.js";
```

**Rationale:** Dynamic imports break static analysis and make the dependency graph harder to reason about.

**Enforcement:** linted. `no-restricted-syntax` bans `import()` expressions.

---

### Prefer `const` over `let`

```ts
// Bad
let name = "Alice";
// name is never reassigned

// Good
const name = "Alice";
```

**Rationale:** `const` signals that a value will not change, so there is less to track while reading.

**Enforcement:** linted, via `prefer-const`.

---

### Keep functions short

The linter caps a function at 150 lines, but aim well below that. If a function is getting long, break it into smaller, focused functions. Blank lines and comments don't count toward the limit.

**Rationale:** Long functions are hard to understand, test, and modify. Smaller functions with clear names serve as documentation.

**Enforcement:** linted, via `max-lines-per-function`. Test files are exempt.

---

### Keep files short

The linter caps a file at 1250 lines. If a file is approaching that, split it into smaller modules. Blank lines and comments don't count toward the limit. Test files are exempt.

**Rationale:** Large files are hard to navigate and often indicate that a module has too many responsibilities.

**Enforcement:** linted, via `max-lines`.

---

### Keep nesting shallow

```ts
// Bad
if (a) {
  for (x in items) {
    if (b) {
      for (y in things) {
        if (c) {
          while (d) { // 6 levels deep, over the limit
```

```ts
// Good: use early returns and extracted functions
if (!a) return;
for (x in items) {
  if (!b) continue;
  processThings(x);
}
```

**Rationale:** Deeply nested code is hard to follow. Extract inner logic into functions or use early returns to flatten the structure.

**Enforcement:** linted. `max-depth` allows 5 levels. Test files are exempt.

---

### Never force push or amend commits

Always create new commits. Never use `git push --force` or `git commit --amend`.

**Rationale:** Force-pushing and amending can destroy work and make history hard to follow.

**Enforcement:** convention only.
