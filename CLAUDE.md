This is a web app written in React, TypeScript, and Node. Kysely is used as the ORM, and Vite is used to build assets. All the frontend code lives in `src/frontend`, while the backend lives in `src/backend`.


## notable files and folders
- `src/frontend/`: Contains all the frontend code, including React components, pages, and styles.
- `src/backend/`: Contains all the backend code, including API routes, database access, and middleware.
- `src/backend/routes/api/`: Contains all the API routes for the backend.
- `src/common/`: Contains code that is shared between the frontend and backend, such as types and utility functions.

## Troubleshooting
If you get errors related to apiClient.ts, you may need to recompile it. Run `pnpm run compile-client` to do so.

# Code Guidelines

## Relative vs. Absolute Imports

Always prefer absolute imports.  There are path aliases defined in `src/frontend/tsconfig.json` and `src/backend/tsconfig.json`. For example, if you wanted to write an absolute import for the file at 

```
src/backend/lib/middleware/auth.js
```

you would write

```
@/backend/lib/middleware/auth.js
```

Remember to add the `.js` suffix at the end.

## error handling
For error handling, instead of throwing exceptions, prefer using the `Result` type defined in `src/common/types.ts`. For functions that can fail, the return type should be a `Result`, and the function should return either a `Success` or a `Failure`.

## General code quality guidelines
- Avoid having excessively long functions. Split up long functions into multiple functions where it makes sense. Each function should do one thing.
- Split up a React component into sub-components when it makes sense.
- Avoid sharing state. Make as many things private as possible. This will make code much easier to reason about.
- Have no side effects, if possible. All functions should be deterministic when possible, accepting inputs and returning outputs, and avoiding modifying any shared state in between. 
- Don't write long functions, please break up into sub-functions, so each function has a single purpose.
- Never use a Map, always use objects.
- If a function has more than two parameters, use named parameters.

## Typescript coding guidelines
- Always type your variables, function parameters, and return types explicitly. Avoid using `any`.
- Avoid using `as` for type assertions unless absolutely necessary.
- Use types instead of interfaces.

Bad:

```typescript
interface User {
  id: number;
  name: string;
}
```

Good:

```typescript
type User = {
  id: number;
  name: string;
};
```

## General code guidelines

- Keep your code modular.
- Use descriptive variable names, avoid one or two letter variable names.

If finding yourself defining the same function or type over and over again, refactor it out into a common file.

For utility functions:
- If the function will be used only on the backend, add it to `src/backend/util.ts`.
- If it will be used only on the frontend, add it to `src/frontend/util.ts`.
- If it will be used on both, add it to `src/common/util.ts`.

Similarly, for types:
- If the type will be used only on the backend, add it to `src/backend/types.ts`.
- If it will be used only on the frontend, add it to `src/frontend/types.ts`.
- If it will be used on both, add it to `src/common/types.ts`.

## To run tests

Run

```
make test
```

## UI Guidelines
Please remember to use the components exported from the egon-ui package when building UIs.

