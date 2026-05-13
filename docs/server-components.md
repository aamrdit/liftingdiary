# Server Component Standards

## `params` and `searchParams` Are Promises — Always Await Them

In this project (Next.js 16 / React 19), `params` and `searchParams` passed to page components are **Promises**, not plain objects. You must `await` them before accessing any property.

This is a breaking change from older Next.js versions. Do not rely on training data or prior experience that treats these as synchronous objects.

```tsx
// ✅ correct — await params before destructuring
interface Props {
  params: Promise<{ workoutId: string }>
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = await params
  // workoutId is now a string
}
```

```tsx
// ❌ wrong — synchronous access throws at runtime
interface Props {
  params: { workoutId: string }
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutId } = params  // ❌ params is a Promise, this is undefined
}
```

The same rule applies to `searchParams`:

```tsx
interface Props {
  searchParams: Promise<{ date?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const { date } = await searchParams
}
```

---

## Type the Props Correctly

Always type `params` and `searchParams` as `Promise<...>` in the component's prop interface. TypeScript will catch incorrect usage if typed properly.

```tsx
// Dynamic route: app/dashboard/workout/[workoutId]/page.tsx
interface Props {
  params: Promise<{ workoutId: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}
```

---

## Server Components Are `async` by Default

All page and layout components should be declared `async`. This is what enables `await` for `params`, `auth()`, and data helpers.

```tsx
// ✅ correct
export default async function SomePage({ params }: Props) {
  const { id } = await params
  const { userId } = await auth()
  const record = await getRecordById(userId, id)
  // ...
}
```

---

## Summary Checklist

| Concern | Rule |
|---|---|
| Accessing route params | Always `await params` — it is a Promise |
| Accessing query string | Always `await searchParams` — it is a Promise |
| Props type for `params` | `Promise<{ slug: string }>` — not a plain object |
| Page component signature | Always `async` |
