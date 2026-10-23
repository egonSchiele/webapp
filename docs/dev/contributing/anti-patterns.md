# Anti-Pattern Catalog

Common mistakes to avoid when writing code in this codebase. Each entry has a concrete before/after example. Read this before starting a task.

### Duplicating existing code

**What it looks like:** Reimplementing something that already exists in the codebase instead of finding and reusing it.

**Bad:**
```tsx
// Writing a new date formatter inside a component
function MoodRow({ mood }: { mood: Mood }) {
  const createdAt = new Date(mood.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return <div>{createdAt}</div>;
}
```

**Good:**
```tsx
// Use the existing formatDate from src/frontend/util.ts
import { formatDate } from "@/frontend/util.js";

function MoodRow({ mood }: { mood: Mood }) {
  return <div>{formatDate(new Date(mood.created_at))}</div>;
}
```

**Why:** The codebase already has utilities for common operations. Always search for existing implementations before writing new code.

---

### Imperative code everywhere

**What it looks like:** Imperative code spread everywhere, instead of a few places that encapsulate it behind a declarative interface. Split the logic for the "what" apart from the logic for the "how". Then a future change usually only touches the "what".

**Bad:**
```ts
const result: string[] = [];
for (const user of users) {
  if (user.approved) {
    if (user.role === "admin") {
      const email = user.email;
      if (!result.includes(email)) {
        result.push(email);
      }
    }
  }
}
```

**Good:**
```ts
const emails = users
  .filter((user) => user.approved && user.role === "admin")
  .map((user) => user.email);
const result = [...new Set(emails)];
```

**Why:** The declarative version says *what* we want (emails of approved admins, deduplicated), not *how* to get it. Imperative code should be encapsulated behind a clear declarative interface.

---

### Order-dependent mutable state

**What it looks like:** Code where multiple variables must be set in a specific sequence to work correctly. Reordering lines breaks things silently.

**Bad:**
```ts
let role = "guest";
let homePath = "";
let showAdminLink = false;

// these must happen in this exact order or things break
role = determineRole(user);
homePath = role === "admin" ? "/admin" : "/moods";
showAdminLink = homePath === "/admin" && user.approved;
```

**Good:**
```ts
const role = determineRole(user);
const homePath = role === "admin" ? "/admin" : "/moods";
const showAdminLink = role === "admin" && user.approved;
```

**Why:** Using `const` and deriving each value from its inputs (not from other mutable variables) makes the dependencies explicit. You can read any line in isolation without worrying about what happened before it.

Note: this rule does not apply to parsers, which need to have a specific order due to their very nature.

---

### Leaky abstractions

**What it looks like:** Code where understanding one piece requires reading many other pieces because they're all connected. The internal implementation details leak into the interface.

**Bad:**
```ts
// Route handler has to know how the session is stored
async (req: Request, res: Response) => {
  const token = req.cookies.token;
  const decoded = await admin.auth().verifyIdToken(token);
  const user = await db.selectFrom("users").where("email", "=", decoded.email)...
  // manually rebuild the current user from auth internals...
}
```

**Good:**
```ts
// The isLoggedIn middleware hides the internals
export const get = [
  isLoggedIn,
  async (req: Request, res: Response) => {
    const user = res.locals.user;
    // ...
  },
];
```

**Why:** Good abstractions have clear boundaries. You should be able to understand what a unit does without reading its internals, and change the internals without breaking consumers.

### Useless special cases

**Bad:**
```ts
if (arr.length === 0) {
  return [];
} else {
  return arr.map(x => x * 2);
}
```

**Good:**
```ts
return arr.map(x => x * 2);
```

**Why:** Special cases add cognitive overhead. If the code works correctly without the special case, don't add it.

### Inconsistent patterns

**What it looks like:** Similar operations are implemented in different ways across the codebase, making it harder to read and maintain.

**Bad:**
```ts
// In one file
function getUser(id: string): User {
  // implementation A
}

// In another file
function fetchUser(id: string): User {
  // implementation B
}
```

