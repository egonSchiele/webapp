# Coding Standards

Rules for writing code in this codebase. Some are enforced by ESLint (`pnpm run lint`, configured in `eslint.config.js`). The rest are conventions we follow by hand. Each rule below says which it is.

---

### Use `type`, not `interface`

```ts
// Bad
interface Foo { name: string }

// Good
type Foo = { name: string }
```

**Rationale:** Consistency. The codebase uses `type` everywhere, and `interface` introduces a second way to do the same thing.

**Enforcement:** convention only.

---

### Use plain objects instead of `Map`

```ts
// Bad
const lookup = new Map<string, number>();

// Good
const lookup: Record<string, number> = {};
```

**Rationale:** Plain objects serialize cleanly to JSON, which matters for API responses, and they are simpler to work with. `JSON.stringify` turns a `Map` into `{}`.

**Enforcement:** convention only. The linter has no rule for `Map`.

---

### No dynamic imports

```ts
// Bad
const module = await import("@/backend/lib/foo.js");

// Good
import { foo } from "@/backend/lib/foo.js";
```

**Rationale:** Dynamic imports break static analysis and make the dependency graph harder to reason about.

**Enforcement:** convention only.

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

**Enforcement:** linted, via `prefer-const`, which the typescript-eslint recommended config turns on.

---

### Keep functions short

Keep every function under 150 lines, and aim well below that. If a function is getting long, break it into smaller, focused functions.

**Rationale:** Long functions are hard to understand, test, and modify. Smaller functions with clear names serve as documentation.

**Enforcement:** convention only. Test files are exempt.

---

### Keep files short

Keep every file under 1250 lines. If a file is approaching that, split it into smaller modules. Test files are exempt.

**Rationale:** Large files are hard to navigate and often indicate that a module has too many responsibilities.

**Enforcement:** convention only.

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

**Enforcement:** convention only. Stay at 5 levels or fewer. Test files are exempt.

---

### Never force push or amend commits

Always create new commits. Never use `git push --force` or `git commit --amend`.

**Rationale:** Force-pushing and amending can destroy work and make history hard to follow.

**Enforcement:** convention only.
