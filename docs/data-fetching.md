# Data Fetching Standards

## The Rule: Server Components Only

**All data fetching MUST be done exclusively in React Server Components.**

Never fetch data in:
- Route handlers (`app/api/*/route.ts`)
- Client components (`"use client"` files)
- Third-party data-fetching libraries on the client (SWR, React Query, etc.)

Server Components fetch data directly — no API layer in between. This is the Next.js App Router model. If you need data in a client component, fetch it in a Server Component ancestor and pass it down as props.

### What this looks like in practice

```tsx
// app/dashboard/page.tsx — correct
import { getWorkoutsForUser } from "@/data/workouts"
import { auth } from "@clerk/nextjs/server"

export default async function DashboardPage() {
  const { userId } = await auth()
  const workouts = await getWorkoutsForUser(userId)
  return <WorkoutList workouts={workouts} />
}
```

```tsx
// BAD — never do this
"use client"
useEffect(() => {
  fetch("/api/workouts").then(...)  // ❌ route handler + client fetch
}, [])
```

---

## Database Access: `data/` Helpers Only

All database queries must go through helper functions in the `data/` directory. These functions use Drizzle ORM — **never write raw SQL**.

```
data/
  workouts.ts   // getWorkoutsForUser, createWorkout, etc.
  sets.ts       // getSetsForWorkout, etc.
```

### Helper function structure

Every helper that returns user data **must** accept and filter by `userId`. This is non-negotiable.

```ts
// data/workouts.ts — correct
import { db } from "@/db"
import { workouts } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getWorkoutsForUser(userId: string) {
  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, userId))
}

export async function getWorkoutById(userId: string, workoutId: number) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.userId, userId), eq(workouts.id, workoutId)))
  return workout ?? null
}
```

```ts
// BAD — never do this
export async function getWorkoutById(workoutId: number) {
  return db.select().from(workouts).where(eq(workouts.id, workoutId))
  // ❌ no userId filter — any user's data is exposed
}
```

---

## Authorization: Users Must Only See Their Own Data

Every query for user-owned data must include the authenticated `userId` as a filter condition alongside any other conditions. This prevents horizontal privilege escalation — a logged-in user must never be able to retrieve another user's records, even by manipulating IDs in the URL.

**The contract:**

1. The Server Component calls `auth()` from `@clerk/nextjs/server` to get `userId`.
2. It passes `userId` to the data helper.
3. The helper includes `eq(table.userId, userId)` in every `.where()` clause — combined with `and()` when other conditions are also needed.
4. If the query returns nothing (the record doesn't exist **or** belongs to someone else), treat it as not found — never leak which case it is.

```tsx
// app/dashboard/workout/[id]/page.tsx
import { getWorkoutById } from "@/data/workouts"
import { auth } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"

export default async function WorkoutPage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return notFound()

  const workout = await getWorkoutById(userId, Number(params.id))
  if (!workout) return notFound()   // record missing or belongs to another user

  return <WorkoutDetail workout={workout} />
}
```

---

## Summary Checklist

| Concern | Rule |
|---|---|
| Where to fetch | Server Components only |
| How to query the DB | Drizzle ORM helpers in `data/` |
| Raw SQL | Never |
| Route handlers for data | Never |
| Client-side fetching | Never |
| User data isolation | Always filter by `userId` in every query |