**Good:**
```ts
// Standardize on one pattern for fetching users
function getUser(id: string): User {
  // consistent implementation
}
```

**Why:** Consistency makes it easier to understand and predict code behavior. When similar operations follow the same pattern, developers can quickly grasp new code by relating it to what they already know.

### Nested ternaries

**Bad:**
```ts
const status = isLoading ? "loading" : isError ? "error" : "success";
```

**Good:**
```ts
let status: "loading" | "error" | "success";
if (isLoading) {
  status = "loading";
} else if (isError) {
  status = "error";
} else {
  status = "success";
}
```

**Why:** Nested ternaries can be hard to read and understand at a glance. Using if/else statements improves readability, especially for more complex conditions.

### Using a try-catch block without logging anything in the catch block

**Why:** A silent catch swallows the error. Nothing is logged, so the failure is very hard to trace.

**Bad:**

```ts
try {
  // some code that might throw an error
} catch (e) {
  // do nothing, not even logging the error
}
```

**Good:**

```ts
try {
  // some code that might throw an error
} catch (e) {
  console.error("An error occurred:", e);
  // optionally rethrow the error if it should be handled by an outer layer
  throw e;
}
```

### One-line if statements

**Why:** One-line if statements are hard to read and maintain, especially when the branch holds complex logic. Use a block statement instead.

**Bad:**
```ts
if (condition) doSomething();
```

**Good:**
```ts
if (condition) {
  doSomething();
}
```

### Putting too much stuff onto a single line

**Why:** Too much logic on one line is hard to read. Break it across several lines.

**Bad:**
```ts
const result = someArray.filter(x => x.isActive).map(x => x.value).reduce((acc, val) => acc + val, 0);
```

**Good:**
```ts
const activeValues = someArray.filter(x => x.isActive).map(x => x.value);
const result = activeValues.reduce((acc, val) => acc + val, 0);
```

### Nested objects in type definitions

**Why:** Deeply nested objects in type definitions make the code harder to read and maintain. Break them into separate named types.

**Bad:**
```ts
type Foo = { llm?: { retries?: number; timeout?: number; backoff?: { initial?: number; factor?: number; max?: number } } };
```

**Good:**
```ts
type BackoffConfig = {
  initial?: number;
  factor?: number;
  max?: number;
};

type LLMConfig = {
  retries?: number;
  timeout?: number;
  backoff?: BackoffConfig;
};

type Foo = {
  llm?: LLMConfig;
};
```

### Dynamic requires

**Why:** Dynamic requires make code difficult to analyze and optimize. Always use static imports. Dynamic `import()` expressions are banned too, see [coding-standards.md](coding-standards.md).

**Bad:**
```ts
const makeId = () => require("nanoid").nanoid();
```

**Good:**
```ts
import { nanoid } from "nanoid";
const makeId = () => nanoid();
```

### Magic numbers

**Why:** Magic numbers are hard to understand and maintain. Use named constants to give the values some context.

**Bad:**
```ts
// why use 5000? what does it mean?
for (let i = 0; i < 5000; i++) {
  
}
```

**Good:**
```ts
const MAX_ITERATIONS = 5000;
for (let i = 0; i < MAX_ITERATIONS; i++) {

}
```

### Single character variable names

**Why:** Single character variable names are unclear and make the code harder to read. Use descriptive names that convey the purpose of the variable.

**Bad:**
```ts
const a = getUserData();

function f(a) {
  return a;
}
```

**Good:**
```ts
const userData = getUserData();

function processUserData(userData) {
  return userData;
}
```

### Ugly code

Please never use this pattern.

```ts
{
        ...(traceFile ? { traceFile } : {}),
        ...(traceFile && { traceFile }),
}
```

The linter flags both forms.

### Writing tests where failures are catastrophic

**Bad:**

```ts
// test that the deleteDir function refuses to delete the home directory
deleteDir("~/")
```

Here is a test for a `deleteDir` function that is supposed to refuse to delete the home directory. Suppose the test fails. What will happen? **The function would delete the home directory**. Never write tests where if the test were to fail, something catastrophic could happen.