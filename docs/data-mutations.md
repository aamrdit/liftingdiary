# Data Mutation Standards

## The Rules at a Glance

| Concern | Rule |
|---|---|
| Where to write DB logic | `data/` helper functions only |
| Where to call mutations | Server Actions only |
| Where to define Server Actions | Colocated `actions.ts` files |
| Server Action param types | Typed objects — never `FormData` |
| Server Action validation | Zod — always, before any DB call |

---

## DB Writes: `data/` Helpers Only

All database mutations must go through helper functions in the `data/` directory. These wrap Drizzle ORM calls — **never write raw SQL and never call `db` directly from a Server Action or component**.

```
data/
  workouts.ts   // createWorkout, updateWorkout, deleteWorkout, etc.
  sets.ts       // createSet, updateSet, deleteSet, etc.
```

### Helper function structure

Every helper that mutates user-owned data **must** accept `userId` and use it as a filter on any `update` or `delete` to prevent cross-user writes. This is non-negotiable.

```ts
// data/workouts.ts — correct
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function createWorkout(userId: string, date: Date) {
  const [workout] = await db
    .insert(workouts)
    .values({ userId, date })
    .returning()
  return workout
}

export async function deleteWorkout(userId: string, workoutId: number) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
}

export async function updateWorkout(
  userId: string,
  workoutId: number,
  data: { date?: Date; notes?: string }
) {
  const [updated] = await db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning()
  return updated ?? null
}
```

```ts
// BAD — never do this
export async function deleteWorkout(workoutId: number) {
  await db.delete(workouts).where(eq(workouts.id, workoutId))
  // ❌ no userId guard — any record can be deleted
}
```

---

## Server Actions: The Only Mutation Entry Point

All mutations triggered by the UI must go through **Server Actions**. Never call `data/` helpers from client components directly, never mutate via route handlers.

### Colocation rule

Server Actions live in a file named `actions.ts` colocated with the route or feature they serve.

```
app/
  dashboard/
    workout/
      [id]/
        page.tsx
        actions.ts   ← Server Actions for this route
    actions.ts       ← Server Actions for the dashboard feature
```

### File structure

Every `actions.ts` file must have `"use server"` at the top.

```ts
"use server"

import { auth } from "@clerk/nextjs/server"
import { z } from "zod"
import { createWorkout } from "@/data/workouts"

// schema defined once, reused for type inference
const CreateWorkoutSchema = z.object({
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
})

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = CreateWorkoutSchema.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input")

  return createWorkout(userId, parsed.data.date)
}
```

---

## Param Types: No FormData

Server Action parameters must be **typed objects**. Do not accept `FormData` or untyped inputs.

```ts
// ✅ correct — typed object param
export async function deleteSetAction(input: { setId: number }) { ... }

// ❌ wrong — FormData
export async function deleteSetAction(formData: FormData) { ... }

// ❌ wrong — untyped
export async function deleteSetAction(data: any) { ... }
```

Use `z.infer<typeof Schema>` to derive the TypeScript type from the Zod schema so the type and validation stay in sync automatically.

---

## Validation: Zod on Every Action

Every Server Action must validate its arguments with Zod before touching the database. Use `safeParse` and throw on failure — do not silently ignore invalid input.

```ts
"use server"

import { z } from "zod"
import { auth } from "@clerk/nextjs/server"
import { updateWorkout } from "@/data/workouts"

const UpdateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  notes: z.string().max(500).optional(),
})

type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>

export async function updateWorkoutAction(input: UpdateWorkoutInput) {
  const { userId } = await auth()
  if (!userId) throw new Error("Unauthorized")

  const parsed = UpdateWorkoutSchema.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input")

  return updateWorkout(userId, parsed.data.workoutId, {
    notes: parsed.data.notes,
  })
}
```

The auth check comes before validation — there is no point validating input for an unauthenticated request.

---

## Calling Actions from the UI

Call Server Actions from client components with a regular `async` call — no `fetch`, no route handler.

```tsx
"use client"

import { createWorkoutAction } from "./actions"

export function CreateWorkoutButton() {
  async function handleClick() {
    await createWorkoutAction({ date: new Date() })
  }

  return <Button onClick={handleClick}>Log Workout</Button>
}
```

After a mutation, call `revalidatePath` or `revalidateTag` inside the Server Action (not in the client) to invalidate cached Server Component data.

```ts
import { revalidatePath } from "next/cache"

export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ... auth + validate ...
  const workout = await createWorkout(userId, parsed.data.date)
  revalidatePath("/dashboard")
  return workout
}
```

---

## Redirects: Client-Side Only

**Never call `redirect()` inside a Server Action.** Do the redirect in the client component after the action resolves.

```ts
// ❌ wrong — redirect() inside a Server Action
export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ...
  const workout = await createWorkout(userId, parsed.data.date)
  redirect(`/dashboard?date=${format(workout.startedAt, "yyyy-MM-dd")}`) // ❌
}
```

```tsx
// ✅ correct — Server Action returns data, client redirects
// actions.ts
export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ...
  const workout = await createWorkout(userId, parsed.data.date)
  revalidatePath("/dashboard")
  return workout
}

// client component
"use client"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export function NewWorkoutForm() {
  const router = useRouter()

  async function onSubmit(values: FormValues) {
    const workout = await createWorkoutAction(values)
    router.push(`/dashboard?date=${format(workout.startedAt, "yyyy-MM-dd")}`)
  }
}
```

`redirect()` throws a special error internally that can interfere with error boundaries and leaves the client in an inconsistent state. Keeping redirects in the client gives you full control over navigation and error handling.

---

## Summary: Full Example

```
app/dashboard/actions.ts          ← "use server", Zod schemas, Server Actions
data/workouts.ts                  ← Drizzle ORM helpers, always filtered by userId
```

```ts
// data/workouts.ts
export async function createWorkout(userId: string, date: Date) { ... }

// app/dashboard/actions.ts
"use server"
const Schema = z.object({ date: z.coerce.date() })
export async function createWorkoutAction(input: z.infer<typeof Schema>) {
  const { userId } = await auth(); if (!userId) throw new Error("Unauthorized")
  const parsed = Schema.safeParse(input); if (!parsed.success) throw new Error("Invalid input")
  const workout = await createWorkout(userId, parsed.data.date)
  revalidatePath("/dashboard")
  return workout
}

// app/dashboard/some-client-component.tsx
"use client"
await createWorkoutAction({ date: new Date() })
```
