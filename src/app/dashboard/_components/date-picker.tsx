"use client";

import { useRouter } from "next/navigation";

export function DatePicker({ date }: { date: string }) {
  const router = useRouter();

  return (
    <input
      type="date"
      value={date}
      onChange={(e) => {
        if (e.target.value) router.push(`/dashboard?date=${e.target.value}`);
      }}
      className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
    />
  );
}
