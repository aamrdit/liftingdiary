# UI Coding Standards

## Component Library

**All UI must be built exclusively with [shadcn/ui](https://ui.shadcn.com) components.**

No custom components. If a shadcn/ui component exists for the UI need, use it. If a composition of shadcn/ui primitives satisfies the need, use that. Do not create bespoke component files as alternatives to shadcn/ui building blocks.

### Adding components

Install components via the CLI:

```bash
npx shadcn@latest add <component-name>
```

Components are added to `components/ui/`. Import them from there:

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

### What this means in practice

- Need a button? Use `<Button>` from shadcn/ui.
- Need a modal/dialog? Use `<Dialog>`.
- Need a date input? Use `<Calendar>` or `<Popover>` + `<Calendar>`.
- Need a form field? Use `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`.
- Need a loading state? Use shadcn/ui `<Skeleton>`.

If you find yourself writing a new `.tsx` file that wraps or reimplements UI, stop and find the shadcn/ui equivalent.

---

## Date Formatting

All date formatting must use **[date-fns](https://date-fns.org)**.

Dates must be displayed in the following format: ordinal day, abbreviated month, full year.

| Date | Displayed as |
|------|-------------|
| 2025-09-01 | 1st Sept 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2024-06-04 | 4th Jun 2024 |

### Implementation

```ts
import { format } from "date-fns"

// "do MMM yyyy" produces: 1st Sept 2025, 2nd Aug 2025, etc.
format(date, "do MMM yyyy")
```

Do not use `Date.prototype.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date formatting utility. Use `date-fns` exclusively.
