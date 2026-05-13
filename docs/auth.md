# Authentication Standards

## The Rule: Clerk Exclusively

**This app uses [Clerk](https://clerk.com) for all authentication. Do not implement custom auth, session handling, or any other auth library.**

Never use:
- `next-auth` / `auth.js`
- JWT libraries (`jsonwebtoken`, `jose`, etc.)
- Custom session cookies or tokens
- Any hand-rolled sign-in/sign-up logic

---

## Provider Setup

`ClerkProvider` must wrap the entire app in `app/layout.tsx`. It is already in place — do not add it anywhere else.

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
```

---

## Server Components: `auth()` from `@clerk/nextjs/server`

In any Server Component or async function that runs on the server, get the current user via `auth()`:

```tsx
import { auth } from "@clerk/nextjs/server"

export default async function ProtectedPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  // userId is safe to use here
}
```

- Always `await auth()` — it is async.
- Always destructure `userId` — that is the stable identifier to store and query against.
- If `userId` is `null`, the user is not signed in. Redirect to `/sign-in` or return `notFound()` depending on context.

**Never import from `@clerk/nextjs` in a Server Component** — only `@clerk/nextjs/server` has the server-safe exports.

---

## Client Components: Clerk UI Components and Hooks

Client components use the `@clerk/nextjs` package for UI and hooks.

### Conditionally rendering signed-in / signed-out UI

Use the `<Show>` component:

```tsx
"use client"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"

<Show when="signed-in">
  <UserButton />
</Show>

<Show when="signed-out">
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
</Show>
```

### Reading the current user in a client component

```tsx
"use client"
import { useUser } from "@clerk/nextjs"

export function ProfileBadge() {
  const { user } = useUser()
  return <span>{user?.fullName}</span>
}
```

### Checking auth state in a client component

```tsx
"use client"
import { useAuth } from "@clerk/nextjs"

export function SomeClientFeature() {
  const { userId, isLoaded } = useAuth()
  if (!isLoaded) return null
  if (!userId) return <p>Please sign in.</p>
  // ...
}
```

**Never call `auth()` (the server function) in a client component** — it will throw. Use hooks instead.

---

## Route Protection

Protect routes in the Server Component itself — check `userId` and redirect immediately:

```tsx
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")
  // ...
}
```

Do not rely solely on middleware for route protection. The Server Component guard is the authoritative check.

---

## The `userId` Contract

`userId` is the Clerk user ID (a string like `user_2abc...`). It is the **only** user identifier stored in the database.

- Every database table with user-owned rows has a `userId` column.
- Every data helper that reads or writes user data accepts `userId` as a parameter and filters by it.
- Never expose `userId` values in client-accessible URLs or responses unless intentional.

See `data-fetching.md` for how `userId` flows into database queries.

---

## Summary Checklist

| Concern | Rule |
|---|---|
| Auth library | Clerk only — no other auth packages |
| Getting user on server | `auth()` from `@clerk/nextjs/server` |
| Getting user on client | `useAuth()` / `useUser()` hooks |
| Conditional UI | `<Show when="signed-in/out">` |
| Protecting a route | Check `userId` in the Server Component, redirect if null |
| User identifier in DB | `userId` (Clerk ID) — nothing else |
| Provider location | `ClerkProvider` in root `layout.tsx` only |
