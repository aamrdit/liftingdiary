# Routing Standards

## The Rule: All App Routes Live Under `/dashboard`

Every application route must be nested under `/dashboard`. There are no top-level app pages — the root `/` redirects users to the dashboard.

```
app/
  dashboard/
    page.tsx                          // /dashboard
    layout.tsx                        // shared dashboard layout
    workout/
      page.tsx                        // /dashboard/workout
      [workoutId]/
        page.tsx                      // /dashboard/workout/[workoutId]
```

Do not create top-level pages (e.g. `app/about/page.tsx`) for authenticated app features. Public-facing pages (marketing, sign-in, sign-up) are the only exception.

---

## Route Protection: Middleware Is the Gatekeeper

All `/dashboard` routes are protected. Protection is enforced in `middleware.ts` using Clerk — **not** inside individual page components.

```ts
// middleware.ts (project root)
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect()
  }
})

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
}
```

- `auth.protect()` redirects unauthenticated users to the Clerk sign-in page automatically.
- Every route not explicitly listed as public is treated as protected.
- Do not duplicate this check inside page components — the middleware is the authoritative guard.

---

## Public Routes

Only these routes are public (no auth required):

| Path | Purpose |
|---|---|
| `/` | Marketing / landing page |
| `/sign-in` | Clerk sign-in |
| `/sign-up` | Clerk sign-up |

Everything else requires authentication. When adding a new public route, add it to the `isPublicRoute` matcher in `middleware.ts`.

---

## Dynamic Segments

Use Next.js dynamic segments for resource-based routes:

```
app/dashboard/workout/[workoutId]/page.tsx   // /dashboard/workout/42
```

Params are always strings — parse and validate before use:

```tsx
export default async function WorkoutPage({ params }: { params: { workoutId: string } }) {
  const id = Number(params.workoutId)
  if (isNaN(id)) notFound()
  // ...
}
```

---

## Navigation

Use Next.js `<Link>` for all internal navigation. Never use `<a href>` for in-app links.

```tsx
import Link from "next/link"

<Link href="/dashboard/workout/new">New Workout</Link>
```

For programmatic navigation in Server Actions or after mutations, use `redirect()` from `next/navigation`:

```ts
import { redirect } from "next/navigation"

redirect(`/dashboard/workout/${newWorkoutId}`)
```

---

## Summary Checklist

| Concern | Rule |
|---|---|
| Route location | All app routes under `/dashboard` |
| Route protection | Middleware only — `clerkMiddleware` + `auth.protect()` |
| Per-page auth checks | Do not duplicate — middleware handles it |
| Public routes | `/`, `/sign-in`, `/sign-up` only |
| Dynamic params | Always strings — parse and validate before use |
| Internal links | `<Link>` only — never `<a href>` |
| Programmatic redirect | `redirect()` from `next/navigation` |
