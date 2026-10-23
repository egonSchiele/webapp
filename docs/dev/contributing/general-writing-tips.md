## General writing tips

1. Avoid garden path sentences.

Bad: a sentence that begins like this:

```
The name lists partition
```

When you read the sentence, what do you think it means? I think it means that a name lists some partitions. Here is the full sentence:

```
The name lists partition the catalog's managed (`source:"remote"`) entries by what changed.
```

It turns out that there is something called a "name list", which partitions something in the catalog. Avoid sentences like this, because they make the reader realize halfway through reading the sentence that the words don't mean what the reader thought they meant, and they have to re-read the sentence to take into account the information they gained in the second half of the sentence. A classic garden path sentence begins with the words "the old man". What do you think it's going to tell us about the old man? Actually, the full sentence is "the old man the boat". Notice how the first half of the sentence makes you think it's talking about an old man, and it's not until you read the second half that you realize that it's talking about elderly people as a group.

Good: 

```
The catalog's entries are partitioned by name lists.
```

2. Use active voice, avoid passive voice.

Bad: "The man was bitten by the dog."
Good: "The dog bit the man."

Passive voice makes you focus on the person or object receiving the action, rather than the person or object performing it. Passive voice is typically harder to read and less interesting.

Other examples:

Bad: "The session cookie is checked by the auth middleware on every request."
Good: "The auth middleware checks the session cookie on every request."

3. Avoid introducing too many concepts in a single sentence.

If you find yourself using multiple commas, semicolons, or conjunctions in a sentence, consider breaking it up into multiple sentences.

Bad:
```
The name lists partition the catalog's managed (`source:"remote"`) entries by what changed.
```

Notice how the sentence tries to squeeze in the `source:"remote"` qualifier to an already complicated sentence. If you need to parenthesize something in your sentence, consider whether it would be clearer as two sentences instead.

```
Parse command-line flags with strict number coercion, required flags and defaults, mutually-exclusive groups, and auto-generated `--help` / `--version`.
```

This sentence introduces so many things that by the time the reader has reached the end of the sentence, they have already forgotten the beginning of the sentence.

```
a request without a valid session cookie gets a 401; the frontend catches it and redirects to the sign-in page, which sends the user back afterward.
```

Here is an example where two sentences would have been clearer than one with a semicolon.

4. Emdash overuse

An emdash used sparingly can make the text more lively, but used all the time, it becomes jarring. If you are using an emdash, consider using a comma instead.

Bad: "Each file under `src/backend/routes/` exports its handlers, which express-file-routing loads at startup — so adding a file adds an endpoint."
Good: "Each file under `src/backend/routes/` exports its handlers, which express-file-routing loads at startup, so adding a file adds an endpoint."

Or use a conjunction instead of an emdash:
Bad: "The insert and the update run inside the same transaction — rolling it back undoes both."
Good: "The insert and the update run inside the same transaction, so rolling it back undoes both."

5. Consider whether this level of detail is actually required in the sentence.

You have a habit of trying to add more information in parentheses. Often, it's not needed, and actually hinders understanding by making the sentence longer.

Bad: "A request that fails validation (a missing field, a malformed email, or a note over 500 characters) returns a failure with an error message."
Good: "A request that fails validation returns a failure with an error message."

Every time you add something in parentheses, consider that the user's brain is going to need to pause and add a new frame to their mental "stack" to capture this new information. Is that speed bump worth the information you're trying to convey?

## Structural rules

The rules above are about sentences. A text can pass all of them and still be hard to read, because its shape is wrong. These rules are about shape.

6. Write for the person who reads this later.

The reader is not the reviewer today, and it is not you. Anything that records your process does not belong: what you tried, what went wrong, why you added a rule. Git history keeps that.

Bad:

```
The seed script inserts the users first, then the moods. Before this change, the seeds ran in an arbitrary order, so the moods seed sometimes ran first and failed because the users it referenced did not exist yet. Any future seed that references another table will need a number prefix too.
```

Good:

```
The seed script inserts the users first, then the moods.
```

The second and third sentences are the story of how the bug was found and a note for a follow-up. A future maintainer needs neither.

7. Show the example first, then describe it.

When the subject is code, put the code in a block before the prose. Then say one thing about it. Never put a code fragment inside a clause of a sentence.

Bad:

```
Routes export one array per HTTP method: `export const get = [isLoggedIn, async (req, res) => { ... }]`, the middleware runs before the handler, and each handler returns its result with success() or failure().
```

Good:

```
Here's an example of a route:

    export const get = [
      isLoggedIn,
      async (req: Request, res: Response): Promise<ApiMoodsResponseGet> => {
        const moods = await findMoods({ criteria: {} });
        return success(moods);
      },
    ];

The export name is the HTTP method. `isLoggedIn` runs before the handler.
```

8. One kind of thing per paragraph.

An example, an explanation, a checklist, and a scoring rule are four kinds of thing. Give each its own paragraph, and number a checklist. A reader should never have to work out which sentence is which.

Bad: one paragraph that starts "Four things, each worth a quarter. (1) The route rejects a request with no session cookie...", describes syntax in the middle, and ends with two sentences about what scores zero.

Good:

```
<code example>

<one or two sentences explaining the example>

Make sure that:
1. ...
2. ...
3. ...

All three of these points count equally towards the final score.
```

9. One fact per sentence.

Rules 3 and 5 say when a sentence is too full. This rule is the target: split until each sentence carries one fact. A parenthetical is either a second sentence or it is nothing.

Bad:

```
It calls deleteMood inside a route that requires a logged-in user, and that route sits under the `/api/admin` prefix, whose middleware rejects requests from users who are not admins and otherwise passes them through.
```

Good:

```
This route calls deleteMood and requires a logged-in user. It sits under the `/api/admin` prefix. The middleware for that prefix rejects requests from users who are not admins, and passes the rest through.
```

10. Say it plainly, and make the reader the actor.

Do not name a scheme cleverly, and do not write about code as if it were a person doing something. Tell the reader what they can do, and point them at the example.

Bad: "Four things, each worth a quarter."
Good: "All four of these points count equally towards the final score."

Bad: "A route can carry its own middleware, as the moods route does."
Good: "You can add middleware to a route. See `src/backend/routes/api/moods.ts` for an example."

Bad: "The auth middleware has the last word: anything the earlier checks let through, it turns away."
Good: "The auth middleware rejects every request from a user who has not been approved."

In the second bad example the route is the actor. In the third, the phrase "has the last word" is a metaphor standing in for a fact.
